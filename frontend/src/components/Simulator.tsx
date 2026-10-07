'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function Simulator({ className }: { className?: string }) {
  const [symbol, setSymbol] = useState('BTC');
  const [amount, setAmount] = useState(50);
  const [frequency, setFrequency] = useState('weekly');
  const [duration, setDuration] = useState(365);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.runDcaSimulation(symbol, amount, frequency, duration);
      if (res.success) {
        setResult(res.data);
      } else {
        console.error('Simulation failed:', res.error);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls */}
        <div className="flex flex-col rounded-3xl bg-card p-6 border border-border shadow-sm h-fit">
          <h3 className="text-lg font-medium text-foreground mb-4">DCA Simulator</h3>
          <form onSubmit={runSimulation} className="flex flex-col gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Asset Symbol</label>
              <input 
                type="text" value={symbol} onChange={e => setSymbol(e.target.value)} required
                className="w-full rounded-xl bg-secondary py-2 px-3 text-sm text-foreground outline-none border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Investment Amount ($)</label>
              <input 
                type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} required min="1"
                className="w-full rounded-xl bg-secondary py-2 px-3 text-sm text-foreground outline-none border border-border"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Frequency</label>
              <select 
                value={frequency} onChange={e => setFrequency(e.target.value)}
                className="w-full rounded-xl bg-secondary py-2 px-3 text-sm text-foreground outline-none border border-border"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Duration (Days)</label>
              <select 
                value={duration} onChange={e => setDuration(Number(e.target.value))}
                className="w-full rounded-xl bg-secondary py-2 px-3 text-sm text-foreground outline-none border border-border"
              >
                <option value={90}>3 Months (90 Days)</option>
                <option value={180}>6 Months (180 Days)</option>
                <option value={365}>1 Year (365 Days)</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground py-2 rounded-xl mt-2 font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-card p-4 border border-border text-center">
              <div className="text-xs text-muted-foreground">Total Invested</div>
              <div className="text-lg font-medium text-foreground mt-1">${result?.summary?.totalInvested?.toFixed(2) || '---'}</div>
            </div>
            <div className="rounded-2xl bg-card p-4 border border-border text-center">
              <div className="text-xs text-muted-foreground">Final Value</div>
              <div className="text-lg font-medium text-foreground mt-1">${result?.summary?.finalValue?.toFixed(2) || '---'}</div>
            </div>
            <div className="rounded-2xl bg-card p-4 border border-border text-center">
              <div className="text-xs text-muted-foreground">Net Profit</div>
              <div className={cn('text-lg font-medium mt-1', (result?.summary?.netProfit || 0) >= 0 ? 'text-green-500' : 'text-red-500')}>
                ${result?.summary?.netProfit?.toFixed(2) || '---'}
              </div>
            </div>
            <div className="rounded-2xl bg-card p-4 border border-border text-center">
              <div className="text-xs text-muted-foreground">ROI %</div>
              <div className={cn('text-lg font-medium mt-1', (result?.summary?.roiPercentage || 0) >= 0 ? 'text-green-500' : 'text-red-500')}>
                {result?.summary?.roiPercentage?.toFixed(2) || '---'}%
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-card p-6 border border-border shadow-sm h-[400px]">
             {result && result.timeSeries ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={result.timeSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#888888', fontSize: 10 }} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                      minTickGap={30}
                      tickFormatter={(val) => {
                        try {
                          return new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
                        } catch { return val; }
                      }}
                    />
                    <YAxis 
                      tick={{ fill: '#888888', fontSize: 10 }} 
                      tickLine={false} 
                      axisLine={false} 
                      width={45}
                      tickFormatter={(val) => val >= 1000 ? `$${(val / 1000).toFixed(1)}k` : `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000', border: '1px solid #222222', borderRadius: '6px' }}
                      itemStyle={{ color: '#ffffff', fontSize: '12px' }}
                      labelStyle={{ color: '#888888', fontSize: '10px', marginBottom: '4px' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'portfolioValue') return [`$${value}`, 'Portfolio Value'];
                        if (name === 'totalInvested') return [`$${value}`, 'Total Invested'];
                        return [value, name];
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="portfolioValue" 
                      stroke="#22c55e" 
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      strokeWidth={2} 
                      activeDot={{ r: 4, fill: '#22c55e', stroke: '#000000', strokeWidth: 2 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="totalInvested" 
                      stroke="#555555" 
                      fill="transparent" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
             ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  Run a simulation to view chart
                </div>
             )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
