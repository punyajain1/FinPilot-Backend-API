'use client';

import { useState } from 'react';
import { Activity, Bell, Search, LayoutDashboard, Target, Beaker, FileText, MessageSquare, Newspaper, MapPin, Flame, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Newspaper, label: 'News', id: 'news' },
  { icon: Target, label: 'Recommendations', id: 'recommendations' },
  { icon: Beaker, label: 'Simulator', id: 'simulator' },
  { icon: MapPin, label: 'India Hub', id: 'india' },
  { icon: Flame, label: 'Futures', id: 'derivatives' },
  { icon: MessageSquare, label: 'Chatbot', id: 'chatbot' },
  { icon: FileText, label: 'Docs', id: 'docs' },
];

export function Header({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (t: string) => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex w-full items-center justify-between py-4 px-4 md:px-6 bg-card border-b border-border">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 md:gap-3 mr-2 md:mr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
            <Activity size={18} />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-foreground">Beacon</h1>
          <div className="flex items-center gap-1.5 ml-1 bg-secondary/50 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-muted-foreground">Live</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                activeTab === item.id
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="lg:hidden p-2 text-foreground"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 z-50 bg-card border-b border-border shadow-lg lg:hidden flex flex-col p-4 gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors w-full text-left',
                activeTab === item.id
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      )}

    </header>
  );
}
