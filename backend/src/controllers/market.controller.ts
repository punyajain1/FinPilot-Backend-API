import { Request, Response } from 'express';
import marketDataService from '../services/marketData.service';
import { logger } from '../utils/logger';

export const getGlobalMarketData = async (req: Request, res: Response) => {
  try {
    const data = await marketDataService.getGlobalMarketData();
    res.json({
      success: true,
      data: {
        totalMarketCap: data.total_mcap,
        totalVolume24h: data.total_volume,
        btcDominance: data.btc_d,
        mcapChange: data.mcap_change,
        volumeChange: data.volume_change
      }
    });
  } catch (error) {
    logger.error('Error fetching global market data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global market data',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
