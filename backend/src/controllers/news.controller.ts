import { Request, Response } from 'express';
import newsService from '../services/news.service';
import { AssetType } from '@prisma/client';
import { logger } from '../utils/logger';
import portfolioService from '../services/portfolio.service';
import websocketService from '../services/websocket.service';
import cacheService from '../services/cache.service';
import prisma from '../config/database';

export const getNews = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      assetType,
      assetName,
      sentiment,
      startDate,
      endDate,
      limit,
      offset,
      since,
    } = req.query;

    const cacheKey = `api:news:${JSON.stringify(req.query)}`;
    const cachedResponse = await cacheService.get(cacheKey);
    
    if (cachedResponse) {
      res.json(cachedResponse);
      return;
    }

    const filter: any = {};

    if (assetType) filter.assetType = assetType as AssetType;
    if (assetName) filter.assetName = assetName as string;
    if (sentiment) filter.sentiment = sentiment as 'positive' | 'negative' | 'neutral';
    if (startDate) filter.startDate = new Date(startDate as string);
    if (endDate) filter.endDate = new Date(endDate as string);
    if (limit) filter.limit = parseInt(limit as string);
    if (offset) filter.offset = parseInt(offset as string);

    if (since) filter.startDate = new Date(parseInt(since as string));

    const { articles, total } = await newsService.getNews(filter);

    const responsePayload = {
      success: true,
      data: articles,
      pagination: {
        total,
        limit: filter.limit || 20,
        offset: filter.offset || 0,
      },
    };

    await cacheService.set(cacheKey, responsePayload, 60); // 60s cache
    res.json(responsePayload);
  } catch (error) {
    logger.error('Get news error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch news',
    });
  }
};

export const getNewsSummary = async (req: Request, res: Response) => {
  try {
    const { assetName } = req.params;

    const summary = await newsService.generateNewsSummary(assetName);

    res.json({
      success: true,
      data: {
        assetName,
        summary,
      },
    });
  } catch (error) {
    logger.error('Get news summary error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate news summary',
    });
  }
};

export const newsStream = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { assetType, assetName } = req.query;

  logger.info(`SSE connection established for news stream: ${assetName || 'all'}`);

  res.write('data: {"type":"connected","message":"News stream connected"}\n\n');

  const intervalId = setInterval(async () => {
    try {
      const filter: any = { limit: 5 };
      if (assetType) filter.assetType = assetType;
      if (assetName) filter.assetName = assetName;

      const { articles } = await newsService.getNews(filter);

      res.write(`data: ${JSON.stringify({
        type: 'news',
        data: articles,
        timestamp: new Date().toISOString(),
      })}\n\n`);
    } catch (error) {
      logger.error('Error in news stream:', error);
      res.write(`data: ${JSON.stringify({
        type: 'error',
        message: 'Error fetching news',
      })}\n\n`);
    }
  }, 30000);

  req.on('close', () => {
    clearInterval(intervalId);
    logger.info('SSE connection closed');
  });
};

export const triggerNewsFetch = async (req: Request, res: Response) => {
  logger.info('Manual news fetch triggered');

  // Respond immediately — the actual fetch & sentiment pipeline can take
  // minutes (HuggingFace calls). Holding the HTTP connection open causes
  // proxy timeouts (ECONNRESET). Results are pushed to WS clients when ready.
  res.status(202).json({
    success: true,
    message: 'News fetch started in background. Results will be broadcast via WebSocket.',
  });

  // Fire-and-forget background task
  (async () => {
    try {
      // Purge news older than 5 days
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const deleted = await prisma.news.deleteMany({
        where: { publishedAt: { lt: fiveDaysAgo } },
      });
      logger.info(`Purged ${deleted.count} news articles older than 5 days.`);

      const portfolios = await portfolioService.getPortfolio();

      if (portfolios.length === 0) {
        logger.info('No assets in portfolio to fetch news for.');
        return;
      }

      const cryptoAssets = portfolios
        .filter(p => p.assetType === 'CRYPTO')
        .map(p => p.assetName);

      const metalAssets = portfolios
        .filter(p => p.assetType === 'METAL')
        .map(p => p.assetName);

      let allNews: any[] = [];

      if (cryptoAssets.length > 0) {
        const cryptoNews = await newsService.fetchNewsForAssets(cryptoAssets, 'CRYPTO');
        allNews.push(...cryptoNews);
      }

      if (metalAssets.length > 0) {
        const metalNews = await newsService.fetchNewsForAssets(metalAssets, 'METAL');
        allNews.push(...metalNews);
      }

      if (allNews.length > 0) {
        websocketService.broadcastNews(allNews);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const recentNews = await prisma.news.findMany({
          where: { createdAt: { gte: yesterday } },
        });

        const summary = {
          totalArticles: recentNews.length,
          cryptoNews: recentNews.filter(n => n.assetType === 'CRYPTO').length,
          metalNews: recentNews.filter(n => n.assetType === 'METAL').length,
          sentimentBreakdown: {
            positive: recentNews.filter(n => n.sentimentLabel === 'positive').length,
            negative: recentNews.filter(n => n.sentimentLabel === 'negative').length,
            neutral: recentNews.filter(n => n.sentimentLabel === 'neutral').length,
          },
          topAssets: [],
        };

        websocketService.broadcastNewsSummary(summary);
        logger.info(`Background news fetch complete: ${allNews.length} articles broadcast.`);
      }
    } catch (error) {
      logger.error('Background news fetch error:', error);
    }
  })();
};


