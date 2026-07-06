'use client';

import Image from 'next/image';
import { SITE_CONFIG } from '@/config/site';
import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const stats = [
  { value: 800, suffix: '+', labelKey: 'stats.installations' },
  { value: 2497, suffix: ' kW', labelKey: 'stats.powerInstalled' },
  { value: 5, suffix: '+', labelKey: 'stats.yearsExperience' },
];

function AnimatedStat({ value, suffix, labelKey }: { value: number; suffix: string; labelKey: string }) {
  const { t } = useTranslation();
  const { ref } = useCountUp(value);
  return (
    <div className="text-left">
      <span className="block text-[1.6rem] font-extrabold text-white leading-none mb-1">
        <span ref={ref}>0</span>
        <sup className="text-[0.75rem] text-green font-bold align-super">{suffix}</sup>
      </span>
      <span className="block text-[0.72rem] text-gray-500 tracking-[0.04em]">{t(labelKey)}</span>
    </div>
  );
}

export function ServicesHero() {
  const { t } = useTranslation();
  return (
    <section className="sv-hero relative flex min-h-[90vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=85&auto=format&fit=crop"
          alt="Panneaux solaires"
          fill
          className="object-cover object-[center_30%] scale-105 animate-[sv-ken-burns_18s_ease-in-out_infinite_alternate]"
          priority
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(6,11,24,0.88)] via-[rgba(6,11,24,0.55)] to-[rgba(6,11,24,0.4)]" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(6,11,24,0.4)] via-transparent to-[rgba(6,11,24,0.95)]" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        {['left-[15%] top-[25%] w-[3px] h-[3px] bg-green', 'left-[75%] top-[45%] w-[2px] h-[2px] bg-accent-blue', 'left-[45%] top-[70%] w-[4px] h-[4px] bg-accent-orange', 'left-[85%] top-[20%] w-[2px] h-[2px] bg-green', 'left-[25%] top-[80%] w-[3px] h-[3px] bg-accent-teal', 'left-[60%] top-[15%] w-[2px] h-[2px] bg-accent-purple'].map((pos, i) => (
          <span
            key={i}
            className={`absolute rounded-full opacity-0 animate-[sv-float-particle_8s_ease-in-out_infinite] ${pos}`}
            style={{ animationDelay: `${i * (i % 2 === 0 ? 1.5 : 1.2)}s` }}
          />
        ))}
      </div>

      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40 pb-20 max-w-[720px]">
        <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-green/12 border border-green/30 text-green text-[0.7rem] font-bold tracking-[0.1em] px-4 py-1.5 mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22C55E">
              <path d="M12 2L14.09 8.26L20 9.27L15.45 13.14L16.82 19.02L12 16.09L7.18 19.02L8.55 13.14L4 9.27L9.91 8.26L12 2Z" />
            </svg>
            {t('hero.services.badge')}
          </span>
        </div>

        <h1 className="animate-fade-up text-[clamp(3rem,7vw,5.2rem)] font-black text-white leading-[1.05] tracking-[-0.04em] mb-6" style={{ animationDelay: '0.25s', opacity: 0 }}>
          {t('hero.services.title')}{' '}
          <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">{t('hero.services.titleHighlight')}</span>
        </h1>

        <p className="animate-fade-up text-[1.1rem] text-gray-300 leading-relaxed mb-10" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {t('hero.services.description')}
        </p>

        <div className="animate-fade-up flex flex-wrap gap-4 mb-12" style={{ animationDelay: '0.55s', opacity: 0 }}>
          <a
            href="#sv-services"
            className="inline-flex items-center gap-2 rounded-full bg-green px-7 py-3 text-[0.95rem] font-semibold text-bg-primary transition-all duration-350 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
          >
            {t('hero.services.cta1')}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
            </svg>
          </a>
          <a
            href={SITE_CONFIG.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white/8 backdrop-blur-sm text-white text-[0.95rem] font-semibold px-7 py-3 border border-white/15 transition-all duration-350 hover:bg-white/14 hover:border-white/30 active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            {t('hero.services.cta2')}
          </a>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up flex items-center gap-10" style={{ animationDelay: '0.7s', opacity: 0 }}>
          {stats.map((stat, i) => (
            <div key={stat.labelKey} className="flex items-center gap-10">
              <AnimatedStat value={stat.value} suffix={stat.suffix} labelKey={stat.labelKey} />
              {i < stats.length - 1 && (
                <div className="w-px h-10 bg-white/12" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll line */}
      <div className="animate-fade-up absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] flex flex-col items-center gap-1" style={{ animationDelay: '1s', opacity: 0 }}>
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-green animate-[sv-scroll-pulse_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
