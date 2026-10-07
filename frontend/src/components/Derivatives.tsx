'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Activity, AlertTriangle, TrendingDown, TrendingUp, Flame, Percent } from 'lucide-react';

export function Derivatives({ className }: { className?: string }) {
  const [symbol, setSymbol] = useState('BTC');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDerivatives = async () => {
    setLoading(true);
    try {
      const res = await api.getDerivatives(symbol);
      if (res.success) {
        setData(res.data);
      } else {
        setData(null);
      }
    } catch (e) {
      console.error(e);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDerivatives();
  }, []);

  const getHeatColor = (heat: string) => {
    switch(heat) {
      case 'EXTREME': return 'text-red-500 bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.5)]';
      case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
  };

  return (
    <div className={cn("flex flex-col gap-8 w-full", className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Activity className="text-blue-500" /> 
          Derivatives & Positioning
        </h2>
        <p className="text-sm text-muted-foreground">Monitor futures funding rates, open interest, and liquidation risks.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <input 
          type="text" 
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Asset Symbol (e.g. BTC)"
          className="bg-secondary/20 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-full sm:w-48 uppercase"
        />
        <button 
          onClick={fetchDerivatives}
          disabled={loading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? 'Fetching...' : 'Analyze Market'}
        </button>
      </div>

      {!data ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center text-muted-foreground">
          No derivatives data available for {symbol}. Ensure it's a valid futures pair on Binance (e.g., BTC, ETH).
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Liquidation Heat Warning */}
          <div className={cn("col-span-1 lg:col-span-3 rounded-xl p-6 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4", getHeatColor(data.liquidationHeat))}>
            <div className="flex items-center gap-4">
              <Flame size={32} className={cn("animate-pulse", data.liquidationHeat === 'EXTREME' || data.liquidationHeat === 'HIGH' ? 'block' : 'hidden')} />
              <div className="flex flex-col">
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Liquidation Heat Warning</span>
                <span className="text-2xl font-black">{data.liquidationHeat} RISK</span>
              </div>
            </div>
            <div className="text-left md:text-right">
              <div className="text-sm opacity-90">
                {data.liquidationHeat === 'EXTREME' 
                  ? `Warning: Extreme leverage detected on the ${data.heatDirection} side. High risk of a squeeze.`
                  : data.liquidationHeat === 'HIGH' 
                  ? `Caution: Leverage is stacking up on ${data.heatDirection}s. Sudden volatility possible.`
                  : 'Market leverage appears relatively balanced at the moment.'}
              </div>
            </div>
          </div>

          {/* Funding Rate */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Percent size={14} /> Funding Rate (8h)
            </h3>
            <div className="flex items-end gap-3">
              <span className={cn("text-3xl font-black", data.fundingRate > 0 ? "text-green-500" : data.fundingRate < 0 ? "text-red-500" : "text-foreground")}>
                {data.fundingRate > 0 ? '+' : ''}{data.fundingRate.toFixed(4)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              {data.fundingRate > 0 
                ? "Longs are paying Shorts. A high positive rate indicates an overheated bullish market and risk of a long squeeze." 
                : "Shorts are paying Longs. A negative rate indicates heavy shorting and potential for a short squeeze."}
            </p>
          </div>

          {/* Open Interest */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Activity size={14} /> Open Interest
            </h3>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-black text-foreground">
                {formatNumber(data.openInterest)}
              </span>
              <span className="text-xs text-muted-foreground font-bold tracking-wider uppercase">Contracts Open</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mt-2">
              Represents the total number of outstanding derivative contracts. A sudden jump with flat prices often precedes violent liquidations.
            </p>
          </div>

          {/* Long/Short Ratio */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingUp size={14} /> Global Long/Short Ratio
            </h3>
            <div className="flex items-end gap-3">
              <span className="text-3xl font-black text-foreground">
                {data.longShortRatio.toFixed(2)}
              </span>
            </div>
            
            {/* Visual Bar */}
            <div className="w-full h-2 rounded-full overflow-hidden flex mt-2">
              <div className="bg-green-500 h-full" style={{ width: `${data.longPercent}%` }}></div>
              <div className="bg-red-500 h-full" style={{ width: `${data.shortPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] font-bold mt-1 uppercase tracking-wider">
              <span className="text-green-500">{data.longPercent.toFixed(1)}% Long</span>
              <span className="text-red-500">{data.shortPercent.toFixed(1)}% Short</span>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
