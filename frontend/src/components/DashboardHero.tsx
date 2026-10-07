'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Activity } from 'lucide-react';

export function DashboardHero({ className }: { className?: string }) {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    api.getPortfolio().then(res => {
      if (res.success && res.summary) {
        setSummary(res.summary);
      }
    }).catch(console.error);
  }, []);

  if (!summary) {
    return (
      <div className={cn("animate-pulse bg-card border border-border rounded-xl h-[160px] p-8", className)} />
    );
  }

  const isProfit = summary.totalProfitLossPercentage >= 0;

  return (
    <div className={cn("bg-card border border-border rounded-xl p-8 relative overflow-hidden", className)}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-50" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total Portfolio Value</h2>
          <div className="text-4xl md:text-6xl font-bold tracking-tight text-foreground tabular-nums">
            {formatCurrency(summary.totalCurrentValue)}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-bold border flex items-center gap-1",
              isProfit ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
            )}>
              {isProfit ? '▲' : '▼'} {formatCurrency(Math.abs(summary.totalProfitLoss))}
            </span>
            <span className={cn("text-sm font-medium", isProfit ? "text-green-500" : "text-destructive")}>
              {isProfit ? '+' : ''}{formatNumber(summary.totalProfitLossPercentage)}%
            </span>
            <span className="text-xs text-muted-foreground ml-2">All Time Return</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-secondary/30 border border-border/50 rounded-lg p-4">
          <Activity className="text-primary" size={24} />
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Total Invested</div>
            <div className="text-lg font-semibold tabular-nums text-foreground">{formatCurrency(summary.totalCost)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
