import { Server as HTTPServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { logger } from '../utils/logger';
import { NewsArticle } from './news.service';
import prisma from '../config/database';

export type ClientConnectCallback = () => void;

/**
 * WebSocket service for real-time news updates
 */
class WebSocketService {
  private wss: WebSocketServer | null = null;
  private clients: Set<WebSocket> = new Set();
  private clientSubscriptions: Map<WebSocket, Set<string>> = new Map();
  private connectionCallbacks: ClientConnectCallback[] = [];
  private ipConnections: Map<string, number> = new Map();

  /**
   * Register a callback to fire when a new client connects
   */
  onConnect(callback: ClientConnectCallback): void {
    this.connectionCallbacks.push(callback);
  }

  /**
   * Initialize WebSocket server
   */
  initialize(server: HTTPServer): void {
    this.wss = new WebSocketServer({ server, path: '/ws/news' });

    this.wss.on('connection', async (ws: WebSocket, req: any) => {
      const ip = req?.socket?.remoteAddress || 'unknown';
      const currentConnections = this.ipConnections.get(ip) || 0;

      if (currentConnections >= 2) {
        logger.warn(`Rejected WebSocket connection from ${ip}: max 2 connections allowed in demo`);
        ws.close(1008, 'Too many connections from this IP');
        return;
      }

      this.ipConnections.set(ip, currentConnections + 1);
      logger.info(`New WebSocket client connected from ${ip} (${currentConnections + 1}/2)`);
      this.clients.add(ws);
      this.clientSubscriptions.set(ws, new Set(['news:all']));

      // Trigger connection callbacks asynchronously
      this.connectionCallbacks.forEach(cb => {
        try {
          cb();
        } catch (err) {
          logger.error('Error running websocket connection callback:', err);
        }
      });

      // Send welcome message
      this.sendToClient(ws, {
        type: 'connection',
        message: 'Connected to news WebSocket',
        timestamp: new Date().toISOString(),
      });

      // Handle client messages
      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message.toString());
          logger.debug('Received message from client:', data);
          
          if (data.type === 'subscribe') {
            const subs = this.clientSubscriptions.get(ws)!;
            data.assets?.forEach((asset: string) => subs.add(asset.toUpperCase()));
          } else if (data.type === 'unsubscribe') {
            const subs = this.clientSubscriptions.get(ws)!;
            data.assets?.forEach((asset: string) => subs.delete(asset.toUpperCase()));
          } else if (data.type === 'ping') {
            this.sendToClient(ws, { type: 'pong', timestamp: new Date().toISOString() });
          }
        } catch (error) {
          logger.error('Error parsing client message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        logger.info(`WebSocket client disconnected from ${ip}`);
        this.clients.delete(ws);
        this.clientSubscriptions.delete(ws);
        
        const count = this.ipConnections.get(ip) || 1;
        if (count <= 1) {
          this.ipConnections.delete(ip);
        } else {
          this.ipConnections.set(ip, count - 1);
        }
      });

      // Handle errors
      ws.on('error', (error) => {
        logger.error(`WebSocket error from ${ip}:`, error);
        this.clients.delete(ws);
        this.clientSubscriptions.delete(ws);
        
        const count = this.ipConnections.get(ip) || 1;
        if (count <= 1) {
          this.ipConnections.delete(ip);
        } else {
          this.ipConnections.set(ip, count - 1);
        }
      });
    });

    logger.info('WebSocket server initialized at /ws/news');
  }

  /**
   * Send all existing news from database to a newly connected client
   */
  private async sendAllNewsToClient(client: WebSocket): Promise<void> {
    try {
      // Fetch all news from database, ordered by most recent first
      const allNews = await prisma.news.findMany({
        orderBy: { publishedAt: 'desc' },
        take: 100, // Send latest 100 articles to new clients
        select: {
          id: true,
          title: true,
          description: true,
          source: true,
          author: true,
          publishedAt: true,
          url: true,
          imageUrl: true,
          relatedAssets: true,
          assetType: true,
          sentimentScore: true,
          sentimentLabel: true,
          relevanceScore: true,
        },
      });

      if (allNews.length === 0) {
        logger.info('No existing news in database to send to client');
        this.sendToClient(client, {
          type: 'initial_news',
          message: 'No news available yet',
          count: 0,
          data: [],
          timestamp: new Date().toISOString(),
        });
        return;
      }

      // Convert to NewsArticle format
      const newsArticles: NewsArticle[] = allNews.map(article => ({
        id: article.id,
        title: article.title,
        description: article.description,
        content: undefined,
        source: article.source,
        author: article.author || undefined,
        publishedAt: article.publishedAt,
        url: article.url,
        imageUrl: article.imageUrl || undefined,
        relatedAssets: article.relatedAssets,
        assetType: article.assetType || undefined,
        sentiment: {
          score: article.sentimentScore,
          label: article.sentimentLabel as 'positive' | 'negative' | 'neutral',
          confidence: Math.abs(article.sentimentScore),
        },
        relevanceScore: article.relevanceScore,
      }));

      // Send all existing news to the client
      this.sendToClient(client, {
        type: 'initial_news',
        message: 'All existing news from database',
        count: newsArticles.length,
        data: newsArticles,
        timestamp: new Date().toISOString(),
      });

      logger.info(`Sent ${newsArticles.length} existing news articles to newly connected client`);
    } catch (error) {
      logger.error('Error sending existing news to client:', error);
      this.sendToClient(client, {
        type: 'error',
        message: 'Failed to fetch existing news',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Broadcast new news to connected clients based on subscriptions
   */
  broadcastNews(news: NewsArticle[]): void {
    if (!this.wss || news.length === 0) {
      return;
    }

    logger.info(`Broadcasting ${news.length} news articles to subscribed clients`);
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        const subs = this.clientSubscriptions.get(client) || new Set();
        
        // Filter news for this client
        const relevantNews = news.filter(article => {
          if (subs.has('news:all')) return true;
          return article.relatedAssets.some(asset => subs.has(asset.toUpperCase()));
        });

        if (relevantNews.length > 0) {
          this.sendToClient(client, {
            type: 'news_update',
            timestamp: new Date().toISOString(),
            count: relevantNews.length,
            data: relevantNews,
          });
        }
      }
    });
  }

  /**
   * Broadcast news summary statistics
   */
  broadcastNewsSummary(summary: {
    totalArticles: number;
    cryptoNews: number;
    metalNews: number;
    sentimentBreakdown: {
      positive: number;
      negative: number;
      neutral: number;
    };
    topAssets: string[];
  }): void {
    if (!this.wss) {
      return;
    }

    const message = {
      type: 'news_summary',
      timestamp: new Date().toISOString(),
      data: summary,
    };

    this.broadcast(message);
  }

  /**
   * Send message to a specific client
   */
  private sendToClient(client: WebSocket, data: any): void {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  }

  /**
   * Broadcast message to all connected clients
   */
  private broadcast(data: any): void {
    const message = JSON.stringify(data);
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * Get number of connected clients
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Close all connections
   */
  closeAll(): void {
    this.clients.forEach((client) => {
      client.close();
    });
    this.clients.clear();
    
    if (this.wss) {
      this.wss.close();
    }
  }
}

export default new WebSocketService();
