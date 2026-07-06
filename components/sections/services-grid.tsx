'use client';

import { SERVICES } from '@/constants/services';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const colorMap: Record<string, { icon: string; tag: string; glow: string; hover: string; cta: string }> = {
  blue:   { icon: 'bg-accent-blue/15 text-accent-blue', tag: 'bg-accent-blue/12 text-accent-blue', glow: 'blue-glow', hover: 'hover:border-accent-blue/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_25px_rgba(59,130,246,0.1)]', cta: '' },
  green:  { icon: 'bg-green/15 text-green', tag: 'bg-green/12 text-green', glow: 'green-glow', hover: 'hover:border-green/40 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_25px_rgba(34,197,94,0.15)]', cta: 'text-green hover:text-[#4ade80]' },
  orange: { icon: 'bg-accent-orange/15 text-accent-orange', tag: 'bg-accent-orange/12 text-accent-orange', glow: 'orange-glow', hover: 'hover:border-accent-orange/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_25px_rgba(245,158,11,0.1)]', cta: '' },
  purple: { icon: 'bg-accent-purple/15 text-accent-purple', tag: 'bg-accent-purple/12 text-accent-purple', glow: 'purple-glow', hover: 'hover:border-accent-purple/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_25px_rgba(139,92,246,0.1)]', cta: '' },
  teal:   { icon: 'bg-accent-teal/15 text-accent-teal', tag: 'bg-accent-teal/12 text-accent-teal', glow: 'teal-glow', hover: 'hover:border-accent-teal/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_25px_rgba(20,184,166,0.1)]', cta: '' },
  amber:  { icon: 'bg-accent-amber/15 text-accent-amber', tag: 'bg-accent-amber/12 text-accent-amber', glow: 'amber-glow', hover: 'hover:border-accent-amber/35 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4),0_0_25px_rgba(251,191,36,0.1)]', cta: '' },
};

const icons: Record<string, React.ReactNode> = {
  sun: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" /></svg>,
  'file-text': <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9V3.5L18.5 9H13zM7 17l2-2 2 2 4-4 2 2v4H7v-2z" /></svg>,
  wrench: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" /></svg>,
  industrial: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7zm0-4c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z" /></svg>,
  home: <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>,
  'clipboard-list': <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9l-7-7-7 7h4v7h6V9h4zm-7 11c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zM4 19h16v2H4z" /></svg>,
};

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.45s] ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ServicesGrid() {
  const { t } = useTranslation();
  return (
    <section id="sv-services" className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
            {t('services.grid.badge')}
          </span>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-3">
            {t('services.grid.title')} <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">{t('services.grid.titleHighlight')}</span>
          </h2>
          <p className="text-base text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            {t('services.grid.description')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const c = colorMap[service.color];
            return (
              <FadeCard key={service.id} delay={i * 100}>
<article
                    id={service.id}
                    className={cn(
                      'sv-card group relative rounded-[20px] border bg-bg-card p-8 flex flex-col overflow-hidden',
                      'transition-all duration-[0.45s] ease-premium will-change-[transform,border-color,box-shadow]',
                      'hover:-translate-y-[8px] hover:scale-[1.01] hover:border-green/28 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]',
                      c.hover,
                      service.featured
                        ? 'border-green/30 bg-[linear-gradient(145deg,#0C1825,#0D1322)] hover:border-green/50 hover:shadow-[0_20px_40px_rgba(34,197,94,0.1)]'
                        : 'border-border',
                    )}
                  >
                  {/* Glow effect */}
                  <div className={cn(
                    'pointer-events-none absolute -top-[60px] -right-[60px] w-[200px] h-[200px] rounded-full opacity-0 transition-opacity duration-350 group-hover:opacity-100',
                    service.color === 'blue' && 'bg-[radial-gradient(circle,rgba(59,130,246,0.12),transparent_70%)]',
                    service.color === 'green' && 'bg-[radial-gradient(circle,rgba(34,197,94,0.12),transparent_70%)]',
                    service.color === 'orange' && 'bg-[radial-gradient(circle,rgba(245,158,11,0.12),transparent_70%)]',
                    service.color === 'purple' && 'bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_70%)]',
                    service.color === 'teal' && 'bg-[radial-gradient(circle,rgba(20,184,166,0.12),transparent_70%)]',
                    service.color === 'amber' && 'bg-[radial-gradient(circle,rgba(251,191,36,0.12),transparent_70%)]',
                  )} />

                  {/* Featured badge */}
                  {service.featured && (
                    <span className="absolute top-5 right-5 text-[0.7rem] font-bold text-green bg-green/12 border border-green/25 px-2.5 py-1 rounded-full">
                  {t('services.grid.featured')}
                    </span>
                  )}

                  {/* Card top: icon + tag */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={cn('flex h-[52px] w-[52px] items-center justify-center rounded-xl shrink-0', c.icon)}>
                      {icons[service.icon]}
                    </div>
                    <span className={cn('text-[0.68rem] font-bold tracking-[0.05em] px-2.5 py-1 rounded-full', c.tag)}>
                      {t(`servicesItems.${i}.tag`, { defaultValue: service.tag })}
                    </span>
                  </div>

                  <h3 className="text-[1.15rem] font-bold text-white mb-2">{t(`servicesItems.${i}.title`, { defaultValue: service.title })}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">{t(`servicesItems.${i}.description`, { defaultValue: service.description })}</p>

                  {/* Features */}
                  <ul className="flex flex-col gap-2 mb-6 flex-1">
                    {service.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-sm text-gray-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#22C55E" className="shrink-0">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        {t(`servicesItems.${i}.features.${fi}`, { defaultValue: f })}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="https://wa.me/243820128315"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      'inline-flex items-center gap-1.5 text-sm font-semibold text-gray-400 border-t border-border pt-4 mt-auto transition-all duration-350 hover:text-white hover:gap-[0.7rem]',
                      service.featured && 'text-green hover:text-[#4ade80]',
                    )}
                  >
                    {t('services.grid.cta')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
                    </svg>
                  </a>
                </article>
              </FadeCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
