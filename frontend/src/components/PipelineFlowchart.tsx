"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Database,
  LineChart,
  Newspaper,
  Network,
  Brain,
  FileJson,
  Save,
  LayoutDashboard
} from "lucide-react";

// Shared data
const nodes = [
  { id: "data_price", step: "1A", title: "Price Data", icon: Database, details: ["30D OHLCV", "Live Prices"], x: 8, y: 25 },
  { id: "data_news", step: "1B", title: "News Data", icon: Newspaper, details: ["News APIs", "RSS Feeds"], x: 8, y: 75 },
  { id: "tech", step: "02", title: "Math Engine", icon: LineChart, details: ["RSI / MACD", "Bollinger Bands"], tag: "[ COMPUTED, NOT GENERATED ]", x: 22, y: 25 },
  { id: "finbert", step: "03", title: "NLP Sentiment", icon: Brain, details: ["FinBERT Model", "Score -1 to 1"], x: 22, y: 75 },
  { id: "context", step: "04", title: "Context Build", icon: Network, details: ["Merge Signals", "Format Data"], x: 36, y: 50 },
  { id: "ai", step: "05", title: "Qwen 3.8", icon: Brain, details: ["qwen3.8-27b", "Market Reasoning"], isHero: true, x: 50, y: 50 },
  { id: "output", step: "06", title: "Strict JSON", icon: FileJson, details: ["BUY / HOLD / SELL", "Confidence %"], isOutput: true, x: 64, y: 50 },
  { id: "db", step: "07", title: "Storage", icon: Save, details: ["PostgreSQL", "JSONB Schema"], x: 78, y: 50 },
  { id: "dash", step: "08", title: "Dashboard", icon: LayoutDashboard, details: ["UI Update", "Simulators"], x: 92, y: 50 },
];

const edges = [
  { from: "data_price", to: "tech" },
  { from: "data_news", to: "finbert" },
  { from: "tech", to: "context" },
  { from: "finbert", to: "context" },
  { from: "context", to: "ai" },
  { from: "ai", to: "output" },
  { from: "output", to: "db" },
  { from: "db", to: "dash" }
];

const phases = [
  { name: "INGESTION", start: 0, end: 15, color: "#050505" },
  { name: "MATH AND NLP", start: 15, end: 29, color: "#0A0A0A" },
  { name: "LLM SYNTHESIS", start: 29, end: 71, color: "#0F0F0F" },
  { name: "PERSIST & DISPLAY", start: 71, end: 100, color: "#050505" }
];

