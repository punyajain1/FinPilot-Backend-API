import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export const syncProfile = async (req: Request, res: Response) => {
  try {
    const { walletAddress, preferences } = req.body;

    if (!walletAddress) {
      return res.status(400).json({
        success: false,
        error: 'walletAddress is required'
      });
    }

    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {
        preferences: preferences || {}
      },
      create: {
        walletAddress,
        preferences: preferences || {}
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Profile synced successfully',
      data: user
    });
  } catch (error) {
    logger.error('Error syncing profile:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to sync profile'
    });
  }
};
