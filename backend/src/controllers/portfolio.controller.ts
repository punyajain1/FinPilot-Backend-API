import { Request, Response } from 'express';
import portfolioService from '../services/portfolio.service';
import { AssetType } from '@prisma/client';
import { logger } from '../utils/logger';

export const addAsset = async (req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'This is a demo environment. You cannot add custom assets to the portfolio.',
  });
};



export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const portfolio = await portfolioService.getPortfolioWithCurrentPrices();
    
    const totalCurrentValue = portfolio.reduce((sum, asset) => sum + asset.totalValue, 0);
    const totalCost = portfolio.reduce((sum, asset) => sum + asset.totalCost, 0);
    const totalProfitLoss = totalCurrentValue - totalCost;
    const totalProfitLossPercentage = totalCost > 0 ? ((totalCurrentValue - totalCost) / totalCost) * 100 : 0;

    res.json({
      success: true,
      data: portfolio,
      count: portfolio.length,
      summary: {
        totalCurrentValue: parseFloat(totalCurrentValue.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
        totalProfitLossPercentage: parseFloat(totalProfitLossPercentage.toFixed(2)),
      }
    });
  } catch (error) {
    logger.error('Get portfolio error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch portfolio',
    });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'This is a demo environment. You cannot modify assets in the portfolio.',
  });
};



export const removeAsset = async (req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'This is a demo environment. You cannot remove assets from the portfolio.',
  });
};



export const getRecommendations = async (req: Request, res: Response) => {
  try {
    const recommendations = await portfolioService.getRecommendations();

    res.json({
      success: true,
      data: recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    logger.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendations',
    });
  }
};

export const analyzeAsset = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recommendation = await portfolioService.analyzeAsset(id);

    res.json({
      success: true,
      data: recommendation,
      message: 'Asset analysis completed successfully',
    });
  } catch (error) {
    logger.error('Analyze asset error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze asset',
    });
  }
};

export const getAssetAnalysis = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cached = await portfolioService.getCachedAnalysis(id);
    
    if (!cached) {
      return res.json({
        success: true,
        data: null,
        message: 'No analysis yet',
      });
    }

    res.json({
      success: true,
      data: cached,
    });
  } catch (error) {
    logger.error('Get asset analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch asset analysis',
    });
  }
};

export const syncWallet = async (req: Request, res: Response) => {
  return res.status(403).json({
    success: false,
    error: 'This is a demo environment. You cannot sync your wallet.',
  });
};



