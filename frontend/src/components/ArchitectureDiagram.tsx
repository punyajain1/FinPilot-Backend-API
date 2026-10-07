"use client";

import React, { useState } from "react";
import { Network } from "lucide-react";

const containers = [
  { id: "c_frontend", label: "Frontend", x: 600, y: 120, w: 240, h: 120 },
  { id: "c_backend", label: "Backend Server", x: 490, y: 400, w: 540, h: 280 },
  { id: "c_db", label: "Databases", x: 140, y: 760, w: 200, h: 140 },
  { id: "c_ext", label: "External Data Sources", x: 510, y: 760, w: 420, h: 140 },
  { id: "c_cog", label: "Cognitive Layer", x: 980, y: 760, w: 400, h: 140 },
];

const nodes = [
  { id: "frontend", label: ["Next.js App", "Router UI"], x: 600, y: 120, w: 180, h: 60 },
  { id: "redis", label: ["Redis / Memory", "Cache"], x: 340, y: 330, w: 140, h: 60 },
  { id: "express", label: ["Express Node.js", "Server"], x: 600, y: 330, w: 160, h: 60 },
  { id: "math", label: ["Deterministic", "Math Engine"], x: 600, y: 470, w: 180, h: 60 },
  { id: "db", label: ["PostgreSQL +", "Prisma"], x: 140, y: 760, w: 160, h: 60 },
  { id: "crypto", label: ["Binance /", "CoinGecko /", "DexScreener"], x: 400, y: 760, w: 160, h: 80 },
  { id: "news", label: ["RSS / Global", "News APIs"], x: 620, y: 760, w: 160, h: 80 },
  { id: "nlp", label: ["HuggingFace", "FinBERT - NLP"], x: 880, y: 760, w: 160, h: 80 },
  { id: "llm", label: ["Qwen", "qwen3.8-27b - LLM"], x: 1080, y: 760, w: 160, h: 80 },
];

const edges = [
  { from: "frontend", to: "express", path: "M 600 150 L 600 300", label: "REST & WebSocket", lx: 600, ly: 225, bidir: true },
  { from: "express", to: "redis", path: "M 520 330 L 410 330", label: "", lx: 0, ly: 0, bidir: true },
  { from: "express", to: "math", path: "M 600 360 L 600 440", label: "Calculate RSI/MACD", lx: 600, ly: 400, bidir: false },
  { from: "express", to: "db", path: "M 570 360 L 570 380 L 140 380 L 140 730", label: "Store/Retrieve JSON", lx: 140, ly: 600, bidir: true },
  { from: "express", to: "crypto", path: "M 585 360 L 585 410 L 400 410 L 400 720", label: "Fetch Prices/OHLCV", lx: 400, ly: 650, bidir: false },
  { from: "express", to: "news", path: "M 615 360 L 615 410 L 620 410 L 620 720", label: "Fetch Breaking News", lx: 620, ly: 600, bidir: false },
  { from: "express", to: "nlp", path: "M 630 360 L 630 380 L 880 380 L 880 720", label: "Analyze Sentiment", lx: 880, ly: 650, bidir: false },
  { from: "express", to: "llm", path: "M 680 330 L 1080 330 L 1080 720", label: "Generate Recommendations", lx: 1080, ly: 600, bidir: false },
];

