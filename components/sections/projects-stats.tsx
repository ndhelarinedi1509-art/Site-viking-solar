'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const stats = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7z" />
      </svg>
    ),
    value: 800,
    suffix: '+',
    labelKey: 'stats.installations',
    color: 'text-green',
    glow: 'bg-green/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
    value: 1500,
    suffix: '+',
    labelKey: 'stats.clientsSatisfied',
    color: 'text-accent-blue',
    glow: 'bg-accent-blue/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
      </svg>
    ),
    value: 2497,
    suffix: ' kW',
    labelKey: 'stats.powerInstalled',
    color: 'text-accent-orange',
    glow: 'bg-accent-orange/20',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7z" />
      </svg>
    ),
    value: 3200,
    suffix: '+',
    labelKey: 'stats.panelsInstalled',
    color: 'text-accent-purple',
    glow: 'bg-accent-purple/20',
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
        'flex flex-col items-center gap-3 py-6 text-center transition-all duration-[0.5s] ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      )}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className={cn('relative flex h-11 w-11 items-center justify-center rounded-full', stat.glow)}>
        <div className={cn(stat.color)}>{stat.icon}</div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[1.6rem] font-extrabold text-white leading-none">
          <span ref={ref}>0</span>
          <sup className="text-[0.8rem] font-bold text-green ml-0.5 align-super">{stat.suffix}</sup>
        </span>
        <span className="text-[0.65rem] text-gray-500 uppercase tracking-[0.08em] mt-1">{t(stat.labelKey)}</span>
      </div>
    </div>
  );
}

export function ProjectsStats() {
  return (
    <section id="stats" className="py-10 bg-bg-primary relative z-[5]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.labelKey} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
