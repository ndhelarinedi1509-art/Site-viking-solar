'use client';

import { useTranslation } from 'react-i18next';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

export function ActualitesHero() {
  const { t } = useTranslation();
  const { ref, isInView } = useInView();

  return (
    <section className="relative pt-36 pb-20 sm:pt-44 sm:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,197,94,0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div ref={ref} className={cn('transition-all duration-700 ease-premium', isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-5">
            {t('actualites.hero.badge')}
          </span>
          <h1 className="text-[clamp(2.2rem,4.5vw,3.5rem)] font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-4">
            {t('actualites.hero.title')}{' '}
            <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">{t('actualites.hero.titleHighlight')}</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-[600px] mx-auto leading-relaxed">
            {t('actualites.hero.description')}
          </p>
        </div>
      </div>
    </section>
  );
}
