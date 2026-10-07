import { Request, Response } from 'express';
import simulationService from '../services/simulation.service';
import { logger } from '../utils/logger';

class SimulationController {
  public getDcaSimulation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { symbol, amount, frequency, durationDays } = req.query;

      if (!symbol || typeof symbol !== 'string') {
        res.status(400).json({ success: false, error: 'Symbol is required and must be a string' });
        return;
      }
      
      const parsedAmount = Number(amount);
      if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ success: false, error: 'Valid investment amount is required' });
        return;
      }
      
      if (!frequency || !['daily', 'weekly', 'monthly'].includes(frequency as string)) {
        res.status(400).json({ success: false, error: 'Frequency must be daily, weekly, or monthly' });
        return;
      }

      const parsedDuration = Number(durationDays);
      if (!durationDays || isNaN(parsedDuration) || parsedDuration <= 0 || parsedDuration > 365) {
        res.status(400).json({ success: false, error: 'Valid durationDays is required (max 365)' });
        return;
      }

      const result = await simulationService.calculateDca(
        symbol,
        parsedAmount,
        frequency as 'daily' | 'weekly' | 'monthly',
        parsedDuration
      );

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error('Error in getDcaSimulation:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message || 'Failed to calculate DCA simulation' 
      });
    }
  };
}

export default new SimulationController();
