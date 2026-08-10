'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { sectionString } from '@/lib/section-utils';
import { useTranslation } from 'react-i18next';
import type { PageSection } from '@/types';

const missionCards = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#22C55E">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    ),
    iconBg: 'bg-green/12',
    titleKey: 'about.innovation.title1',
    descKey: 'about.innovation.desc1',
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#10B981">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </svg>
    ),
    iconBg: 'bg-[rgba(16,185,129,0.12)]',
    titleKey: 'about.innovation.title2',
    descKey: 'about.innovation.desc2',
  },
];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-green uppercase">
      {children}
    </span>
  );
}

interface AboutInnovationProps {
  section?: PageSection;
}

export function AboutInnovation({ section }: AboutInnovationProps) {
  const { t } = useTranslation();

  const content = section?.content ?? {};
  const story = (content.story ?? {}) as Record<string, string>;
  const mission = (content.mission ?? {}) as Record<string, string> & { cards?: Array<{ title: string; description: string }> };

  const badge = sectionString(section, 'badge') || t('about.innovation.heroTitle').toUpperCase();
  const title = section?.title || t('about.innovation.heroTitle');
  const titleHighlight = sectionString(section, 'titleHighlight') || '';
  const description =
    section?.description || `${t('about.story.description')} ${t('about.story.description2')}`.trim();

  const storyBadge = story.badge || t('about.story.badge');
  const storyTitle = story.title || t('about.story.title');
  const storyTitleHighlight = story.titleHighlight || t('about.story.titleHighlight');
  const missionLabel = story.missionLabel || t('about.story.missionLabel');
  const missionText = story.mission || t('about.story.mission');
  const visionLabel = story.visionLabel || t('about.story.visionLabel');
  const visionText = story.vision || t('about.story.vision');

  const missionBadge = mission.badge || t('about.story.missionLabel');
  const missionTitle = mission.title || t('about.innovation.title4');

  const cards = (mission.cards && mission.cards.length > 0 ? mission.cards : missionCards.map((c) => ({
    title: t(c.titleKey),
    description: t(c.descKey),
  })));

  return (
    <section id="innovation" className="relative py-14 sm:py-20 border-t border-border bg-bg-primary overflow-hidden">
      {/* Decorative glows */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-green/5 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 w-[560px] h-[560px] rounded-full bg-accent-teal/5 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <FadeIn className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-green uppercase mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.09 8.26L20 9.27L15.45 13.14L16.82 19.02L12 16.09L7.18 19.02L8.55 13.14L4 9.27L9.91 8.26L12 2Z" />
            </svg>
            {badge}
          </span>
          <h2 className="text-[clamp(1.7rem,3.2vw,2.4rem)] font-extrabold text-white leading-[1.15] tracking-[-0.02em]">
            {title}{' '}
            {titleHighlight && (
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">{titleHighlight}</span>
            )}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-6 lg:gap-8 items-start">
          {/* LEFT — Notre Histoire */}
          <FadeIn>
            <div className="relative h-full overflow-hidden rounded-2xl border border-border bg-bg-card p-6 sm:p-9">
              <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(34,197,94,0.1)_0%,transparent_70%)]" />

              <div className="relative">
                <div className="mb-5">
                  <Badge>{storyBadge}</Badge>
                </div>
                <h3 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold text-white leading-[1.15] tracking-[-0.02em] mb-4">
                  {storyTitle}{' '}
                  <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                    {storyTitleHighlight}
                  </span>
                </h3>
                <p className="text-[0.95rem] text-gray-400 leading-relaxed">{description}</p>

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-green/30 to-transparent" />

                <div className="space-y-4">
                  <div className="flex gap-3 items-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green/12 text-green">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.8rem] font-bold text-green uppercase tracking-wider mb-0.5">{missionLabel}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{missionText}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-blue/12 text-accent-blue">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm0-10c-4.42 0-8 3.58-8 8 0 6 8 14 8 14s8-8 8-14c0-4.42-3.58-8-8-8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[0.8rem] font-bold text-accent-blue uppercase tracking-wider mb-0.5">{visionLabel}</p>
                      <p className="text-sm text-gray-400 leading-relaxed">{visionText}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* RIGHT — Mission (Vision Solaire + Engagement Durable) */}
          <div className="flex flex-col gap-4">
            <FadeIn>
              <div className="mb-1">
                <div className="mb-3">
                  <Badge>{missionBadge}</Badge>
                </div>
                <h3 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-extrabold text-white leading-[1.15] tracking-[-0.02em]">
                  {missionTitle}
                </h3>
              </div>
            </FadeIn>

            {cards.map((card, i) => (
              <FadeIn key={card.title || i} delay={i * 120}>
                <div className="group rounded-2xl border border-border bg-bg-card p-5 transition-all duration-[0.45s] ease-premium will-change-transform hover:-translate-y-1 hover:border-green/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(34,197,94,0.12)]">
                  <div className="flex items-start gap-4">
                    <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', 'bg-green/12')}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#22C55E">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[0.95rem] font-bold text-white mb-1">{card.title}</h4>
                      <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
