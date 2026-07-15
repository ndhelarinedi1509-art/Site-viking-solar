'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export function ContactMap() {
  const { t } = useTranslation();
  const { ref, isInView } = useInView();

  return (
    <section className="pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={cn(
            'overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-700 ease-premium',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div className="p-5 sm:p-6 border-b border-border">
            <h3 className="text-lg font-bold text-white">{t('contact.map.title')}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{t('contact.map.subtitle')}</p>
          </div>
          <div className="relative w-full" style={{ height: 'clamp(300px, 50vw, 450px)' }}>
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=15.19%2C-4.38%2C15.45%2C-4.27&amp;layer=mapnik&amp;marker=-4.325%2C15.322"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title={t('contact.map.title')}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
          <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-white/2">
            <a
              href="https://www.openstreetmap.org/?mlat=-4.325&mlon=15.322#map=14/-4.325/15.322"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-green hover:text-green-dark transition-colors"
            >
              {t('contact.map.openLarger')}
            </a>
            <span className="text-[0.65rem] text-gray-600">
              &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">OpenStreetMap</a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
