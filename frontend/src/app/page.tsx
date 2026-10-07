"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Globe,
  Cpu,
  TrendingUp,
  BarChart2,
  Calculator,
  ShieldAlert,
  Copy,
  Check,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ArchitectureDiagram from "../components/ArchitectureDiagram";
import PipelineFlowchart from "../components/PipelineFlowchart";
import { api } from "../lib/api";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const features = [
  {
    icon: <BarChart2 className="w-4 h-4" />,
    title: "Market Dashboard",
    subtitle: "Portfolio & P/L",
    description:
      "Real-time P/L tracking against Postgres buying prices. Visualizes portfolio value, 24h market volume, and a live Fear & Greed Index gauge.",
    image: "/dashboard-mockup.png",
    tag: "Live Data",
  },
  {
    icon: <Globe className="w-4 h-4" />,
    title: "Global News Stream",
    subtitle: "FinBERT Sentiment",
    description:
      "Live WebSocket news with automatic macro sentiment analysis (Positive vs Neutral vs Negative) powered by FinBERT NLP model.",
    image: "/news.png",
    tag: "WebSocket",
  },
  {
    icon: <Cpu className="w-4 h-4" />,
    title: "AI Recommendations",
    subtitle: "RAG Pipeline Output",
    description:
      "MACD, Bollinger Bands, Moving Averages, and Volatility — with the AI's exact reasoning bullets and an action conviction score.",
    image: "/recommendations.png",
    tag: "AI-Powered",
  },
  {
    icon: <ShieldAlert className="w-4 h-4" />,
    title: "Liquidation Tracker",
    subtitle: "Derivatives & Futures",
    description:
      "Funding Rates, Open Interest, Long/Short Ratios. Proprietary Liquidation Heat score warns of impending long or short squeezes.",
    image: "/futures.png",
    tag: "Risk",
  },
  {
    icon: <TrendingUp className="w-4 h-4" />,
    title: "India Crypto Hub",
    subtitle: "Arbitrage & Tax",
    description:
      "Measures the 'India Premium' gap between global USD and local INR prices. Includes a tax-aware sell preview for Indian users.",
    image: "/india-hub.png",
    tag: "Local",
  },
  {
    icon: <Calculator className="w-4 h-4" />,
    title: "DCA Simulator",
    subtitle: "Backtesting Engine",
    description:
      "Backtest Dollar Cost Averaging strategies with exact buy points on daily/weekly/monthly intervals. Renders a precise Recharts AreaChart.",
    image: "/simulator.png",
    tag: "Simulator",
  },
];

const ragSteps = [
  {
    num: "01",
    title: "Data Ingestion",
    desc: "Queries external APIs for exact 30-day OHLCV data, global market cap, and recent news articles.",
  },
  {
    num: "02",
    title: "Deterministic Math",
    desc: "Computes exact technical indicators (RSI, MACD, Bollinger Bands) server-side to feed factual math to the LLM.",
  },
  {
    num: "03",
    title: "NLP Sentiment",
    desc: "Feeds news titles/descriptions into FinBERT to get a weighted sentiment score from -1 to 1.",
  },
  {
    num: "04",
    title: "LLM Synthesis",
    desc: "Forces the LLM to output a strict JSON schema with price targets, actions, and exact reasoning.",
  },
];

const steps = [
  {
    title: "Clone the repository",
    code: "git clone https://github.com/punyajain1/Beacon.git",
  },
  {
    title: "Setup Backend",
    code: "cd backend\nnpm install\n# Setup .env with DATABASE_URL, QWEN_API_KEY, etc.\nnpx prisma db push\nnpm run dev",
  },
  {
    title: "Setup Frontend",
    code: "cd frontend\nnpm install\n# Setup .env.local if needed\nnpm run dev",
  },
  {
    title: "View Dashboard",
    code: "Navigate to http://localhost:3000\nto view the Beacon Dashboard.",
  },
];

