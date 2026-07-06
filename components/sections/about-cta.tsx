'use client';

import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function AboutCTA() {
  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border-light bg-[linear-gradient(145deg,rgba(15,26,46,0.9),rgba(10,22,40,0.95))] p-12 sm:p-16 text-center">
            {/* Green glow */}
            <div className="pointer-events-none absolute -top-[120px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(34,197,94,0.07)_0%,transparent_70%)]" />

            <div className="relative">
              <h2 className="text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold text-white tracking-[-0.02em] mb-3">
                Passez à l&apos;énergie solaire avec Vicking Solar.
              </h2>
              <p className="text-sm text-gray-400 max-w-[520px] mx-auto mb-8 leading-relaxed">
                Rejoignez les centaines d&apos;entreprises qui font confiance à notre expertise aujourd&apos;hui et transformez votre consommation d&apos;énergie.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2.5 rounded-full bg-green px-7 py-3 text-sm font-semibold text-bg-primary transition-all duration-350 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
                >
                  Demander un devis
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <a
                  href={SITE_CONFIG.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-7 py-3 text-sm font-semibold text-white transition-all duration-350 hover:bg-[#1fba5a] hover:shadow-[0_8px_24px_rgba(37,211,102,0.3)] active:scale-[0.98]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  WhatsApp contact
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
