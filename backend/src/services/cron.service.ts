import cron from 'node-cron';
import { logger } from '../utils/logger';
import portfolioService from './portfolio.service';
import newsService from './news.service';
import cacheService from './cache.service';
import websocketService from './websocket.service';
import prisma from '../config/database';

/**
 * Scheduled jobs service
 */
class CronJobsService {
  private scheduledTasks: cron.ScheduledTask[] = [];

  /**
   * Initialize all cron jobs
   */
  initializeJobs(): void {
    // Portfolio analysis is now triggered manually via the UI.

    // Fetch news every 30 minutes for demo
    const newsJob = cron.schedule('*/30 * * * *', async () => {
      logger.debug('Running news fetch job...');
      await this.fetchAllNews();
    });
    this.scheduledTasks.push(newsJob);

    // Clean expired cache daily at midnight
    const cacheJob = cron.schedule('0 0 * * *', async () => {
      logger.debug('Running cache cleanup job...');
      await cacheService.cleanExpired();
    });
    this.scheduledTasks.push(cacheJob);

    // Clean old news data (older than 24 hours) daily at midnight
    const cleanNewsJob = cron.schedule('0 0 * * *', async () => {
      logger.debug('Running old news cleanup job...');
      await this.cleanOldNews();
    });
    this.scheduledTasks.push(cleanNewsJob);

    // Run cleanup once on startup to immediately purge anything older than 24 hours
    this.cleanOldNews().catch(err => {
      logger.error('Startup news cleanup error:', err);
    });

    // Register event to wake up and refresh metrics instantly when a browser client connects
    websocketService.onConnect(() => {
      logger.info('Active client connected: triggering immediate news refresh...');
      this.fetchAllNews().catch(err => logger.error('Immediate connection news fetch failed:', err));
    });

    logger.info('Cron jobs initialized successfully');
  }

  /**
   * Stop all scheduled jobs
   */
  stopJobs(): void {
    logger.info(`Stopping ${this.scheduledTasks.length} scheduled cron jobs...`);
    for (const task of this.scheduledTasks) {
      task.stop();
    }
    this.scheduledTasks = [];
    logger.info('All cron jobs stopped');
  }



  /**
   * Fetch news for all portfolio assets
   */
  private async fetchAllNews(): Promise<void> {
    try {
      // Standby check: Skip background news fetch if no browser clients are listening
      if (websocketService.getClientCount() === 0) {
        logger.debug('Skipping news fetch job: Standby mode (No active clients connected)');
        return;
      }

      const portfolios = await portfolioService.getPortfolio();

      if (portfolios.length === 0) {
        logger.debug('No assets in portfolio for news fetching');
        return;
      }

      // Group assets by type
      const cryptoAssets = portfolios
        .filter(p => p.assetType === 'CRYPTO')
        .map(p => p.assetName);

      const metalAssets = portfolios
        .filter(p => p.assetType === 'METAL')
        .map(p => p.assetName);

      let allNews: any[] = [];

      // Fetch news for crypto assets (returns only NEW news)
      if (cryptoAssets.length > 0) {
        logger.debug(`Fetching news for ${cryptoAssets.length} crypto assets...`);
        const cryptoNews = await newsService.fetchNewsForAssets(cryptoAssets, 'CRYPTO');
        allNews.push(...cryptoNews);
        logger.debug(`Found ${cryptoNews.length} new crypto news articles`);
      }

      // Fetch news for metal assets (returns only NEW news)
      if (metalAssets.length > 0) {
        logger.debug(`Fetching news for ${metalAssets.length} metal assets...`);
        const metalNews = await newsService.fetchNewsForAssets(metalAssets, 'METAL');
        allNews.push(...metalNews);
        logger.debug(`Found ${metalNews.length} new metal news articles`);
      }

      // Only broadcast if there are NEW news articles
      if (allNews.length > 0) {
        logger.debug(`Broadcasting ${allNews.length} NEW analyzed news articles via WebSocket`);
        websocketService.broadcastNews(allNews);

        // Also broadcast summary statistics
        await this.broadcastNewsSummary();
      } else {
        logger.debug('No new news articles to broadcast');
      }

      logger.debug('News fetch job completed');
    } catch (error) {
      logger.error('Error in news fetch job:', error);
    }
  }

  /**
   * Broadcast news summary statistics via WebSocket
   */
  private async broadcastNewsSummary(): Promise<void> {
    try {
      // Get latest news from last 24 hours
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const recentNews = await prisma.news.findMany({
        where: {
          createdAt: {
            gte: yesterday,
          },
        },
      });

      const cryptoNews = recentNews.filter(n => n.assetType === 'CRYPTO');
      const metalNews = recentNews.filter(n => n.assetType === 'METAL');

      const sentimentBreakdown = {
        positive: recentNews.filter(n => n.sentimentLabel === 'positive').length,
        negative: recentNews.filter(n => n.sentimentLabel === 'negative').length,
        neutral: recentNews.filter(n => n.sentimentLabel === 'neutral').length,
      };

      // Get top mentioned assets
      const assetCounts = new Map<string, number>();
      recentNews.forEach(news => {
        news.relatedAssets.forEach(asset => {
          assetCounts.set(asset, (assetCounts.get(asset) || 0) + 1);
        });
      });

      const topAssets = Array.from(assetCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([asset]) => asset);

      const summary = {
        totalArticles: recentNews.length,
        cryptoNews: cryptoNews.length,
        metalNews: metalNews.length,
        sentimentBreakdown,
        topAssets,
      };

      websocketService.broadcastNewsSummary(summary);
      logger.debug('News summary broadcasted via WebSocket');
    } catch (error) {
      logger.error('Error broadcasting news summary:', error);
    }
  }

  /**
   * Clean old news data
   */
  private async cleanOldNews(): Promise<void> {
    try {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const result = await prisma.news.deleteMany({
        where: {
          publishedAt: {
            lt: oneDayAgo,
          },
        },
      });
      logger.debug(`Cleaned ${result.count} old news articles older than 24 hours`);

      const chatResult = await prisma.chatHistory.deleteMany({
        where: {
          createdAt: {
            lt: oneDayAgo,
          },
        },
      });
      logger.debug(`Cleaned ${chatResult.count} old chat messages older than 24 hours`);

      const portfolioResult = await prisma.portfolio.deleteMany({
        where: {
          createdAt: {
            lt: oneDayAgo,
          },
        },
      });
      logger.debug(`Cleaned ${portfolioResult.count} old portfolios older than 24 hours`);
    } catch (error) {
      logger.error('Error cleaning old news:', error);
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CronJobsService();
