import { Request, Response } from 'express';
import indiaService from '../services/india.service';

export const getPremium = async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol || 'BTC';
    const premium = await indiaService.getPremium(symbol);
    if (!premium) {
      return res.status(404).json({ success: false, error: 'Symbol pairs not found on Indian exchanges' });
    }
    res.json({ success: true, data: premium });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch premium' });
  }
};

export const getRanks = async (req: Request, res: Response) => {
  try {
    const symbol = req.params.symbol || 'BTC';
    const ranks = await indiaService.rankExchanges(symbol);
    res.json({ success: true, data: ranks });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to rank exchanges' });
  }
};

export const previewTax = async (req: Request, res: Response) => {
  try {
    const { buyPrice, sellPrice, amount } = req.body;
    if (!buyPrice || !sellPrice || !amount) {
      return res.status(400).json({ success: false, error: 'Missing parameters: buyPrice, sellPrice, amount required' });
    }
    
    const taxInfo = indiaService.calculateTax(parseFloat(buyPrice), parseFloat(sellPrice), parseFloat(amount));
    res.json({ success: true, data: taxInfo });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to preview tax' });
  }
};
