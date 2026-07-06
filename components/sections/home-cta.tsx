'use client';

import { SITE_CONFIG } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import { useTranslation } from 'react-i18next';

export function HomeCTA() {
  const { t } = useTranslation();
  return (
    <section id="contact" className="relative py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-border-light bg-gradient-to-br from-[#0F1A2E] to-[#0A1628] p-10 sm:p-14 lg:p-16 text-center">
            {/* Glow */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-green/5 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-xl">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">{t('home.cta.title')}</h2>
              <p className="mt-4 text-base text-gray-400">{t('home.cta.description')}</p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12">
                <div className="text-center">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{t('common.phone')}</span>
                  <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className="text-sm font-semibold text-white hover:text-green transition-colors">
                    {SITE_CONFIG.phone}
                  </a>
                </div>
                <div className="text-center">
                  <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">{t('common.email')}</span>
                  <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm font-semibold text-white hover:text-green transition-colors">
                    {SITE_CONFIG.email}
                  </a>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={SITE_CONFIG.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] active:scale-[0.98]"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  {t('common.whatsapp')}
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
