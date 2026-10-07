'use client';

import { useEffect, useState } from 'react';
import { api, WS_URL } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Globe, RefreshCw } from 'lucide-react';

export function NewsStream({ className }: { className?: string }) {
  const [news, setNews] = useState<any[]>([]);
  const [wsStatus, setWsStatus] = useState('Disconnected');
  const [summaryAsset, setSummaryAsset] = useState('');
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [sentimentStats, setSentimentStats] = useState({ pos: 0, neu: 0, neg: 0 });

  useEffect(() => {
    // Initial fetch
    api.getNews().then(data => {
      if (Array.isArray(data)) setNews(data);
      else if (data && Array.isArray(data.data)) setNews(data.data);
    }).catch(console.error);

    // WebSocket connect
    const ws = new WebSocket(WS_URL);
    
    ws.onopen = () => {
      setWsStatus('Connected');
      ws.send(JSON.stringify({ type: 'subscribe', channel: 'news' }));
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'initial_news' || payload.type === 'news_update') {
          if (Array.isArray(payload.data)) {
            setNews(prev => {
              // Very simple deduplication by URL (assuming top of array is newest)
              const existingUrls = new Set(prev.map(n => n.url));
              const newItems = payload.data.filter((n: any) => !existingUrls.has(n.url));
              return [...newItems, ...prev].slice(0, 50);
            });
          }
        } else if (payload.type === 'news_summary') {
          const stats = payload.data.sentimentBreakdown;
          if (stats) {
            const total = stats.positive + stats.neutral + stats.negative || 1;
            setSentimentStats({
              pos: (stats.positive / total) * 100,
              neu: (stats.neutral / total) * 100,
              neg: (stats.negative / total) * 100
            });
          }
        }
      } catch (e) {
        console.error('WS parse error', e);
      }
    };

    ws.onerror = () => {
      setWsStatus('Disconnected');
      ws.close();
    };

    ws.onclose = () => setWsStatus('Disconnected');

    return () => ws.close();
  }, []);

  const handleForceFetch = async () => {
    try {
      await api.triggerNewsFetch();
      const data = await api.getNews();
      setNews(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getSentimentStats = () => {
    if (sentimentStats.pos > 0 || sentimentStats.neu > 0 || sentimentStats.neg > 0) {
      return sentimentStats;
    }
    if (!news.length) return { pos: 0, neu: 0, neg: 0 };
    let pos = 0, neu = 0, neg = 0;
    news.forEach(item => {
      // Backend uses nested object for sentiment in WebSocket stream, but REST might be flat. Let's check both.
      const sent = item.sentiment?.label || item.sentiment;
      if (sent === 'positive') pos++;
      else if (sent === 'negative') neg++;
      else neu++;
    });
    return {
      pos: (pos / news.length) * 100,
      neu: (neu / news.length) * 100,
      neg: (neg / news.length) * 100
    };
  };

  const stats = getSentimentStats();

  return (
    <div className={cn('flex flex-col rounded-xl bg-card p-6 border border-border min-h-[800px]', className)}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 border-b border-border pb-4 gap-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Globe size={18} className="text-primary" /> Global Market News
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={handleForceFetch} className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-wider bg-secondary hover:bg-secondary/80 px-3 py-1.5 rounded text-foreground transition-colors">
            <RefreshCw size={12} /> Force Fetch
          </button>
          <div className="flex items-center gap-2">
            <div className={cn('w-2 h-2 rounded-full', wsStatus === 'Connected' ? 'bg-green-500' : 'bg-red-500')} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{wsStatus}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-6">
        <div>
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span>Market Sentiment Split</span>
          </div>
          <div className="flex h-1.5 w-full rounded-full overflow-hidden">
            <div style={{ width: `${stats.pos}%` }} className="bg-green-500" title={`Positive: ${stats.pos.toFixed(1)}%`} />
            <div style={{ width: `${stats.neu}%` }} className="bg-gray-400" title={`Neutral: ${stats.neu.toFixed(1)}%`} />
            <div style={{ width: `${stats.neg}%` }} className="bg-red-500" title={`Negative: ${stats.neg.toFixed(1)}%`} />
          </div>
        </div>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!summaryAsset.trim()) {
             setSummaryData(null);
             return;
          }
          setLoadingSummary(true);
          try {
            const sum = await api.getNewsSummary(summaryAsset);
            setSummaryData(sum);
          } catch (err) {
            console.error(err);
          } finally {
            setLoadingSummary(false);
          }
        }} className="flex flex-col sm:flex-row gap-3">
          <input 
            type="text" 
            placeholder="Asset Summary (e.g. BTC)" 
            value={summaryAsset}
            onChange={e => setSummaryAsset(e.target.value)}
            className="flex-1 rounded-xl bg-secondary/50 py-2.5 px-4 text-sm text-foreground outline-none border border-border/50 focus:border-primary/50 transition-all focus:bg-secondary" 
          />
          <button type="submit" disabled={loadingSummary} className="bg-primary text-primary-foreground hover:bg-primary/90 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 shadow-sm shadow-primary/20">
            {loadingSummary ? 'Loading...' : 'Get Summary'}
          </button>
        </form>
        
        {summaryData && (
          <div className="mt-3 p-3 bg-secondary/30 border border-border rounded-lg text-xs">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-foreground">Summary for {summaryData.asset || summaryAsset}</span>
              <button onClick={() => setSummaryData(null)} className="text-muted-foreground hover:text-foreground">×</button>
            </div>
            <p className="text-muted-foreground">{summaryData.summary || JSON.stringify(summaryData)}</p>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
        {news.length === 0 ? (
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground text-center py-12">Waiting for news stream...</div>
        ) : (
          news.map((item, i) => {
            const sent = item.sentiment?.label || item.sentiment;
            return (
            <a key={i} href={item.url} target="_blank" rel="noreferrer" className="block group p-4 border border-border rounded-lg bg-secondary/10 hover:bg-secondary/30 transition-colors">
              <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {item.title}
              </div>
              <div className="text-[10px] mt-3 font-bold uppercase tracking-wider flex justify-between items-center">
                <span className="text-muted-foreground">{item.source}</span>
                <div className="flex gap-3 items-center">
                  {sent && (
                    <span className={cn('px-1.5 py-0.5 rounded', 
                      sent === 'positive' ? 'text-green-500' : 
                      sent === 'negative' ? 'text-red-500' : 
                      'text-gray-400'
                    )}>
                      {sent}
                    </span>
                  )}
                  <span className="text-muted-foreground">{new Date(item.published_at || item.publishedAt || Date.now()).toLocaleTimeString()}</span>
                </div>
              </div>
            </a>
          )})
        )}
      </div>
    </div>
  );
}
