'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export function AboutHero() {
  const { t } = useTranslation();
  return (
    <section className="ab-hero relative flex min-h-screen items-center justify-center overflow-hidden">
      <div className="absolute inset-0 transition-transform duration-[12s] ease-out hover:scale-[1.0] group">
        <Image
          src="https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=85&auto=format&fit=crop"
          alt="Panneaux solaires"
          fill
          className="object-cover scale-105 group-hover:scale-100 transition-transform duration-[12s] ease-out"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(6,11,24,0.55)] via-[rgba(6,11,24,0.72)] to-[rgba(6,11,24,0.97)] z-[1]" />

      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pt-32 pb-16">
        <p className="mb-6 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase animate-fade-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
          {t('hero.about.badge')}
        </p>

        <h1 className="text-[clamp(2.6rem,6vw,4.2rem)] font-extrabold text-white leading-[1.1] tracking-[-0.03em] mb-6 animate-fade-up" style={{ animationDelay: '0.25s', opacity: 0 }}>
          {t('about.story.title')}<br />
          <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
            Vicking Solar
          </span>
        </h1>

        <p className="mx-auto max-w-[580px] text-[1.05rem] text-gray-400 leading-relaxed mb-12 animate-fade-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
          {t('hero.about.description')}
        </p>

        <div className="flex justify-center animate-fade-up" style={{ animationDelay: '0.6s', opacity: 0 }}>
          <svg
            className="animate-bounce h-6 w-6 text-green"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}