export default function PipelineFlowchart() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // Get the available width (subtracting 32px for some padding)
        const availableWidth = containerRef.current.clientWidth - 32;
        // The original diagram is 1600px wide. We scale it down if the screen is smaller.
        const newScale = Math.min(1, availableWidth / 1600);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const getPath = (x1: number, y1: number, x2: number, y2: number) => {
    const dy = Math.abs(y2 - y1);
    const dx = Math.abs(x2 - x1);
    if (dy < 5) return `M ${x1} ${y1} L ${x2} ${y2}`;
    return `M ${x1} ${y1} C ${x1 + dx / 2} ${y1}, ${x1 + dx / 2} ${y2}, ${x2} ${y2}`;
  };

  const renderNodeContent = (node: any, isHovered: boolean) => {
    const isHero = node.isHero;
    const bgFill = isHero ? "bg-[#141414]" : (isHovered ? "bg-[#141414]" : "bg-[#0A0A0A]");
    const borderCol = isHero ? "border-[#FAFAFA]" : (isHovered ? "border-[#FAFAFA]" : "border-[#262626]");
    const iconBg = isHero ? "bg-[#FAFAFA]" : (isHovered ? "bg-[#FAFAFA]" : "bg-[#141414]");
    const iconCol = isHero ? "text-[#000000]" : (isHovered ? "text-[#000000]" : "text-[#FAFAFA]");
    const shadow = isHero ? "0 0 40px rgba(255,255,255,0.08)" : (isHovered ? "0 0 20px rgba(255,255,255,0.04)" : "none");
    const scale = isHero ? "scale-110" : "scale-100";

    return (
      <div
        className={`group relative flex flex-col items-start w-full sm:w-[200px] h-auto min-h-[120px] sm:min-h-[140px] rounded-xl p-4 shadow-2xl transition-all duration-300 ${bgFill} ${borderCol} border ${scale}`}
        style={{ boxShadow: shadow }}
      >
        <div className="flex items-center gap-3 mb-3 border-b border-[#262626] pb-3 w-full relative">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-[#262626] transition-colors ${iconBg}`}>
            <node.icon className={`w-4 h-4 transition-colors ${iconCol}`} />
          </div>
          <h4 className="text-[14px] font-semibold text-[#FAFAFA] text-left leading-tight">
            {node.title}
          </h4>

          {/* Number Badge */}
          <div className={`absolute -top-6 -left-6 w-5 h-5 rounded-full border ${isHero ? 'border-[#FAFAFA] bg-[#FAFAFA] text-black' : 'border-[#525252] bg-[#000000] text-[#A3A3A3]'} flex items-center justify-center text-[10px] font-bold z-20`}>
            {node.step.replace('0', '')}
          </div>
        </div>

        {node.tag && (
          <div className="text-[8px] uppercase tracking-wider text-[#FAFAFA] border border-[#525252] px-1.5 py-0.5 rounded mb-2 whitespace-nowrap w-full text-center">
            {node.tag}
          </div>
        )}

        <ul className="w-full space-y-1.5">
          {node.details.map((detail: string, idx: number) => (
            <li key={idx} className="text-[12px] text-[#A3A3A3] flex items-start gap-2 group-hover:text-[#FAFAFA] transition-colors">
              <span className="w-1 h-1 bg-[#525252] mt-[6px] shrink-0" />
              <span className="leading-tight">{detail}</span>
            </li>
          ))}
        </ul>

        {node.isOutput && (
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-white text-black rounded">BUY</span>
            <span className="px-2 py-0.5 text-[10px] font-bold border border-[#525252] text-[#A3A3A3] rounded">HOLD</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#525252] text-white rounded">SELL</span>
            <div className="text-[9px] text-[#737373] mt-1 w-full">*Not financial advice</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full relative pt-12 pb-12 bg-[#000000] border-t border-b border-[#262626] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Scaled Flowchart Container */}
      <div ref={containerRef} className="w-full flex justify-center px-4">
        <div
          className="relative font-sans transition-all duration-300"
          style={{ width: 1600 * scale, height: 600 * scale }}
        >
          <div
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: 1600, height: 600, transform: `scale(${scale})` }}
          >

            {/* Phase Background Bands */}
            <div className="absolute inset-0 flex pointer-events-none z-0 border-y border-[#262626]">
              {phases.map((phase, i) => (
                <div
                  key={i}
                  className="h-full relative border-r border-[#262626]"
                  style={{ width: `${phase.end - phase.start}%`, backgroundColor: phase.color }}
                >
                  <span className="absolute top-4 left-4 text-[11px] uppercase tracking-[0.12em] text-[#737373] font-semibold">
                    {phase.name}
                  </span>
                </div>
              ))}
            </div>

            {/* SVG Canvas for Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pipeLaser" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FAFAFA" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FAFAFA" stopOpacity="1" />
                  <stop offset="100%" stopColor="#FAFAFA" stopOpacity="0" />
                </linearGradient>
                <marker id="pipeArrow" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#525252" />
                </marker>
                <marker id="pipeArrowActive" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
                  <polygon points="0 0, 6 3, 0 6" fill="#FAFAFA" />
                </marker>
              </defs>

              {edges.map((edge, i) => {
                const fromNode = nodes.find(n => n.id === edge.from)!;
                const toNode = nodes.find(n => n.id === edge.to)!;
                const pathData = getPath(fromNode.x, fromNode.y, toNode.x, toNode.y);
                const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
                const isAnyHovered = hoveredNode !== null;
                const strokeColor = isAnyHovered && !isHovered ? "rgba(82,82,82,0.3)" : "#525252";
                const mEnd = isHovered ? "url(#pipeArrowActive)" : "url(#pipeArrow)";

                return (
                  <g key={"edge-" + i}>
                    <path d={pathData} fill="none" stroke={strokeColor} strokeWidth="1.5" vectorEffect="non-scaling-stroke" markerEnd={mEnd} className="transition-colors duration-300" />
                    <motion.path
                      d={pathData} fill="none" stroke="url(#pipeLaser)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeDasharray="10 100"
                      animate={{ strokeDashoffset: [110, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* DOM Nodes */}
            {nodes.map((node, i) => (
              <motion.div
                key={node.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                style={{ left: `${node.x}%`, top: `${node.y}%`, zIndex: node.isHero ? 30 : 20 }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {renderNodeContent(node, hoveredNode === node.id)}
              </motion.div>
            ))}

            {/* Swimlane Labels */}
            <div className="absolute top-[25%] left-2 transform -translate-y-1/2 text-[10px] text-[#737373] tracking-widest font-mono rotate-[-90deg] origin-center">PRICE_LANE</div>
            <div className="absolute top-[75%] left-2 transform -translate-y-1/2 text-[10px] text-[#737373] tracking-widest font-mono rotate-[-90deg] origin-center">NEWS_LANE</div>

            {/* Dashed Lane Containers */}
            <div className="absolute top-[10%] left-[6%] w-[20%] h-[30%] border border-dashed border-[#525252] rounded-xl pointer-events-none z-0 opacity-20" />
            <div className="absolute top-[60%] left-[6%] w-[20%] h-[30%] border border-dashed border-[#525252] rounded-xl pointer-events-none z-0 opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
}
