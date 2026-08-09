'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { PageSection } from '@/types';
import { sectionString, sectionButtons, sectionStats, sectionImage } from '@/lib/section-utils';

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
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
      <div className="mt-1 text-xs sm:text-sm text-gray-300">{label}</div>
    </div>
  );
}

interface HomeHeroProps {
  section?: PageSection;
}

export function HomeHero({ section }: HomeHeroProps) {
  const { t } = useTranslation();

  const badge = sectionString(section, 'badge', t('hero.home.badge'));
  const title = section?.title || sectionString(section, 'title', "L'énergie de demain, disponible");
  const titleHighlight = sectionString(section, 'titleHighlight', 'aujourd\'hui');
  const description = section?.description || t('hero.home.description');
  const buttons = sectionButtons(section);
  const stats = sectionStats(section);
  const bgImage = sectionImage(section);

  const primaryBtn = buttons.find((b) => b.variant === 'primary');
  const secondaryBtn = buttons.find((b) => b.variant !== 'primary');

  const statItems =
    stats.length > 0
      ? stats
      : [
          { value: 150, suffix: '+', label: t('stats.projectsCompleted') },
          { value: 5, suffix: '', label: t('stats.yearsExperience') },
          { value: 24, suffix: '/7', label: t('common.support') },
        ];

  return (
    <section className="relative w-screen left-1/2 -translate-x-1/2 min-h-[calc(100vh-5rem)] flex items-center overflow-hidden">
      {/* Background image — full bleed, reaches the screen corners */}
      {bgImage?.url ? (
        <Image
          src={bgImage.url}
          alt={bgImage.alt || 'Installation solaire Viking Solar'}
          fill
          priority
          className="object-cover object-center"
        />
      ) : (
        <Image
          src="/page%20d%27accuiel.jpg"
          alt="Installation solaire Viking Solar"
          fill
          priority
          className="object-cover object-center"
        />
      )}

      {/* Dark overlay — no blur, strong vignette ensures text readability on the bright image */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/90 via-bg-primary/65 to-bg-primary/45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_48%,rgba(6,11,24,0.35)_0%,rgba(6,11,24,0.6)_60%,rgba(6,11,24,0.75)_100%)]" />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-green/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-8 lg:px-10 py-16 sm:py-20 text-center">
        <div className="animate-fade-up mb-6" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-green px-4 py-1.5 text-xs font-bold tracking-wider text-bg-primary uppercase shadow-lg shadow-green/30">
            {badge}
          </span>
        </div>

        <h1 className="animate-fade-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.12] tracking-tight mb-5" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
          {title}{' '}
          <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent italic">
            {titleHighlight}
          </span>
        </h1>

        <p className="animate-fade-up text-base sm:text-lg text-gray-200 max-w-[580px] mx-auto leading-relaxed mb-8" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
          {description}
        </p>

        <div className="animate-fade-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-10" style={{ animationDelay: '0.55s', animationFillMode: 'both' }}>
          {primaryBtn && (
            <Link
              href={primaryBtn.href}
              className="inline-flex items-center gap-2 rounded-full bg-green px-7 py-3 text-sm font-semibold text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
            >
              {primaryBtn.label}
            </Link>
          )}
          {secondaryBtn && (
            <Link
              href={secondaryBtn.href}
              className="inline-flex items-center gap-2 rounded-full border border-border-light bg-bg-primary/40 px-7 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-green/40 hover:bg-green/5"
            >
              {secondaryBtn.label}
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </Link>
          )}
          {!primaryBtn && (
            <Link
              href="/about#contact"
              className="inline-flex items-center gap-2 rounded-full bg-green px-7 py-3 text-sm font-semibold text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
            >
              {t('common.getQuote')}
            </Link>
          )}
        </div>

        <div className="animate-fade-up border-t border-border pt-6" style={{ animationDelay: '0.7s', animationFillMode: 'both' }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
            {statItems.map((stat, i) => (
              <div key={i} className="flex items-center sm:gap-12">
                <StatItem value={stat.value} suffix={stat.suffix} label={stat.label} />
                {i < statItems.length - 1 && <div className="hidden sm:block w-px h-12 mx-12 bg-border-light" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
