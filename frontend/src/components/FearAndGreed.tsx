'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Area, AreaChart, ResponsiveContainer, Tooltip, YAxis, XAxis } from 'recharts';
import { Activity } from 'lucide-react';

export function FearAndGreed({ className }: { className?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [current, setCurrent] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.alternative.me/fng/?limit=30')
      .then(res => res.json())
      .then(json => {
        if (json && json.data) {
          const reversed = [...json.data].reverse().map((d: any) => ({
            ...d,
            value: parseInt(d.value, 10),
            date: new Date(parseInt(d.timestamp, 10) * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          }));
          setData(reversed);
          setCurrent(json.data[0]); // the most recent
        }
      })
      .catch(console.error);
  }, []);

  const getGaugeColor = (val: number) => {
    if (val <= 25) return '#ef4444'; // Extreme Fear (Red)
    if (val <= 45) return '#f97316'; // Fear (Orange)
    if (val <= 55) return '#eab308'; // Neutral (Yellow)
    if (val <= 75) return '#84cc16'; // Greed (Light Green)
    return '#22c55e'; // Extreme Greed (Green)
  };

  if (!current) return null;

  const currentVal = parseInt(current.value, 10);
  const color = getGaugeColor(currentVal);

  const cx = 80;
  const cy = 80;
  const r = 70;
  const circumference = Math.PI * r;
  const segmentLength = circumference / 5;
  const gap = 4;
  const dashLength = segmentLength - gap;
  
  const colors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];
  const activeIdx = Math.min(Math.floor(currentVal / 20), 4);
  
  const angle = 180 - (currentVal / 100) * 180;
  const rad = (angle * Math.PI) / 180;
  const markerX = cx + r * Math.cos(rad);
  const markerY = cy - r * Math.sin(rad);

  return (
    <div className={cn("flex flex-col gap-8 p-6 rounded-xl bg-card border border-border w-full", className)}>
      {/* Gauge / Current value */}
      <div className="flex flex-col items-center justify-center min-w-[200px] w-full max-w-[240px] mx-auto">
        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2 text-center">
          Fear & Greed Index
        </div>
        
        <div className="relative w-full aspect-[2/1] flex items-end justify-center overflow-visible mt-2">
          {/* Subtle Outer Glow */}
          <div className="absolute bottom-0 w-3/4 h-3/4 rounded-t-full blur-xl opacity-10" style={{ backgroundColor: color }}></div>
          
          <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 160 90" preserveAspectRatio="xMidYMax meet">
            {/* 5 Segments */}
            {colors.map((c, i) => (
              <path 
                key={i}
                d={`M 10 80 A 70 70 0 0 1 150 80`}
                fill="none" 
                stroke={c} 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeDasharray={`${dashLength} 1000`}
                strokeDashoffset={-(i * segmentLength)}
                opacity={i === activeIdx ? 1 : 0.2}
                className="transition-opacity duration-500"
              />
            ))}
            
            {/* Marker */}
            <circle 
              cx={markerX} 
              cy={markerY} 
              r="4" 
              fill="#fff" 
              stroke={color}
              strokeWidth="2"
              className="drop-shadow-md transition-all duration-1000 ease-out"
            />

            {/* Text embedded in SVG for perfect centering */}
            <text x="80" y="65" textAnchor="middle" fontSize="36" fontWeight="900" fill={color} style={{ textShadow: `0 0 20px ${color}40` }}>
              {currentVal}
            </text>
            <text x="80" y="80" textAnchor="middle" fontSize="9" fontWeight="bold" fill="currentColor" className="text-muted-foreground uppercase tracking-wider">
              {current.value_classification}
            </text>
          </svg>
        </div>
      </div>

      {/* 30-Day Trend Chart */}
      <div className="flex-1 flex flex-col h-[180px]">
        <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          30-Day Market Mood Trend
        </div>
        <div className="flex-1 w-full h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide={false} stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} minTickGap={20} />
              <YAxis hide={false} domain={[0, 100]} stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} width={25} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111111', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase' }}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return payload[0].payload.date;
                  }
                  return label;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
