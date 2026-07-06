'use client';

import Image from 'next/image';
import { useTranslation } from 'react-i18next';

export function ContactHero() {
  const { t } = useTranslation();
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden pt-32 pb-16">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=85&auto=format&fit=crop"
          alt="Contact Viking Solar"
          fill
          className="object-cover object-center"
          priority
        />
      </div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[rgba(6,11,24,0.7)] to-[rgba(6,11,24,0.95)]" />

      <div className="relative z-[2] mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 max-w-[800px] text-center">
        <span className="inline-block rounded-full border border-green/40 bg-green/20 text-green text-[0.8rem] font-semibold tracking-[0.05em] uppercase px-5 py-1.5 mb-6 animate-fade-up" style={{ opacity: 0, animationDelay: '0.1s' }}>
          {t('hero.contact.badge')}
        </span>

        <h1 className="text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold text-white tracking-[-0.02em] mb-4 animate-fade-up" style={{ opacity: 0, animationDelay: '0.25s' }}>
          {t('hero.contact.title')}{' '}
          <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
            {t('hero.contact.titleHighlight')}
          </span>
        </h1>

        <p className="text-[1.15rem] text-gray-300 leading-relaxed animate-fade-up" style={{ opacity: 0, animationDelay: '0.4s' }}>
          {t('hero.contact.description')}
        </p>
      </div>
    </section>
  );
}
