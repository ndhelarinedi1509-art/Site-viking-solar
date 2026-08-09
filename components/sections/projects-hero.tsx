'use client';

import { useTranslation } from 'react-i18next';

export function ProjectsHero() {
  const { t } = useTranslation();
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[55vh] flex items-center justify-center overflow-hidden bg-bg-primary">
      {/* Decorative glows — full-bleed left to right */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-green/5 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-accent-blue/5 blur-[150px]" />

      <div className="relative z-10 w-full max-w-3xl px-6 sm:px-8 lg:px-10 py-16 sm:py-20 text-center">
        <div className="animate-fade-up mb-6 mt-6 sm:mt-8" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-green uppercase">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22C55E">
              <path d="M12 2L14.09 8.26L20 9.27L15.45 13.14L16.82 19.02L12 16.09L7.18 19.02L8.55 13.14L4 9.27L9.91 8.26L12 2Z" />
            </svg>
            {t('hero.projects.badge')}
          </span>
        </div>

        <h1 className="animate-fade-up text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold text-white leading-[1.1] tracking-tight mb-4" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          {t('hero.projects.title')}{' '}
          <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
            {t('hero.projects.titleHighlight')}
          </span>
        </h1>

        <p className="animate-fade-up text-lg text-gray-400 leading-relaxed mb-8 mx-auto max-w-[560px]" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {t('hero.projects.description')}
        </p>

        <a
          href="#pj-projects"
          className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-green px-7 py-3 text-sm font-semibold text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
          style={{ animationDelay: '0.55s', animationFillMode: 'both' }}
        >
          {t('hero.projects.cta1')}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
          </svg>
        </a>
      </div>
    </section>
  );
}
