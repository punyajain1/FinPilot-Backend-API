import { Request, Response } from 'express';
import derivativesService from '../services/derivatives.service';

export const getDerivatives = async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol || 'BTC';
    const data = await derivativesService.getBinanceData(symbol);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Derivatives data not found for symbol' });
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch derivatives' });
  }
};
