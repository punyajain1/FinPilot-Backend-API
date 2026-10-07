'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { cn, formatCurrency, formatNumber } from '@/lib/utils';
import { Plus, RefreshCcw } from 'lucide-react';
import { AssetModals } from './AssetModals';

export function AssetsTable({ className }: { className?: string }) {
  const [assets, setAssets] = useState<any[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [modalState, setModalState] = useState<{ type: 'add' | 'sync' | 'update' | null, asset?: any }>({ type: null });

  const fetchPortfolio = () => {
    api.getPortfolio().then(res => {
      // The API wraps response in { success: true, data: [...], summary: {...} }
      setAssets(res.data || []);
      setTotalValue(res.summary?.totalCurrentValue || 0);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <>
      <div className={cn('flex flex-col rounded-xl bg-card p-6 border border-border', className)}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Assets Portfolio</h2>
            <p className="text-xs text-muted-foreground mt-1 tracking-wide">Total Value: {formatCurrency(totalValue)}</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => setModalState({ type: 'sync' })} className="flex-1 md:flex-none justify-center flex items-center gap-1 bg-secondary text-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-secondary/80 transition-colors">
              <RefreshCcw size={16} /> Sync Wallet
            </button>
            <button onClick={() => setModalState({ type: 'add' })} className="flex-1 md:flex-none justify-center flex items-center gap-1 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus size={16} /> Add Asset
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 px-2">Asset</th>
                <th className="pb-3 px-2">Holdings</th>
                <th className="pb-3 px-2">Price</th>
                <th className="pb-3 px-2">Value</th>
                <th className="pb-3 px-2">P/L</th>
                <th className="pb-3 px-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No assets in portfolio
                  </td>
                </tr>
              ) : (
                assets.map((asset, i) => (
                  <tr key={i} className="group border-b border-border/50 last:border-0 hover:bg-secondary/20 transition-colors">
                    <td className="py-4 px-2 font-bold text-foreground flex items-center gap-2">
                      {asset.symbol}
                      <span className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground rounded uppercase tracking-wider">{asset.assetName}</span>
                    </td>
                    <td className="py-4 px-2 font-medium">{asset.amount}</td>
                    <td className="py-4 px-2 font-medium">{asset.currentPrice ? formatCurrency(asset.currentPrice) : '---'}</td>
                    <td className="py-4 px-2 font-medium">{asset.totalValue ? formatCurrency(asset.totalValue) : '---'}</td>
                    <td className={cn('py-4 px-2 font-medium', asset.profitLossPercentage === null ? 'text-green-500' : (asset.profitLossPercentage >= 0 ? 'text-green-500' : 'text-destructive'))}>
                      {asset.profitLossPercentage === null ? (
                        <>▲ {formatCurrency(asset.profitLoss)}</>
                      ) : (
                        <>{asset.profitLossPercentage >= 0 ? '▲' : '▼'} {formatNumber(Math.abs(asset.profitLossPercentage))}%</>
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2">
                        <button onClick={() => setModalState({ type: 'update', asset })} className="text-[10px] uppercase font-bold tracking-wider bg-secondary px-3 py-1.5 rounded hover:bg-secondary/80">Edit</button>
                        <button onClick={() => {
                          if (confirm('Are you sure you want to remove this asset?')) {
                            api.removeAsset(asset.id).then(fetchPortfolio).catch(console.error);
                          }
                        }} className="text-[10px] uppercase font-bold tracking-wider bg-destructive/10 text-destructive px-3 py-1.5 rounded hover:bg-destructive/20">Remove</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AssetModals 
        isOpen={modalState.type !== null} 
        type={modalState.type} 
        asset={modalState.asset}
        onClose={() => setModalState({ type: null })} 
        onSuccess={fetchPortfolio} 
      />
    </>
  );
}
