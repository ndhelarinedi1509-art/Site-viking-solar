'use client';

import { Reveal } from '@/components/ui/reveal';
import { useTranslation } from 'react-i18next';

const highlights = [
  'home.about.highlight1',
  'home.about.highlight2',
  'home.about.highlight3',
];

export function HomeAboutPreview() {
  const { t } = useTranslation();
  return (
    <section className="relative py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left */}
          <Reveal direction="left">
            <div>
              <span className="mb-4 inline-block rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-green uppercase">
                {t('home.about.badge')}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                {t('home.about.title')}<br />
                <span className="bg-gradient-to-r from-green to-accent-blue bg-clip-text text-transparent">
                  {t('home.about.titleHighlight')}
                </span>
              </h2>
              <p className="mt-6 text-base text-gray-400 leading-relaxed">
                {t('home.about.paragraph1')}
              </p>
              <p className="mt-4 text-base text-gray-400 leading-relaxed">
                {t('home.about.paragraph2')}
              </p>

              <ul className="mt-8 space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <svg className="h-5 w-5 shrink-0 text-green" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    <span className="text-sm font-medium text-gray-200">{t(item)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right */}
          <Reveal direction="right">
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl border border-border bg-bg-card overflow-hidden flex flex-col items-center justify-center gap-3 text-gray-600">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{t('common.photoComing')}</span>
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-green/10 pointer-events-none" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
