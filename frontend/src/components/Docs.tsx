'use client';

import { cn } from '@/lib/utils';
import { BookOpen, Code, Database, Globe, LineChart, Shield, Zap, Info, Server, Sparkles, Binary, Landmark } from 'lucide-react';

export function Docs({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-16 max-w-5xl mx-auto w-full pb-20', className)}>
      <div className="flex flex-col gap-4 border-b border-border pb-10">
        <h1 className="text-4xl font-extrabold text-foreground flex items-center gap-4">
          <BookOpen className="text-primary" size={40} />
          Beacon Technical Deep Dive
        </h1>
        <p className="text-muted-foreground text-xl">
          The comprehensive architecture and reasoning manual for the Beacon platform. This document covers exactly how every module functions from the ground up, the underlying technical implementations, and the design philosophies driving them.
        </p>
      </div>

      {/* 1. Core Architecture & Stack */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Database className="text-orange-500" /> 1. Architecture & Stack
        </h2>
        <div className="bg-secondary/10 border border-border rounded-xl p-8 text-sm text-muted-foreground leading-relaxed space-y-6">
          <p>
            Beacon operates on a decoupled client-server architecture designed for high-frequency data ingestion and complex LLM orchestration.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Globe size={18} /> Frontend (Client)
              </h3>
              <ul className="list-none space-y-3">
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Next.js 14 (App Router)</strong>
                  <span>Provides the React foundation. We use Client Components (`'use client'`) heavily due to the reliance on WebSockets and dynamic polling hooks.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Tailwind CSS & Lucide</strong>
                  <span>The styling engine relies on utility classes with custom theme variables (e.g., `bg-background`, `text-primary`) supporting a dynamic dark mode UI. Icons are sourced from Lucide-React.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Recharts</strong>
                  <span>Used for SVG-based data visualizations, including the 30-day Fear & Greed trend and the DCA Simulator chart.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Server size={18} /> Backend (Server)
              </h3>
              <ul className="list-none space-y-3">
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Node.js + Express</strong>
                  <span>The backend handles data aggregation from external REST and WebSocket endpoints, processing it before passing it to the frontend.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">PostgreSQL + Prisma ORM</strong>
                  <span>Our persistent data layer. It stores `User` profiles, `Portfolio` state, cached `News`, and JSON payloads of `PortfolioAnalysis`. Using Postgres JSONB allows flexible schema changes for AI payloads.</span>
                </li>
                <li className="flex flex-col gap-1">
                  <strong className="text-foreground">Caching & Rate Limiting</strong>
                  <span>Because LLM API calls (like Groq) are expensive and strictly rate-limited (e.g., 9 requests/hour), the backend implements aggressive caching. Historical analyses are queried from the DB before hitting the AI.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. The AI Grounding Engine */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Sparkles className="text-yellow-500" /> 2. AI Cognitive Engine Deep Dive
        </h2>
        <div className="bg-card border border-border rounded-xl p-8 text-sm text-muted-foreground leading-relaxed space-y-6 shadow-sm">
          <p>
            The Recommendation Engine is Beacon's crown jewel. It doesn't rely on simple moving average crossovers to give advice; it builds a massive context window using a Retrieval-Augmented Generation (RAG) architecture.
          </p>
          
          <div className="flex flex-col gap-6 relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-primary/20" />
            
            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-lg">1</div>
              <div className="flex flex-col gap-2 mt-1">
                <h4 className="font-bold text-foreground text-base">Market Data Ingestion</h4>
                <p>When the `triggerAnalysis(id)` API is called, the backend queries external APIs (CoinGecko/Binance) for exactly 30 days of OHLCV (Open, High, Low, Close, Volume) data. It also pulls the current global market cap, ranking, and circulating supply.</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-lg">2</div>
              <div className="flex flex-col gap-2 mt-1">
                <h4 className="font-bold text-foreground text-base">Deterministic Math Layer</h4>
                <p>Before the LLM even sees the data, the backend mathematically computes critical indicators: <strong>RSI (14-period)</strong>, <strong>MACD (12/26/9)</strong>, <strong>Bollinger Bands (20-period)</strong>, and <strong>Volatility (Standard Deviation of log returns)</strong>. This guarantees the AI isn't "hallucinating" math—it is fed exact technical values.</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-lg">3</div>
              <div className="flex flex-col gap-2 mt-1">
                <h4 className="font-bold text-foreground text-base">NLP Sentiment Analysis</h4>
                <p>Recent news articles regarding the asset are retrieved and passed through <strong>HuggingFace FinBERT</strong>, a model pre-trained specifically on financial lexicon. This outputs a weighted sentiment score (-1 to 1) and label.</p>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-lg">4</div>
              <div className="flex flex-col gap-2 mt-1">
                <h4 className="font-bold text-foreground text-base">LLM Synthesis & Strict JSON Generation</h4>
                <p>
                  All this formatted context is injected into a prompt for a massive OSS model (e.g., Llama-3 120B via Groq). The prompt enforces a strict JSON schema. The model must synthesize the technicals and sentiment, decide on a `BUY/SELL/HOLD` action, predict a 7-day price target, and provide an array of analytical `reasoning` bullets.
                </p>
                <div className="bg-black/50 border border-border/50 p-4 rounded-lg mt-2 overflow-x-auto">
                  <pre className="text-green-400 font-mono text-[10px]">
{`{
  "action": "HOLD",
  "reasoning": [
    "The RSI at 44.71 is in neutral territory...",
    "Price is trading at $0.07, hitting the lower Bollinger Band..."
  ],
  "confidence": 65,
  "priceTarget": 0.0725,
  ...
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Deep Dive into Features */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Binary className="text-blue-500" /> 3. Modular Feature Breakdown
        </h2>
        
        <div className="flex flex-col gap-8">
          
          {/* Dashboard & Portfolio */}
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center gap-3">
              <LineChart className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-foreground">Dashboard & Portfolio Table</h3>
            </div>
            <div className="p-6 text-sm text-muted-foreground space-y-4">
              <p><strong>What:</strong> The landing view that tracks the user's manually entered asset holdings.</p>
              <p><strong>How:</strong> The frontend makes a GET request to the portfolio service. The backend calculates `currentValue` by hitting a live price endpoint, diffs it against the `buyingPrice * amount` from the Postgres database, and returns the net Profit/Loss.</p>
              <p><strong>Why:</strong> Standardizes the user's exposure, acting as the anchor point for the AI engine to know *what* assets to analyze.</p>
            </div>
          </div>

          {/* News Stream */}
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center gap-3">
              <Globe className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-foreground">Global News Stream & FinBERT</h3>
            </div>
            <div className="p-6 text-sm text-muted-foreground space-y-4">
              <p><strong>What:</strong> A real-time scrolling feed of macroeconomic and crypto news.</p>
              <p><strong>How:</strong> Uses a `WebSocket` connection to the backend. As news hits the backend, the backend fires off a fast NLP process (FinBERT) to classify the title/description as Positive, Neutral, or Negative. The WS then pushes the hydrated payload to the frontend React state. A progress bar tracks the aggregate market split.</p>
              <p><strong>Why:</strong> Sentiment precedes price. Displaying the raw feed alongside macro-sentiment metrics allows users to gauge the global mood instantly.</p>
            </div>
          </div>

          {/* Derivatives & Liquidation */}
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center gap-3">
              <Zap className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-foreground">Derivatives & Liquidation Tracker</h3>
            </div>
            <div className="p-6 text-sm text-muted-foreground space-y-4">
              <p><strong>What:</strong> Tracks the futures market health for an asset.</p>
              <p><strong>How:</strong> Queries Binance Futures API for `Funding Rate`, `Open Interest`, and the `Long/Short Ratio`. A proprietary logic block determines "Liquidation Heat." If Funding Rates are exceptionally negative and Open Interest is high, it flags an `EXTREME` risk of a short squeeze.</p>
              <p><strong>Why:</strong> The spot market is often pushed by leverage cascades in the futures market. Knowing the squeeze risk is vital for short-term risk management.</p>
            </div>
          </div>

          {/* India Hub */}
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            <div className="bg-secondary/30 px-6 py-4 border-b border-border flex items-center gap-3">
              <Landmark className="text-primary" size={20} />
              <h3 className="font-bold text-lg text-foreground">India Crypto Hub (Arbitrage & Tax)</h3>
            </div>
            <div className="p-6 text-sm text-muted-foreground space-y-4">
              <p><strong>What:</strong> A localized tool to measure the "India Premium" and preview exact tax implications.</p>
              <p><strong>How:</strong> The backend queries global USD prices and the current USD/INR forex rate to calculate the "Implied INR Price". It then queries an Indian exchange (e.g., CoinDCX or WazirX) order book. The difference is the `premiumPercentage`.</p>
              <p>For taxes, the frontend form sends the Buy/Sell delta to the backend, which strictly enforces Indian crypto tax law: 30% flat tax on gross profit (no loss offsets) + 1% TDS on the total sell proceeds, returning the exact net INR expected.</p>
              <p><strong>Why:</strong> Indian crypto markets trade in silos due to strict capital controls. A global price tracker is useless for an Indian user who wants to know exactly what they will receive in their local bank account.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Security & Data Management */}
      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Shield className="text-purple-500" /> 4. Security & Database Models
        </h2>
        <div className="bg-secondary/10 border border-border rounded-xl p-8 text-sm text-muted-foreground leading-relaxed space-y-4">
          <p>
            Beacon is built with a strictly <strong>Read-Only, Non-Custodial</strong> posture. We do not require wallet private keys, nor do we route actual trades. 
          </p>
          <p>
            From a database perspective, AI generations are inherently unpredictable in length and structure. By utilizing PostgreSQL's `JSONB` column type for the `PortfolioAnalysis` model, we can safely store nested arrays (like the dynamic `reasoning` bullets and nested `macd` objects) without requiring rigorous schema migrations every time the AI prompt is updated to include a new indicator.
          </p>
          <div className="bg-black/50 border border-border/50 p-4 rounded-lg mt-4 font-mono text-xs text-muted-foreground overflow-x-auto">
            <span className="text-purple-400">model</span> <span className="text-blue-300">PortfolioAnalysis</span> {'{'}
            <br />
            {'  '}id             String    @id @default(uuid())<br />
            {'  '}portfolioId    String<br />
            {'  '}portfolio      Portfolio @relation(fields: [portfolioId], references: [id])<br />
            {'  '}<span className="text-green-400">data           Json</span>      // Contains full AI Recommendation JSON<br />
            {'  '}createdAt      DateTime  @default(now())<br />
            {'}'}
          </div>
        </div>
      </section>

    </div>
  );
}
