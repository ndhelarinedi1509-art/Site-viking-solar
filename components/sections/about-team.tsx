'use client';

import { TEAM_MEMBERS } from '@/constants/team';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const accents = [
  { bg: 'bg-green/12', ring: 'ring-green/25', iconFill: 'rgba(34,197,94,0.4)' },
  { bg: 'bg-green/12', ring: 'ring-green/35', iconFill: 'rgba(34,197,94,0.4)' },
  { bg: 'bg-accent-amber/12', ring: 'ring-accent-amber/35', iconFill: 'rgba(245,158,11,0.5)' },
  { bg: 'bg-accent-purple/12', ring: 'ring-accent-purple/35', iconFill: 'rgba(139,92,246,0.5)' },
];

function TeamCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.45s] ease-premium will-change-transform',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function AboutTeam() {
  const { t } = useTranslation();
  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 max-w-[520px] mx-auto mb-3 leading-relaxed">
          {t('about.team.subtitle')}
        </p>
        <h2 className="text-[clamp(1.6rem,2.8vw,2.2rem)] font-extrabold text-white text-center tracking-[-0.02em] mb-11">
          {t('about.team.title')}
        </h2>

        <div className="grid gap-5 grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member, i) => {
            const accent = accents[i % accents.length];
            return (
              <TeamCard key={member.id} delay={i * 80}>
                <div className="group rounded-2xl border border-border bg-bg-card p-6 sm:p-7 text-center transition-all duration-[0.45s] ease-premium will-change-transform hover:-translate-y-2 hover:scale-[1.02] hover:border-green/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(34,197,94,0.12)]">
                  <div className={cn('mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ring-2', accent.bg, accent.ring)}>
                    <svg width="36" height="36" viewBox="0 0 24 24" fill={accent.iconFill}>
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{member.name}</h4>
                  <p className="text-sm font-medium text-green">{member.role}</p>
                </div>
              </TeamCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
