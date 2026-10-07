'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { X } from 'lucide-react';

export function AssetModals({ isOpen, onClose, type, asset, onSuccess }: { isOpen: boolean, onClose: () => void, type: 'add' | 'sync' | 'update' | null, asset?: any, onSuccess: () => void }) {
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState('CRYPTO');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoWarning, setDemoWarning] = useState('');

  useEffect(() => {
    if (type === 'update' && asset) {
      setSymbol(asset.symbol || '');
      setAssetType(asset.assetType || 'CRYPTO');
      setAmount(asset.amount?.toString() || '');
      setPrice(asset.averageBuyPrice?.toString() || asset.currentPrice?.toString() || '');
    } else {
      setSymbol('');
      setAssetType('CRYPTO');
      setAmount('');
      setPrice('');
      setAddress('');
    }
  }, [type, asset, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDemoWarning('This is a demo environment. You cannot add custom assets to the portfolio.');
    return;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-3xl p-6 w-full max-w-md shadow-lg relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-muted-foreground hover:text-foreground transition-colors">
          <X size={20} />
        </button>

        <h3 className="text-xl font-medium text-foreground mb-6">
          {type === 'add' ? 'Add Asset Position' : type === 'update' ? 'Update Asset' : 'Sync Wallet Holdings'}
        </h3>

        {demoWarning && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">
            {demoWarning}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {type === 'add' || type === 'update' ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Asset Type</label>
                  <select disabled={type === 'update'} value={assetType} onChange={e => setAssetType(e.target.value)} className="w-full rounded-xl bg-secondary py-2 px-3 text-foreground outline-none border border-border disabled:opacity-50">
                    <option value="CRYPTO">Crypto</option>
                    <option value="METAL">Metal</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Asset Symbol</label>
                  <input required disabled={type === 'update'} type="text" value={symbol} onChange={e => setSymbol(e.target.value)} className="w-full rounded-xl bg-secondary py-2 px-3 text-foreground outline-none border border-border disabled:opacity-50" placeholder="e.g. BTC" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Holdings</label>
                  <input required type="number" step="any" value={amount} onChange={e => setAmount(e.target.value)} className="w-full rounded-xl bg-secondary py-2 px-3 text-foreground outline-none border border-border" placeholder="0.05" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Buying Price ($)</label>
                  <input required type="number" step="any" value={price} onChange={e => setPrice(e.target.value)} className="w-full rounded-xl bg-secondary py-2 px-3 text-foreground outline-none border border-border" placeholder="58200" />
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Wallet Address (EVM)</label>
              <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full rounded-xl bg-secondary py-2 px-3 text-foreground outline-none border border-border" placeholder="0x..." />
              <p className="text-xs text-muted-foreground mt-2">Enter an Ethereum / EVM wallet address to auto-fetch your token balances.</p>
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Processing...' : (type === 'add' ? 'Add Position' : type === 'update' ? 'Update Position' : 'Sync Wallet')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
