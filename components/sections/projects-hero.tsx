'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export function ProjectsHero() {
  const { t } = useTranslation();
  return (
    <section className="pj-hero relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1920&q=85&auto=format&fit=crop"
          alt="Installations solaires"
          fill
          className="object-cover object-[center_40%] scale-105 animate-[sv-ken-burns_20s_ease-in-out_infinite_alternate]"
          priority
        />
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[rgba(6,11,24,0.92)] via-[rgba(6,11,24,0.65)] to-[rgba(6,11,24,0.4)]" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(6,11,24,0.4)] via-transparent to-[rgba(6,11,24,0.95)]" />

      <div className="absolute inset-0 z-[1] pointer-events-none">
        <span className="absolute w-[4px] h-[4px] rounded-full bg-green left-[20%] top-[35%] animate-[sv-float-particle_7s_ease-in-out_infinite]" />
        <span className="absolute w-[2px] h-[2px] rounded-full bg-accent-blue left-[80%] top-[50%] animate-[sv-float-particle_7s_ease-in-out_infinite]" style={{ animationDelay: '1.2s' }} />
        <span className="absolute w-[3px] h-[3px] rounded-full bg-accent-orange left-[50%] top-[75%] animate-[sv-float-particle_7s_ease-in-out_infinite]" style={{ animationDelay: '2.5s' }} />
        <span className="absolute w-[2px] h-[2px] rounded-full bg-accent-teal left-[30%] top-[15%] animate-[sv-float-particle_7s_ease-in-out_infinite]" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-40 pb-20 max-w-[680px]">
        <div className="animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-green/30 bg-green/12 text-green text-[0.7rem] font-bold tracking-[0.1em] px-4 py-1.5 mb-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#22C55E">
              <path d="M12 2L14.09 8.26L20 9.27L15.45 13.14L16.82 19.02L12 16.09L7.18 19.02L8.55 13.14L4 9.27L9.91 8.26L12 2Z" />
            </svg>
            {t('hero.projects.badge')}
          </span>
        </div>

        <h1 className="animate-fade-up text-[clamp(3rem,7vw,5.2rem)] font-black text-white leading-[1.05] tracking-[-0.04em] mb-6" style={{ animationDelay: '0.25s', opacity: 0 }}>
          {t('hero.projects.title')}{' '}
          <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">{t('hero.projects.titleHighlight')}</span>
        </h1>

        <p className="animate-fade-up text-[1.1rem] text-gray-300 leading-relaxed" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {t('hero.projects.description')}
        </p>
      </div>

      <div className="animate-fade-up absolute bottom-8 left-1/2 -translate-x-1/2 z-[2]" style={{ animationDelay: '0.8s', opacity: 0 }}>
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-green animate-[sv-scroll-pulse_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}
