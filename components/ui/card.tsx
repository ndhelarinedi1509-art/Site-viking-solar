import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/6 bg-bg-card p-6 transition-all duration-350',
        hover && 'hover:bg-bg-card-hover hover:border-white/10 hover:shadow-card-hover',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'glass rounded-2xl border border-white/6 bg-white/3 backdrop-blur-xl p-6',
        className,
      )}
    >
      {children}
    </div>
  );
}
