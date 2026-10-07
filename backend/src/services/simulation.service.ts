import axios from 'axios';
import marketDataService from './marketData.service';
import cacheService from './cache.service';
import { logger } from '../utils/logger';

class SimulationService {
  /**
   * Calculates the Dollar-Cost Averaging (DCA) simulation.
   * @param symbol Asset symbol (e.g., BTC)
   * @param investmentAmount Amount invested at each interval
   * @param frequency Investment frequency (daily, weekly, monthly)
   * @param durationDays Total duration of the simulation in days
   */
  async calculateDca(
    symbol: string,
    investmentAmount: number,
    frequency: 'daily' | 'weekly' | 'monthly',
    durationDays: number
  ) {
    try {
      // 1. Get Coinlore ID
      const assetInfo = await marketDataService.getCoinloreAssetInfo(symbol);
      if (!assetInfo || !assetInfo.id) {
        throw new Error(`Asset not found or not supported for simulation: ${symbol}`);
      }

      // 2. Fetch Historical OHLCV from CoinLore
      const cacheKey = `simulation:ohlcv:${assetInfo.id}`;
      let historicalData = await cacheService.get<any[]>(cacheKey);

      if (!historicalData) {
        // Coinlore returns 365 days of history.
        const response = await axios.get(`https://api.coinlore.net/api/coin/ohlcv/?coin=${assetInfo.id}`);
        
        // Transform the object into a sorted array of objects
        historicalData = Object.values(response.data)
          .map((data: any) => ({
            timestamp: data[0],
            open: data[1],
            high: data[2],
            low: data[3],
            close: data[4],
            volume: data[5]
          }))
          .sort((a, b) => a.timestamp - b.timestamp); // Sort chronological (oldest first)

        await cacheService.set(cacheKey, historicalData, 3600 * 12); // Cache for 12 hours
      }

      if (!historicalData || historicalData.length === 0) {
        throw new Error(`No historical data found for ${symbol}`);
      }

      // Ensure we only process the requested duration
      if (historicalData.length > durationDays) {
        historicalData = historicalData.slice(-durationDays);
      }

      // 3. Mathematical Simulation
      let accumulatedCoins = 0;
      let totalInvested = 0;
      let intervalCounter = 0;
      
      const intervalTarget = frequency === 'daily' ? 1 : frequency === 'weekly' ? 7 : 30;
      
      const timeSeries = [];

      for (let i = 0; i < historicalData.length; i++) {
        const day = historicalData[i];
        const currentPrice = day.close;
        const date = new Date(day.timestamp * 1000).toISOString().split('T')[0];
        
        intervalCounter++;
        
        // Invest on day 1, and every intervalTarget days thereafter
        if (i === 0 || intervalCounter >= intervalTarget) {
          accumulatedCoins += investmentAmount / currentPrice;
          totalInvested += investmentAmount;
          intervalCounter = 0;
        }

        timeSeries.push({
          date,
          price: currentPrice,
          totalInvested: parseFloat(totalInvested.toFixed(2)),
          portfolioValue: parseFloat((accumulatedCoins * currentPrice).toFixed(2))
        });
      }

      const lastDay = timeSeries[timeSeries.length - 1];
      const finalPortfolioValue = lastDay ? lastDay.portfolioValue : 0;
      const netProfit = finalPortfolioValue - totalInvested;
      const roiPercentage = totalInvested > 0 ? (netProfit / totalInvested) * 100 : 0;

      return {
        summary: {
          totalInvested: parseFloat(totalInvested.toFixed(2)),
          finalValue: parseFloat(finalPortfolioValue.toFixed(2)),
          netProfit: parseFloat(netProfit.toFixed(2)),
          roiPercentage: parseFloat(roiPercentage.toFixed(2)),
          accumulatedCoins: parseFloat(accumulatedCoins.toFixed(8))
        },
        timeSeries
      };
      
    } catch (error) {
      logger.error(`Error in DCA Simulation for ${symbol}:`, error);
      throw error;
    }
  }
}

export default new SimulationService();
