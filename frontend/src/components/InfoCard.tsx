import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  features: string[];
  className?: string;
}

export function InfoCard({ title, icon, features, className }: InfoCardProps) {
  return (
    <div className={cn('flex flex-col rounded-3xl bg-card p-6 border border-border shadow-sm', className)}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary">
          {icon}
        </div>
        <h3 className="text-base font-medium text-foreground">{title}</h3>
      </div>
      
      <ul className="flex flex-col gap-3 mt-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
