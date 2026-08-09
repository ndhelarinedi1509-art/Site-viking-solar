'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const stats = [
  { value: 150, suffix: '+', labelKey: 'stats.projectsCompleted' },
  { value: 5, suffix: '', labelKey: 'stats.yearsExperience' },
  { value: 24, suffix: '/7', labelKey: 'common.support' },
];

function StatItem({ value, suffix, labelKey }: { value: number; suffix: string; labelKey: string }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        let current = 0;
        const step = Math.max(1, Math.ceil(value / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= value) {
            current = value;
            clearInterval(timer);
          }
          el.textContent = String(current);
        }, 25);
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-extrabold text-white">
        <span ref={ref}>0</span>{suffix}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-gray-500">{t(labelKey)}</div>
    </div>
  );
}

export function HomeHero() {
  const { t } = useTranslation();
  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Background image — full bleed, reaches the screen corners */}
      <Image
        src="/page%20d%27accuiel.jpg"
        alt="Installation solaire Viking Solar"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Blur + dark overlay ensures text readability on any image brightness */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg-primary/70 via-bg-primary/45 to-bg-primary/30"
        style={{ backdropFilter: 'blur(4px)' }}
      />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:px-10 py-16 sm:py-20 text-center">
        <div className="animate-fade-up mb-6" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-green uppercase">
            {t('hero.home.badge')}
          </span>
        </div>

        <h1 className="animate-fade-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-5" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          L&apos;énergie de demain,<br />
          disponible{' '}
          <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent italic">
            aujourd&apos;hui
          </span>
        </h1>

        <p className="animate-fade-up text-base sm:text-lg text-gray-300 max-w-[580px] mx-auto leading-relaxed mb-8" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {t('hero.home.description')}
        </p>

        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" style={{ animationDelay: '0.55s', animationFillMode: 'both' }}>
          <Link
            href="/about#contact"
            className="inline-flex items-center gap-2 rounded-full bg-green px-7 py-3 text-sm font-semibold text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
          >
            Demander un devis
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-primary/40 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-green/40 hover:bg-green/5"
          >
            {t('common.explore')}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </Link>
        </div>

        <div className="animate-fade-up border-t border-border pt-6" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
            {stats.map((stat, i) => (
              <div key={stat.labelKey} className="flex items-center sm:gap-12">
                <StatItem value={stat.value} suffix={stat.suffix} labelKey={stat.labelKey} />
                {i < stats.length - 1 && <div className="hidden sm:block w-px h-12 mx-12 bg-border-light" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
