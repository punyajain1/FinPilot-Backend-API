'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { TrendingUp, DollarSign, Activity } from 'lucide-react';

function formatLargeNumber(num: number) {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function MarketStats({ className }: { className?: string }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    api.getGlobalMarket().then(res => {
      if (res.success && res.data) {
        setStats(res.data);
      } else {
        setStats(res); // Fallback if API changes
      }
    }).catch(console.error);
  }, []);

  return (
    <div className={cn('flex flex-col md:flex-row items-start md:items-center gap-6 rounded-xl bg-card p-4 border border-border text-sm overflow-x-auto', className)}>
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Market Cap</span>
        <span className="font-semibold tabular-nums text-foreground">{stats?.totalMarketCap ? formatLargeNumber(stats.totalMarketCap) : '---'}</span>
        <span className={cn("text-[10px] font-bold tabular-nums", stats?.mcapChange >= 0 ? 'text-green-500' : 'text-destructive')}>
          {stats?.mcapChange > 0 ? '▲' : '▼'} {Math.abs(stats?.mcapChange || 0)}%
        </span>
      </div>

      <div className="hidden md:block w-px h-4 bg-border"></div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">24h Volume</span>
        <span className="font-semibold tabular-nums text-foreground">{stats?.totalVolume24h ? formatLargeNumber(stats.totalVolume24h) : '---'}</span>
        <span className={cn("text-[10px] font-bold tabular-nums", stats?.volumeChange >= 0 ? 'text-green-500' : 'text-destructive')}>
          {stats?.volumeChange > 0 ? '▲' : '▼'} {Math.abs(stats?.volumeChange || 0)}%
        </span>
      </div>

      <div className="hidden md:block w-px h-4 bg-border"></div>

      <div className="flex items-center gap-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">BTC Dominance</span>
        <span className="font-semibold tabular-nums text-foreground">{stats?.btcDominance ? `${stats.btcDominance}%` : '---'}</span>
      </div>
    </div>
  );
}
