'use client';

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const data = [
  { name: 'Jan', speed1: 40, speed2: 24 },
  { name: 'Feb', speed1: 30, speed2: 13 },
  { name: 'Mar', speed1: 20, speed2: 98 },
  { name: 'Apr', speed1: 27, speed2: 39 },
  { name: 'May', speed1: 18, speed2: 48 },
  { name: 'Jun', speed1: 23, speed2: 38 },
  { name: 'Jul', speed1: 34, speed2: 43 },
  { name: 'Aug', speed1: 44, speed2: 28 },
  { name: 'Sep', speed1: 30, speed2: 38 },
  { name: 'Oct', speed1: 40, speed2: 43 },
  { name: 'Nov', speed1: 20, speed2: 28 },
  { name: 'Dec', speed1: 30, speed2: 38 },
];

export function NetworkSpeedChart({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');

  return (
    <div className={cn('flex flex-col justify-between rounded-md bg-card p-6 border border-border shadow-sm', className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">Network Speed</h2>
        <div className="flex gap-4 text-sm font-medium">
          {['Daily', 'Weekly', 'Monthly'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                'transition-colors',
                activeTab === tab ? 'text-primary border-b-2 border-primary pb-1' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#a1a1aa', fontSize: 12 }} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111111', border: '1px solid #222222', borderRadius: '4px' }}
              itemStyle={{ color: '#ffffff' }}
            />
            <Line 
              type="monotone" 
              dataKey="speed1" 
              stroke="#ffffff" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4, fill: '#ffffff', stroke: '#000000', strokeWidth: 2 }} 
            />
            <Line 
              type="monotone" 
              dataKey="speed2" 
              stroke="#555555" 
              strokeWidth={2} 
              dot={false} 
              activeDot={{ r: 4, fill: '#555555', stroke: '#000000', strokeWidth: 2 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
