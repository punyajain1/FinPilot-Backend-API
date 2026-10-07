import { Phone, MoreVertical, Send, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RightSidebar({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-8 w-full xl:w-80', className)}>
      {/* Consultation Card */}
      <div className="flex flex-col rounded-3xl bg-card p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-foreground max-w-[120px] leading-tight">Online consultation with an operator</h3>
          <button className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
            <Plus size={14} /> Join
          </button>
        </div>
        
        <div className="flex items-center justify-between rounded-2xl bg-primary/20 p-3 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=monika" alt="Monika S." className="h-full w-full object-cover" />
            </div>
            <span className="font-medium text-sm text-foreground">Monika S.</span>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <button className="p-2 hover:bg-primary/20 rounded-full transition-colors"><Phone size={16} /></button>
            <button className="p-2 hover:bg-primary/20 rounded-full transition-colors"><MoreVertical size={16} /></button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-foreground mb-4">Messages</h3>
        <div className="flex flex-col gap-4">
          {[
            { name: 'David S.', msg: 'Your mobile internet is amazing!', img: 'a' },
            { name: 'David S.', msg: 'Beacon, your service is awesome...', img: 'b' },
            { name: 'David S.', msg: 'Thanks for the great service...', img: 'c' },
            { name: 'David S.', msg: 'Wow, Beacon, your internet is...', img: 'd' },
            { name: 'David S.', msg: 'Beacon - the best service...', img: 'e' },
          ].map((msg, i) => (
            <div key={i} className="flex items-center gap-3 group cursor-pointer">
              <div className="h-10 w-10 rounded-full bg-secondary overflow-hidden shrink-0">
                <img src={`https://i.pravatar.cc/150?u=${msg.img}`} alt={msg.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium text-foreground">{msg.name}</span>
                <span className="text-xs text-muted-foreground truncate">{msg.msg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Update News */}
      <div className="flex flex-col mt-auto">
        <h3 className="text-sm font-medium text-foreground mb-4">Update News</h3>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Guys, there's a new update..." 
            className="w-full rounded-2xl bg-secondary py-3 pl-4 pr-12 text-sm text-foreground outline-none ring-primary focus:ring-1 border border-border"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
