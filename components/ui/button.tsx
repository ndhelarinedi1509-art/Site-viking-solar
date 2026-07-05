import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          variant === 'primary' &&
            'bg-green text-white hover:bg-green-dark hover:shadow-glow active:scale-[0.98]',
          variant === 'outline' &&
            'border border-green/30 text-green hover:bg-green/10 hover:border-green/50 active:scale-[0.98]',
          variant === 'ghost' &&
            'text-gray-300 hover:text-white hover:bg-white/5',
          variant === 'danger' &&
            'bg-accent-red/10 text-accent-red border border-accent-red/20 hover:bg-accent-red/20',
          size === 'sm' && 'h-8 px-3 text-xs',
          size === 'md' && 'h-10 px-5 text-sm',
          size === 'lg' && 'h-12 px-7 text-base',
          className,
        )}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
