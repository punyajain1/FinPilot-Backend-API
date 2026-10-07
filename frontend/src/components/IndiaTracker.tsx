'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { MapPin, ArrowRight, Calculator, IndianRupee, Globe2, Percent, TrendingUp } from 'lucide-react';

export function IndiaTracker({ className }: { className?: string }) {
  const [symbol, setSymbol] = useState('BTC');
  const [premium, setPremium] = useState<any>(null);
  const [ranks, setRanks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [taxForm, setTaxForm] = useState({ buyPrice: '', sellPrice: '', amount: '1' });
  const [taxPreview, setTaxPreview] = useState<any>(null);

  const fetchTrackerData = async () => {
    setLoading(true);
    try {
      const [pRes, rRes] = await Promise.all([
        api.getIndiaPremium(symbol),
        api.getIndiaRanks(symbol)
      ]);
      if (pRes.success) setPremium(pRes.data);
      if (rRes.success) setRanks(rRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrackerData();
  }, []);

  const handleTaxPreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taxForm.buyPrice || !taxForm.sellPrice || !taxForm.amount) return;
    try {
      const res = await api.previewIndiaTax(
        parseFloat(taxForm.buyPrice),
        parseFloat(taxForm.sellPrice),
        parseFloat(taxForm.amount)
      );
      if (res.success) setTaxPreview(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8 w-full", className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <MapPin className="text-orange-500" /> 
          India Crypto Hub
        </h2>
        <p className="text-sm text-muted-foreground">Premium tracker, best local exchanges, and precise INR tax calculations.</p>
      </div>

      {/* Asset Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input 
            type="text" 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="Asset Symbol (e.g. BTC)"
            className="bg-secondary/20 border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary w-48 uppercase"
          />
        </div>
        <button 
          onClick={fetchTrackerData}
          disabled={loading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Track Asset'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Premium & Exchanges */}
        <div className="flex flex-col gap-8">
          {/* Premium Tracker */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Globe2 size={16} /> 
              India Premium Tracker
            </h3>
            
            {!premium ? (
              <div className="text-sm text-muted-foreground">No data available for {symbol}. Try BTC, ETH, SOL.</div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-secondary/10 border border-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Global Price (Implied)</span>
                    <span className="text-xl font-black text-foreground">₹{premium.impliedInrPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="text-xs text-muted-foreground mt-1">${premium.globalUsdPrice} @ ₹{premium.usdInrRate.toFixed(2)}</span>
                  </div>
                  <div className="bg-secondary/10 border border-border rounded-lg p-4 flex flex-col gap-1">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Indian Exchange Price</span>
                    <span className="text-xl font-black text-foreground">₹{premium.indianExchangePrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="text-xs text-muted-foreground mt-1">CoinDCX</span>
                  </div>
                </div>
                
                <div className={cn("rounded-lg p-4 flex items-center justify-between border", 
                  premium.premiumPercentage > 2 ? "bg-red-500/10 border-red-500/20" : 
                  premium.premiumPercentage < -2 ? "bg-green-500/10 border-green-500/20" : "bg-yellow-500/10 border-yellow-500/20"
                )}>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Market Premium / Gap</span>
                    <span className="text-xs mt-1 text-muted-foreground">The extra cost you pay locally</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold">
                      {premium.premiumPercentage > 0 ? '+' : ''}{premium.premiumPercentage.toFixed(2)}%
                    </span>
                    <span className="text-xs">
                      ₹{premium.premiumInr.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Best Place to Buy */}
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingUp size={16} /> 
              Best Place to Buy {symbol}
            </h3>
            
            {ranks.length === 0 ? (
              <div className="text-sm text-muted-foreground">No exchange data found for {symbol}.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {ranks.map((rank, idx) => (
                  <div key={rank.exchange} className={cn("flex items-center justify-between p-4 rounded-lg border", idx === 0 ? "bg-primary/10 border-primary/30" : "bg-secondary/10 border-border")}>
                    <div className="flex items-center gap-4">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold", idx === 0 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground")}>
                        {idx + 1}
                      </div>
                      <span className="font-bold text-foreground">{rank.exchange}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-foreground">₹{rank.price.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">Spread: ₹{rank.spread.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Tax Preview */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-6 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Calculator size={16} /> 
            Tax-Aware Sell Preview (INR)
          </h3>
          
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-xs text-orange-500">
            Rules apply: 30% flat tax on profit, 1% TDS on sell proceeds. No offset allowed for losses.
          </div>

          <form onSubmit={handleTaxPreview} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs text-muted-foreground font-bold uppercase">Buy Price (₹)</label>
                <input 
                  type="number" step="any"
                  value={taxForm.buyPrice} onChange={e => setTaxForm({...taxForm, buyPrice: e.target.value})}
                  className="bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 5000000"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs text-muted-foreground font-bold uppercase">Sell Price (₹)</label>
                <input 
                  type="number" step="any"
                  value={taxForm.sellPrice} onChange={e => setTaxForm({...taxForm, sellPrice: e.target.value})}
                  className="bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="e.g. 5500000"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs text-muted-foreground font-bold uppercase">Amount</label>
              <input 
                type="number" step="any"
                value={taxForm.amount} onChange={e => setTaxForm({...taxForm, amount: e.target.value})}
                className="bg-secondary/20 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <button type="submit" className="bg-secondary/50 hover:bg-secondary text-foreground font-medium text-sm py-2 rounded-lg border border-border transition-colors mt-2">
              Calculate Proceeds
            </button>
          </form>

          {taxPreview && (
            <div className="mt-4 pt-6 border-t border-border flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Gross Profit</span>
                <span className={cn("font-medium", taxPreview.grossProfit > 0 ? "text-green-500" : "")}>
                  ₹{taxPreview.grossProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1">Tax on Profit <span className="text-[10px] bg-secondary px-1.5 rounded">30%</span></span>
                <span className="text-red-500 font-medium">
                  -₹{taxPreview.taxOnProfit.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground flex items-center gap-1">TDS Deducted <span className="text-[10px] bg-secondary px-1.5 rounded">1%</span></span>
                <span className="text-red-500 font-medium">
                  -₹{taxPreview.tds.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>

              <div className="mt-2 pt-4 border-t border-border border-dashed flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-xs">Net Proceeds</span>
                <span className="text-xl font-black text-foreground">
                  ₹{taxPreview.netProceeds.toLocaleString(undefined, {maximumFractionDigits: 2})}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
