import { logger } from '../utils/logger';

export interface DerivativesData {
  symbol: string;
  fundingRate: number;
  openInterest: number;
  longShortRatio: number;
  longPercent: number;
  shortPercent: number;
  liquidationHeat: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  heatDirection: 'LONG' | 'SHORT' | 'NEUTRAL';
}

class DerivativesService {
  async getBinanceData(symbol: string): Promise<DerivativesData | null> {
    try {
      const formattedSymbol = symbol.toUpperCase() + 'USDT';
      
      const [premiumRes, oiRes, lsRes] = await Promise.all([
        fetch(`https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${formattedSymbol}`),
        fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${formattedSymbol}`),
        fetch(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${formattedSymbol}&period=15m&limit=1`)
      ]);

      const premium: any = await premiumRes.json();
      const oi: any = await oiRes.json();
      const lsData: any = await lsRes.json();

      if (!premium.lastFundingRate || !oi.openInterest || !lsData || lsData.length === 0) {
        return null;
      }

      const fundingRate = parseFloat(premium.lastFundingRate) * 100; // to percentage
      const openInterest = parseFloat(oi.openInterest);
      const latestLs = lsData[lsData.length - 1];
      const longShortRatio = parseFloat(latestLs.longShortRatio);
      const longPercent = parseFloat(latestLs.longAccount) * 100;
      const shortPercent = parseFloat(latestLs.shortAccount) * 100;

      // Heat calculation
      let liquidationHeat: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' = 'LOW';
      let heatDirection: 'LONG' | 'SHORT' | 'NEUTRAL' = 'NEUTRAL';

      const absFunding = Math.abs(fundingRate);
      
      if (absFunding > 0.05 || longShortRatio > 2.5 || longShortRatio < 0.4) {
        liquidationHeat = 'EXTREME';
      } else if (absFunding > 0.02 || longShortRatio > 1.8 || longShortRatio < 0.6) {
        liquidationHeat = 'HIGH';
      } else if (absFunding > 0.01 || longShortRatio > 1.2 || longShortRatio < 0.8) {
        liquidationHeat = 'MEDIUM';
      }

      if (fundingRate > 0 && longShortRatio > 1.1) {
        heatDirection = 'LONG';
      } else if (fundingRate < 0 && longShortRatio < 0.9) {
        heatDirection = 'SHORT';
      }

      return {
        symbol: symbol.toUpperCase(),
        fundingRate,
        openInterest,
        longShortRatio,
        longPercent,
        shortPercent,
        liquidationHeat,
        heatDirection
      };
    } catch (error) {
      logger.error('Failed to fetch derivatives data', error);
      return null;
    }
  }
}

export default new DerivativesService();
