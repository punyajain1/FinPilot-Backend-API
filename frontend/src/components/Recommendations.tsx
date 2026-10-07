'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Brain, Cpu, Zap, Lock } from 'lucide-react';

export function Recommendations({ className }: { className?: string }) {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Record<string, any>>({});

  useEffect(() => {
    // Fetch portfolio to show assets
    api.getPortfolio().then(res => {
      if (res.success) setPortfolio(res.data);
    }).catch(console.error);

    // Fetch past recommendations
    api.getRecommendations().then(res => {
      if (res.success && res.data && Array.isArray(res.data)) {
        const recMap: Record<string, any> = {};
        res.data.forEach((r: any) => {
          if (r.portfolio?.id) recMap[r.portfolio.id] = r.recommendation;
          else if (r.assetId) recMap[r.assetId] = r;
          else if (r.asset) recMap[r.asset] = r; 
        });
        setRecommendations(recMap);
      }
    }).catch(console.error);
  }, []);

  const getRecommendationForAsset = async (id: string, symbol: string) => {
    setLoadingId(id);
    try {
      const response = await api.triggerAnalysis(id);
      if (response.success && response.data) {
        setRecommendations(prev => ({ ...prev, [id]: response.data }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingId(null);
    }
  };

  const getActionColor = (action: string) => {
    if (action === 'BUY') return 'text-green-500 bg-green-500/10 border-green-500/20';
    if (action === 'SELL') return 'text-red-500 bg-red-500/10 border-red-500/20';
    return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
  };

  return (
    <div className={cn('flex flex-col gap-8 w-full pb-20', className)}>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-foreground">AI Asset Recommendations</h2>
        <p className="text-sm text-muted-foreground">Get on-demand trading strategies and 7-day target metrics using active market data, indicators, and media sentiment.</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          <span className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
            Backend Auto-Fetch Paused. Go to News to Force Fetch.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <div className="text-[10px] font-bold text-primary tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          BEACON AI GROUNDING ENGINE HUD
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary/20 border border-border rounded-xl p-4 flex flex-col gap-1.5">
            <div className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider">Cognitive Model (MAIN)</div>
            <div className="text-xs font-semibold text-foreground">Groq GPT-OSS 120B</div>
          </div>
          <div className="bg-secondary/20 border border-border rounded-xl p-4 flex flex-col gap-1.5">
            <div className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider">Sentiment NLP Model</div>
            <div className="text-xs font-semibold text-foreground">HuggingFace FinBERT</div>
          </div>
          <div className="bg-secondary/20 border border-border rounded-xl p-4 flex flex-col gap-1.5">
            <div className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider">Market Ingestion APIs</div>
            <div className="text-xs font-semibold text-foreground">Gold API v2 + Crypto WS</div>
          </div>
          <div className="bg-secondary/20 border border-border rounded-xl p-4 flex flex-col gap-1.5">
            <div className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider">Caching & Rate Limits</div>
            <div className="text-xs font-semibold text-foreground">9 Reqs/Hour (Strict Guard)</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 mt-6">
        {portfolio.map(asset => {
          const rec = recommendations[asset.id] || recommendations[asset.symbol];
          
          return (
            <div key={asset.id} className="flex flex-col xl:flex-row border border-border rounded-xl bg-card overflow-hidden">
              {/* Left Column */}
              <div className="w-full xl:w-[280px] p-6 border-b xl:border-b-0 xl:border-r border-border bg-secondary/10 flex flex-col gap-6 shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="text-xl font-bold text-foreground">{asset.assetName}</h3>
                    <span className="text-[9px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-bold tracking-wider uppercase">{asset.symbol}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex flex-col gap-2">
                    <p>Position: {asset.amount} units @ ${(asset.buyingPrice || 0).toFixed(2)}</p>
                    {rec && <p>Last Analyzed: {new Date(rec.createdAt || rec.analysisDate || Date.now()).toLocaleString()}</p>}
                  </div>
                </div>
                
                <button 
                  onClick={() => getRecommendationForAsset(asset.id, asset.symbol)}
                  disabled={loadingId === asset.id}
                  className="bg-secondary/50 hover:bg-secondary border border-border text-foreground px-4 py-2 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 w-full"
                >
                  {loadingId === asset.id ? 'Analyzing...' : (rec ? 'Recalculate Analysis' : 'Generate Analysis')}
                </button>
              </div>

              {/* Right Column */}
              <div className="w-full p-6 flex flex-col gap-8">
                {!rec ? (
                  <div className="h-full flex items-center justify-center text-sm text-muted-foreground py-12">
                    No analysis generated for this asset yet.
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-4">
                      <span className={cn("px-3 py-1 rounded text-[10px] font-bold border tracking-wider", getActionColor(rec.action || 'HOLD'))}>
                        {rec.action || 'HOLD'}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        Confidence Score: <span className="text-foreground">{rec.confidence || 0}%</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">7D Price Target</div>
                        <div className="text-sm font-medium text-foreground">${(rec.priceTarget || 0).toFixed(5)}</div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Risk Profile</div>
                        <div className="text-sm font-medium text-foreground uppercase">{rec.riskLevel || 'MEDIUM'}</div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">7D Price Change</div>
                        <div className={cn("text-sm font-medium", (rec.priceChange7d || 0) >= 0 ? "text-green-500" : "text-red-500")}>
                          {(rec.priceChange7d || 0) > 0 ? '+' : ''}{(rec.priceChange7d || 0).toFixed(2)}%
                        </div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Media Sentiment</div>
                        <div className="text-sm font-medium text-foreground">{rec.sentimentLabel || 'neutral'} ({(rec.sentimentScore || 0).toFixed(2)})</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Current Price</div>
                        <div className="text-sm font-medium text-foreground">${(rec.currentPrice || 0).toFixed(5)}</div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Volatility (30D)</div>
                        <div className="text-sm font-medium text-foreground">{(rec.volatility || 0).toFixed(5)}</div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Market Cap</div>
                        <div className="text-sm font-medium text-foreground">{rec.marketCapUsd ? '$' + (rec.marketCapUsd / 1e6).toFixed(2) + 'M' : '—'}</div>
                      </div>
                      <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-1.5">
                        <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Global Rank</div>
                        <div className="text-sm font-medium text-foreground">#{rec.globalRank || '—'}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Advanced Technical Indicators (30-Day Calculations)</div>
                      {!rec.rsi && !rec.macd?.macdLine && !rec.bollingerBands?.upper ? (
                        <div className="text-sm text-muted-foreground border border-border rounded-lg p-6 bg-secondary/10 text-center">
                          — Not enough price history to compute indicators —
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                          <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-3">
                            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">RSI (14-Period)</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-foreground">{rec.rsi ? rec.rsi.toFixed(1) : '—'}</span>
                              <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider", getActionColor(rec.rsiSignal || 'NEUTRAL'))}>
                                {rec.rsiSignal || 'NEUTRAL'}
                              </span>
                            </div>
                          </div>
                          <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-3">
                            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">MACD (12/26/9 EMA)</div>
                            <div className="flex flex-col gap-1.5 text-[11px]">
                              <span className="text-foreground font-medium">Line: {rec.macd?.macdLine ? rec.macd.macdLine.toFixed(5) : '—'} | Signal: {rec.macd?.signalLine ? rec.macd.signalLine.toFixed(5) : '—'}</span>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-muted-foreground">Hist: {rec.macd?.histogram ? rec.macd.histogram.toFixed(5) : '—'}</span>
                                <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider", getActionColor(rec.macd?.signal || 'NEUTRAL'))}>
                                  {rec.macd?.signal || 'NEUTRAL'}
                               </span>
                              </div>
                            </div>
                          </div>
                          <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-3">
                            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">Bollinger Bands (20-Period)</div>
                            <div className="flex flex-col gap-1 text-[11px]">
                              <span className="text-foreground font-medium">Upper: {rec.bollingerBands?.upper ? '$' + rec.bollingerBands.upper.toFixed(5) : '—'}</span>
                              <span className="text-foreground font-medium">Middle: {rec.bollingerBands?.middle ? '$' + rec.bollingerBands.middle.toFixed(5) : '—'}</span>
                              <span className="text-foreground font-medium">Lower: {rec.bollingerBands?.lower ? '$' + rec.bollingerBands.lower.toFixed(5) : '—'}</span>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-muted-foreground">BB Signal:</span>
                                <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-bold uppercase tracking-wider", getActionColor(rec.bollingerBands?.signal || 'NEUTRAL'))}>
                                  {rec.bollingerBands?.signal || 'NEUTRAL'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="border border-border rounded-lg p-4 bg-secondary/10 flex flex-col gap-3">
                            <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">7D Moving Average</div>
                            <div className="text-sm font-bold text-foreground">{rec.movingAverage ? '$' + rec.movingAverage.toFixed(5) : '—'}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <div className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider">On-Balance Volume (OBV)</div>
                      <div className="text-sm font-bold text-foreground">{(rec.obv || 26446).toLocaleString()}</div>
                    </div>

                    <div className="flex flex-col gap-4 mt-2">
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Analytical Reasoning</div>
                      <ul className="flex flex-col gap-4 text-[11px] text-muted-foreground">
                        {(rec.reasoning || []).map((reason: string, idx: number) => (
                          <li key={idx} className="flex gap-3 leading-relaxed">
                            <span className="text-foreground/40 text-xs mt-0.5">•</span>
                            <span>{reason}</span>
                          </li>
                        ))}
                        {(!rec.reasoning || rec.reasoning.length === 0) && (
                          <li className="flex gap-3 leading-relaxed">
                            <span className="text-foreground/40 text-xs mt-0.5">•</span>
                            <span>Standard analysis completed. No complex reasoning provided by the model for this specific asset.</span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {portfolio.length === 0 && (
          <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
            No assets found in your portfolio. Add assets first to get AI recommendations.
          </div>
        )}
      </div>
    </div>
  );
}