export default function ArchitectureDiagram() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  React.useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // Get the available width (subtracting 32px for some padding)
        const availableWidth = containerRef.current.clientWidth - 32;
        // The original diagram is 1200px wide. We scale it down if the screen is smaller.
        const newScale = Math.min(1, availableWidth / 1200);
        setScale(newScale);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="w-full relative pt-12 pb-24 bg-[#000000] border-t border-b border-[#262626] overflow-hidden">
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      {/* Header section */}
      <div className="text-center mb-10 relative z-50 flex flex-col items-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0A0A0A] border border-[#262626] mb-6 backdrop-blur-md">
          <Network className="w-4 h-4 text-[#A3A3A3]" />
          <span className="text-sm font-medium text-[#FAFAFA]">System Architecture</span>
        </div>
        <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-[#FAFAFA]">
          Component Diagram
        </h3>
      </div>

      {/* Main Diagram Container */}
      <div ref={containerRef} className="w-full flex justify-center px-4 overflow-hidden pb-10">
        <div 
          className="relative font-sans transition-all duration-300"
          style={{ width: 1200 * scale, height: 850 * scale }}
        >
          {/* Scaled Inner Wrapper */}
          <div 
            className="absolute top-0 left-0 origin-top-left"
            style={{ width: 1200, height: 850, transform: `scale(${scale})` }}
          >
          
          {/* Containers */}
          {containers.map(c => (
            <div 
              key={c.id}
              className="absolute border border-[#262626] bg-[#0A0A0A]/50 rounded-xl flex flex-col items-center pt-3 pointer-events-none"
              style={{
                left: c.x - c.w/2,
                top: c.y - c.h/2,
                width: c.w,
                height: c.h
              }}
            >
              <span className="text-[12px] font-semibold text-[#A3A3A3] tracking-wide">{c.label}</span>
            </div>
          ))}

          {/* SVG Connectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#525252" />
              </marker>
              <marker id="arrow-reverse" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
                <polygon points="8 0, 0 4, 8 8" fill="#525252" />
              </marker>
              <marker id="arrow-active" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
                <polygon points="0 0, 8 4, 0 8" fill="#FAFAFA" />
              </marker>
              <marker id="arrow-reverse-active" markerWidth="8" markerHeight="8" refX="0" refY="4" orient="auto">
                <polygon points="8 0, 0 4, 8 8" fill="#FAFAFA" />
              </marker>
            </defs>
            
            {edges.map((edge, i) => {
              const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
              const isAnyHovered = hoveredNode !== null;
              const strokeColor = isHovered ? "#FAFAFA" : (isAnyHovered ? "rgba(82,82,82,0.3)" : "#525252");
              
              let markerEnd = isHovered ? "url(#arrow-active)" : "url(#arrow)";
              let markerStart = edge.bidir ? (isHovered ? "url(#arrow-reverse-active)" : "url(#arrow-reverse)") : "none";
              
              return (
                <path 
                  key={"path-" + i}
                  d={edge.path}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="1.5"
                  markerEnd={markerEnd}
                  markerStart={markerStart}
                  className="transition-colors duration-300"
                />
              );
            })}
          </svg>

          {/* Edge Labels */}
          {edges.map((edge, i) => {
            if (!edge.label) return null;
            const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
            const zIndex = isHovered ? 40 : 20;

            return (
              <div 
                key={"label-" + i}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300"
                style={{ left: edge.lx, top: edge.ly, zIndex }}
              >
                <span className={`px-2 py-0.5 text-[10px] font-medium border rounded whitespace-nowrap bg-[#000000] transition-colors ${isHovered ? 'border-[#FAFAFA] text-[#FAFAFA]' : 'border-[#262626] text-[#A3A3A3]'}`}>
                  {edge.label}
                </span>
              </div>
            );
          })}

          {/* DOM Nodes */}
          {nodes.map((node) => {
            const isHovered = hoveredNode === node.id;
            const isAnyHovered = hoveredNode !== null;
            const opacity = isAnyHovered && !isHovered ? 0.4 : 1;
            
            return (
              <div
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-lg border transition-all duration-300 cursor-default ${isHovered ? 'bg-[#141414] border-[#FAFAFA] shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-[#0A0A0A] border-[#525252]'}`}
                style={{
                  left: node.x,
                  top: node.y,
                  width: node.w,
                  height: node.h,
                  opacity,
                  zIndex: isHovered ? 50 : 30
                }}
              >
                {node.label.map((line, idx) => (
                  <span key={idx} className={`text-[12px] text-center font-medium leading-snug ${isHovered ? 'text-[#FAFAFA]' : 'text-[#FAFAFA]'}`}>
                    {line}
                  </span>
                ))}
              </div>
            );
          })}

          </div>
        </div>
      </div>
    </div>
  );
}
