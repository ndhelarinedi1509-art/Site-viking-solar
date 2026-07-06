'use client';

import { BENEFITS } from '@/constants/benefits';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const iconSvgs: Record<string, React.ReactNode> = {
  green: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  ),
  blue: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
    </svg>
  ),
  orange: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93V18c0-.55-.45-1-1-1s-1 .45-1 1v1.93C7.06 19.44 4.56 16.94 4.07 13H6c.55 0 1-.45 1-1s-.45-1-1-1H4.07C4.56 7.06 7.06 4.56 11 4.07V6c0 .55.45 1 1 1s1-.45 1-1V4.07c3.94.49 6.44 2.99 6.93 6.93H18c-.55 0-1 .45-1 1s.45 1 1 1h1.93c-.49 3.94-2.99 6.44-6.93 6.93z" />
    </svg>
  ),
  teal: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5l5-3-1.22-1.22C19.91 16.26 22 13.26 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 1.26 2.09 4.26 5.22 5.78L6 19l5 3v-5l-2.28 2.28C6.81 18 5 15.21 5 12c0-4.08 3.05-7.44 7-7.93V2.05z" />
    </svg>
  ),
  purple: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z" />
    </svg>
  ),
  amber: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.83-2.6 7.42-6 8.77-3.4-1.35-6-4.94-6-8.77V7.67L12 5z" />
    </svg>
  ),
};

const wrapColors: Record<string, string> = {
  green: 'bg-green/12 text-green',
  blue: 'bg-accent-blue/12 text-accent-blue',
  orange: 'bg-accent-orange/12 text-accent-orange',
  teal: 'bg-accent-teal/12 text-accent-teal',
  purple: 'bg-accent-purple/12 text-accent-purple',
  amber: 'bg-accent-amber/12 text-accent-amber',
};

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.5s] ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[22px]',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ServicesBenefits() {
  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
            Pourquoi nous choisir
          </span>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-3">
            Les <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">Avantages</span> Vicking Solar
          </h2>
          <p className="text-base text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            Choisir Vicking Solar, c&apos;est opter pour une expertise locale, une technologie de pointe et un accompagnement humain de qualité.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((ben, i) => (
            <FadeCard key={ben.id} delay={i * 80}>
              <div className="group flex items-start gap-5 rounded-2xl border border-border bg-bg-card p-7 transition-all duration-350 hover:-translate-y-[5px] hover:border-white/10 hover:shadow-[0_14px_42px_rgba(0,0,0,0.28)]">
                <div className={cn('flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-xl', wrapColors[ben.iconColor])}>
                  {iconSvgs[ben.iconColor]}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white mb-1.5">{ben.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{ben.description}</p>
                </div>
              </div>
            </FadeCard>
          ))}
        </div>
      </div>
    </section>
  );
}
