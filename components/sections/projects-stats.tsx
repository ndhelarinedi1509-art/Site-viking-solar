'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const stats = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7z" />
      </svg>
    ),
    value: 800,
    suffix: '+',
    labelKey: 'stats.installations',
    colors: {
      bg: 'bg-green/15',
      text: 'text-green',
      shadow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
    },
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    value: 1500,
    suffix: '+',
    labelKey: 'stats.clientsSatisfied',
    colors: {
      bg: 'bg-accent-blue/15',
      text: 'text-accent-blue',
      shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    },
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
      </svg>
    ),
    value: 2497,
    suffix: ' kW',
    labelKey: 'stats.powerInstalled',
    colors: {
      bg: 'bg-accent-orange/15',
      text: 'text-accent-orange',
      shadow: 'shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    },
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7z" />
      </svg>
    ),
    value: 3200,
    suffix: '+',
    labelKey: 'stats.panelsInstalled',
    colors: {
      bg: 'bg-accent-purple/15',
      text: 'text-accent-purple',
      shadow: 'shadow-[0_0_30px_rgba(139,92,246,0.15)]',
    },
  },
];

function StatCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const { t } = useTranslation();
  const { ref } = useCountUp(stat.value);
  const { ref: cardRef, isInView } = useInView();

  return (
    <div
      ref={cardRef}
      className={cn(
        'flex items-center gap-5 rounded-[20px] border border-border bg-bg-card p-6 sm:p-8 transition-all duration-[0.5s] ease-premium hover:-translate-y-1 hover:border-white/10 hover:shadow-[0_12px_30px_rgba(0,0,0,0.25)]',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={cn('flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-xl border', stat.colors.bg, stat.colors.text)}>
        {stat.icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[2rem] font-extrabold text-white leading-none">
          <span ref={ref}>0</span>
          <sup className="text-[1.2rem] font-bold text-green ml-0.5 align-super">{stat.suffix}</sup>
        </span>
        <span className="text-[0.8rem] text-gray-500 uppercase tracking-[0.05em] mt-1.5">{t(stat.labelKey)}</span>
      </div>
    </div>
  );
}

export function ProjectsStats() {
  return (
    <section id="stats" className="py-16 border-t border-border bg-bg-card relative z-[5]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.labelKey} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
