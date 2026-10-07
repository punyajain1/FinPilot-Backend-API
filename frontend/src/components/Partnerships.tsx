import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

const partners = [
  {
    name: 'Bowl Club',
    partners: '1 partner',
    link: 'beacon/partnerships',
    since: 'Since 2024',
    avatar: 'B',
    color: 'bg-orange-500/20 text-orange-500',
  },
  {
    name: 'Edward S.',
    partners: '2 partner',
    link: 'beacon/partnerships',
    since: 'Since 2019',
    avatar: 'E',
    color: 'bg-blue-500/20 text-blue-500',
  },
];

export function Partnerships({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col rounded-3xl bg-card p-6 border border-border shadow-sm', className)}>
      <h2 className="text-lg font-medium text-foreground mb-6">Current Partnerships</h2>
      
      <div className="flex flex-col gap-4">
        {partners.map((partner, i) => (
          <div key={i} className="flex items-center justify-between rounded-2xl bg-secondary/50 p-4 transition-colors hover:bg-secondary">
            <div className="flex items-center gap-4">
              <div className={cn('flex h-12 w-12 items-center justify-center rounded-full font-bold', partner.color)}>
                {partner.avatar}
              </div>
              <div>
                <h4 className="font-medium text-foreground">{partner.name}</h4>
                <p className="text-sm text-muted-foreground">{partner.partners}</p>
              </div>
            </div>
            
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">Read more on the website</p>
              <a href="#" className="flex items-center gap-1 text-sm text-primary hover:underline mt-0.5">
                <ExternalLink size={14} />
                <span>{partner.link}</span>
              </a>
            </div>
            
            <div className="rounded-full bg-background/50 px-4 py-1.5 border border-border text-sm text-muted-foreground">
              {partner.since}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
