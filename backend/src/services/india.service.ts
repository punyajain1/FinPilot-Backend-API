import { logger } from '../utils/logger';

export interface IndiaPremiumResult {
  symbol: string;
  globalUsdPrice: number;
  usdInrRate: number;
  impliedInrPrice: number;
  indianExchangePrice: number;
  premiumInr: number;
  premiumPercentage: number;
}

export interface ExchangeRank {
  exchange: string;
  price: number;
  spread: number;
}

class IndiaService {
  private taxConfig = {
    profitTaxRate: 0.30, // 30% flat tax on profit
    tdsRate: 0.01,       // 1% TDS on sell transactions
  };

  async getUsdInrRate(): Promise<number> {
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
      const data: any = await res.json();
      return data.rates.INR;
    } catch (error) {
      logger.error('Failed to fetch USD/INR rate, using fallback 83.5', error);
      return 83.5;
    }
  }

  async getCoinDcxTicker(): Promise<any[]> {
    try {
      const res = await fetch('https://api.coindcx.com/exchange/ticker');
      const data: any = await res.json();
      return data as any[];
    } catch (e) {
      return [];
    }
  }

  async getWazirxTicker(): Promise<any[]> {
    try {
      const res = await fetch('https://api.wazirx.com/sapi/v1/tickers/24hr');
      const data: any = await res.json();
      return data as any[];
    } catch (e) {
      return [];
    }
  }

  async getPremium(symbol: string): Promise<IndiaPremiumResult | null> {
    const uppercaseSymbol = symbol.toUpperCase();
    const inrRate = await this.getUsdInrRate();
    const dcxTickers = await this.getCoinDcxTicker();
    
    const usdtPair = dcxTickers.find(t => t.market === `${uppercaseSymbol}USDT`);
    const inrPair = dcxTickers.find(t => t.market === `${uppercaseSymbol}INR`);
    
    if (!usdtPair || !inrPair) return null;

    const globalUsdPrice = parseFloat(usdtPair.last_price);
    const indianExchangePrice = parseFloat(inrPair.last_price);
    
    const impliedInrPrice = globalUsdPrice * inrRate;
    const premiumInr = indianExchangePrice - impliedInrPrice;
    const premiumPercentage = (premiumInr / impliedInrPrice) * 100;

    return {
      symbol: uppercaseSymbol,
      globalUsdPrice,
      usdInrRate: inrRate,
      impliedInrPrice,
      indianExchangePrice,
      premiumInr,
      premiumPercentage
    };
  }

  async rankExchanges(symbol: string): Promise<ExchangeRank[]> {
    const uppercaseSymbol = symbol.toUpperCase();
    const dcxTickers = await this.getCoinDcxTicker();
    const wazirxTickers = await this.getWazirxTicker();
    
    const ranks: ExchangeRank[] = [];

    // CoinDCX
    const dcxPair = dcxTickers.find(t => t.market === `${uppercaseSymbol}INR`);
    if (dcxPair && dcxPair.last_price) {
      const bid = parseFloat(dcxPair.bid);
      const ask = parseFloat(dcxPair.ask);
      ranks.push({
        exchange: 'CoinDCX',
        price: parseFloat(dcxPair.last_price),
        spread: ask - bid
      });
    }

    // WazirX
    const wxSymbol = `${symbol.toLowerCase()}inr`;
    const wxPair = wazirxTickers.find((t: any) => t.symbol === wxSymbol);
    if (wxPair && wxPair.lastPrice) {
      const bid = parseFloat(wxPair.bidPrice);
      const ask = parseFloat(wxPair.askPrice);
      ranks.push({
        exchange: 'WazirX',
        price: parseFloat(wxPair.lastPrice),
        spread: ask - bid
      });
    }

    // Sort by price (best place to buy is lowest price)
    return ranks.sort((a, b) => a.price - b.price);
  }

  calculateTax(buyPrice: number, sellPrice: number, amount: number) {
    const totalBuyCost = buyPrice * amount;
    const totalSellValue = sellPrice * amount;
    const profit = Math.max(0, totalSellValue - totalBuyCost);
    
    const profitTax = profit * this.taxConfig.profitTaxRate;
    const tds = totalSellValue * this.taxConfig.tdsRate;
    const netProceeds = totalSellValue - profitTax - tds;

    return {
      profitTaxRate: this.taxConfig.profitTaxRate,
      tdsRate: this.taxConfig.tdsRate,
      grossProfit: profit,
      taxOnProfit: profitTax,
      tds: tds,
      totalDeductions: profitTax + tds,
      netProceeds
    };
  }
}

export default new IndiaService();