export default function LandingPage() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  useEffect(() => {
    // Wake up the backend when a user visits the landing page
    api.wakeup();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800 overflow-x-hidden">

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-white rounded flex items-center justify-center shrink-0">
              <LineChart className="w-3 h-3 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Beacon
              <span className="text-neutral-500 font-normal hidden sm:inline">
                {" "}by{" "}
                <a
                  href="https://www.punyajain.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Punya Jain
                </a>
              </span>
            </span>
          </div>

          {/* Desktop nav links */}
          <div className="flex items-center gap-6">
            <Link href="#features" className="hidden md:block text-xs text-neutral-400 hover:text-white transition-colors">Features</Link>
            <Link href="#architecture" className="hidden md:block text-xs text-neutral-400 hover:text-white transition-colors">Architecture</Link>
            <Link href="#getting-started" className="hidden md:block text-xs text-neutral-400 hover:text-white transition-colors">Setup</Link>
            <Link
              href="/demo"
              className="hidden md:flex items-center gap-1.5 text-xs font-medium text-black bg-emerald-500 hover:bg-emerald-400 px-3 py-1.5 rounded-full transition-all"
            >
              View Demo
            </Link>
            <Link
              href="https://github.com/punyajain1/Beacon"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 px-3 py-1.5 rounded-full transition-all"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Star on GitHub</span>
              <span className="sm:hidden">GitHub</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="pt-24 pb-0 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-950 text-xs text-neutral-400 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Advanced AI-Driven Dashboard
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="text-[clamp(2.5rem,10vw,5.5rem)] font-bold tracking-tighter leading-none mb-4"
          >
            Beacon
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.14 }}
            className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed max-w-xl mb-8"
          >
            An AI-driven portfolio &amp; market intelligence dashboard that
            synthesizes technical indicators, live news sentiment, and LLM
            reasoning into opinionated trading recommendations.
          </motion.p>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-10"
          >
            <Link
              href="/demo"
              className="flex items-center gap-2 bg-emerald-500 text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
            >
              View Demo
            </Link>
            <Link
              href="https://github.com/punyajain1/Beacon"
              target="_blank"
              className="flex items-center gap-2 bg-white text-black text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-neutral-200 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              View on GitHub
            </Link>
            <Link
              href="#features"
              className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white transition-colors px-4 py-2.5"
            >
              Explore features <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Hero image — flush bottom, no gap */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="w-full rounded-t-2xl overflow-hidden border border-b-0 border-neutral-800 shadow-[0_-8px_60px_rgba(255,255,255,0.04)]"
          >
            <Image
              src="/dashboard-mockup.png"
              alt="Beacon Dashboard"
              width={1200}
              height={750}
              className="w-full object-cover object-top"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section id="features" className="py-20 px-4 sm:px-6 border-t border-white/5 bg-neutral-950/30">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-14">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">What's inside</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Core Features</h2>
          </div>

          {/* Mobile: vertical list | Tablet+: 2-col grid | Desktop: 3-col */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="group flex flex-col bg-neutral-950 rounded-2xl border border-neutral-900 hover:border-neutral-700 transition-all overflow-hidden"
              >
                {/* Screenshot thumbnail */}
                {feature.image && (
                  <div className="relative w-full aspect-[16/9] bg-neutral-900 overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Tag */}
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-black/70 backdrop-blur-sm border border-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full">
                      {feature.tag}
                    </span>
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col gap-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight">{feature.title}</h3>
                      <p className="text-[11px] text-neutral-500">{feature.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE ─────────────────────────────────────── */}
      <section id="architecture" className="scroll-mt-14 border-t border-white/5">
        <ArchitectureDiagram />
      </section>

      {/* ── RAG PIPELINE ─────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 sm:mb-14">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">How it thinks</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">AI Cognitive Engine</h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-2xl">
              Beacon's recommendation engine uses a rigorous{" "}
              <strong className="text-neutral-200">Retrieval-Augmented Generation (RAG)</strong>{" "}
              pipeline tailored specifically for quantitative finance — no hallucination, only grounded math.
            </p>
          </div>

          {/* Step cards — 2-col on mobile, 4-col on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-0">
            {ragSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="bg-neutral-950 p-4 sm:p-5 rounded-xl border border-neutral-800 flex flex-col gap-2"
              >
                <span className="text-2xl font-bold text-neutral-800 leading-none">{step.num}</span>
                <h4 className="text-sm font-semibold text-neutral-200">{step.title}</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <PipelineFlowchart />
        </div>
      </section>

      {/* ── DATABASE SCHEMA ───────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5 bg-neutral-950/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center">
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Data layer</p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">JSONB Advantage</h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Beacon uses PostgreSQL's{" "}
                <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-200 text-xs">JSON/JSONB</code>{" "}
                column type via Prisma to handle unstructured LLM outputs without rigid schema migrations.
              </p>
              <p className="text-neutral-500 text-sm leading-relaxed">
                When the AI prompt is updated to return new indicators, the database adapts automatically —
                everything is preserved exactly as the model generates it.
              </p>
            </div>

            {/* Code block */}
            <div className="w-full lg:w-[480px] shrink-0">
              <div className="bg-[#0d1117] rounded-xl border border-neutral-800 overflow-hidden">
                {/* Window chrome */}
                <div className="px-4 py-2.5 bg-neutral-900 border-b border-neutral-800 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60 border border-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60 border border-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60 border border-green-500/80" />
                  <span className="ml-2 text-xs text-neutral-500 font-mono">schema.prisma</span>
                </div>
                <pre className="p-4 sm:p-5 text-xs sm:text-sm font-mono text-neutral-300 overflow-x-auto leading-relaxed">
                  <code>{`model PortfolioAnalysis {
  id          String    @id @default(uuid())
  portfolioId String
  portfolio   Portfolio @relation(
    fields: [portfolioId],
    references: [id],
    onDelete: Cascade
  )

  data        Json     // Full AI output (JSONB)
  createdAt   DateTime @default(now())
}`}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GETTING STARTED ───────────────────────────────────── */}
      <section id="getting-started" className="py-20 px-4 sm:px-6 border-t border-white/5 scroll-mt-14">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-3">Self-host</p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">Getting Started</h2>
            <p className="text-neutral-500 text-sm">
              Prerequisites: Node.js v18+, PostgreSQL, Qwen API Key &amp; HuggingFace token.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.07 }}
                className="bg-neutral-950 rounded-xl border border-neutral-900"
              >
                {/* Step header */}
                <div className="flex items-center gap-3 px-4 sm:px-5 py-3 border-b border-neutral-900">
                  <span className="w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-400 shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-sm font-medium text-neutral-200">{step.title}</h3>
                </div>

                {/* Code */}
                <div className="relative group">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(step.code);
                      setCopiedStep(i);
                      setTimeout(() => setCopiedStep(null), 2000);
                    }}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-400 opacity-0 group-hover:opacity-100 transition-all hover:text-white hover:bg-neutral-700"
                    title="Copy"
                  >
                    {copiedStep === i ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <pre className="px-4 sm:px-5 py-4 text-xs sm:text-sm font-mono text-neutral-400 leading-relaxed overflow-x-auto">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </motion.div>
            ))}
          </div>

          {/* GitHub CTA */}
          <div className="mt-10 flex justify-center">
            <Link
              href="https://github.com/punyajain1/Beacon"
              target="_blank"
              className="group flex items-center gap-2.5 bg-white text-black text-sm font-semibold px-6 py-3 rounded-full hover:bg-neutral-100 transition-all"
            >
              <GithubIcon className="w-4 h-4" />
              View full source on GitHub
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-10 border-t border-white/5 bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white rounded flex items-center justify-center">
              <LineChart className="w-2.5 h-2.5 text-black" />
            </div>
            <span className="text-sm font-semibold">Beacon</span>
          </div>
          <p className="text-xs text-neutral-500 text-center">
            Built by{" "}
            <a
              href="https://www.punyajain.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-white transition-colors"
            >
              Punya Jain
            </a>
            {" "}· Open Source on GitHub
          </p>
          <Link
            href="https://github.com/punyajain1/Beacon"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            GitHub
          </Link>
        </div>
      </footer>
    </main>
  );
}
