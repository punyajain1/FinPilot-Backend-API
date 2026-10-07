export const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export interface SyncProfileRequest {
  walletAddress: string;
  preferences?: Record<string, any>;
}

export interface Holding {
  symbol: string;
  amount: number;
  assetType?: string;
  assetName?: string;
}

export interface SyncWalletRequest {
  holdings: Holding[];
}

export interface AddAssetRequest {
  assetName: string;
  assetType: string;
  symbol: string;
  amount: string | number;
  buyingPrice: string | number;
}

export interface UpdateAssetRequest {
  amount?: string | number;
  buyingPrice?: string | number;
}

export const api = {
  // System
  wakeup: () => fetch(`${API_BASE}/health`).then(res => res.json()).catch(err => console.error('Wakeup failed:', err)),

  // Market
  getGlobalMarket: () => fetch(`${API_BASE}/market/global`).then(res => res.json()),

  // Portfolio
  getPortfolio: () => fetch(`${API_BASE}/portfolio`).then(res => res.json()),
  addAsset: (data: AddAssetRequest) => fetch(`${API_BASE}/portfolio/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  updateAsset: (id: string, data: UpdateAssetRequest) => fetch(`${API_BASE}/portfolio/update/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  removeAsset: (id: string) => fetch(`${API_BASE}/portfolio/remove/${id}`, {
    method: 'DELETE'
  }).then(res => res.json()),
  syncWallet: (holdings: Holding[]) => fetch(`${API_BASE}/portfolio/sync-wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ holdings })
  }).then(res => res.json()),

  // Chat
  getChatHistory: (conversationId: string) => fetch(`${API_BASE}/chat/history?conversationId=${conversationId}`).then(res => res.json()),
  sendMessage: (message: string, conversationId: string | null) => fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, conversationId })
  }).then(res => res.json()),
  clearChat: (conversationId: string) => fetch(`${API_BASE}/chat/clear?conversationId=${conversationId}`, { method: 'DELETE' }).then(res => res.json()),

  // News
  getNews: (params?: Record<string, string | number>) => {
    let url = `${API_BASE}/news?limit=50`;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, value.toString());
      });
      url = `${API_BASE}/news?${query.toString()}`;
    }
    return fetch(url).then(res => res.json());
  },
  triggerNewsFetch: () => fetch(`${API_BASE}/news/trigger-fetch`, { method: 'POST' }).then(res => res.json()),

  // Analysis & Recommendations
  getAnalysis: (id: string) => fetch(`${API_BASE}/portfolio/${id}/analysis`).then(res => res.json()),
  triggerAnalysis: (id: string) => fetch(`${API_BASE}/portfolio/analyze/${id}`, { method: 'POST' }).then(res => res.json()),
  getRecommendations: () => fetch(`${API_BASE}/portfolio/recommendations`).then(res => res.json()),

  // Simulator
  runDcaSimulation: (symbol: string, amount: number, frequency: string, duration: number) =>
    fetch(`${API_BASE}/simulation/dca?symbol=${symbol}&amount=${amount}&frequency=${frequency}&durationDays=${duration}`).then(res => res.json()),

  // User
  syncProfile: (data: SyncProfileRequest) => fetch(`${API_BASE}/users/sync-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
  getNewsSummary: (assetName: string) => fetch(`${API_BASE}/news/summary/${assetName}`).then(res => res.json()),

  // India Specific
  getIndiaPremium: (symbol: string) => fetch(`${API_BASE}/india/premium/${symbol}`).then(res => res.json()),
  getIndiaRanks: (symbol: string) => fetch(`${API_BASE}/india/rank/${symbol}`).then(res => res.json()),
  previewIndiaTax: (buyPrice: number, sellPrice: number, amount: number) => fetch(`${API_BASE}/india/tax-preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ buyPrice, sellPrice, amount })
  }).then(res => res.json()),

  // Derivatives
  getDerivatives: (symbol: string) => fetch(`${API_BASE}/derivatives/${symbol}`).then(res => res.json())
};

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/ws/news';
