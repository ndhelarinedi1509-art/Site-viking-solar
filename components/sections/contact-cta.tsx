'use client';

import { SITE_CONFIG } from '@/config/site';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

export function ContactCTA() {
  const { ref, isInView } = useInView();
  return (
    <section className="py-20 sm:py-24 bg-[linear-gradient(135deg,rgba(34,197,94,0.08)_0%,rgba(6,11,24,1)_100%)] border-t border-green/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div
          ref={ref}
          className={cn(
            'transition-all duration-700 ease-premium',
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <h2 className="text-[clamp(2rem,4vw,2.8rem)] font-extrabold text-white mb-8 tracking-[-0.02em]">
            Passez à l&apos;énergie solaire avec{' '}
            <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
              Vicking Solar
            </span>
            .
          </h2>

          <div className="flex justify-center gap-4 flex-col sm:flex-row items-center">
            <a
              href={SITE_CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-bold text-white transition-all duration-350 hover:bg-[#1dba5a] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,211,102,0.3)]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              </svg>
              Contact WhatsApp
            </a>
            <a
              href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-white/6 backdrop-blur-sm border border-white/20 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-350 hover:bg-white/10 hover:border-white/35 hover:-translate-y-0.5"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
              </svg>
              Appeler Maintenant
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
