'use client';

import { SITE_CONFIG } from '@/config/site';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ProjectsCTA() {
  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[28px] border border-green/15 bg-[linear-gradient(145deg,#0C1828,#081220)] p-10 sm:p-14 lg:p-16 text-center">
            <div className="pointer-events-none absolute -top-[200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(34,197,94,0.06)_0%,rgba(59,130,246,0.04)_40%,transparent_70%)] animate-[sv-glow-pulse_4s_ease-in-out_infinite]" />

            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute w-[3px] h-[3px] bg-green rounded-full left-[10%] top-[30%] animate-[sv-float-particle_6s_ease-in-out_infinite]" />
              <span className="absolute w-[2px] h-[2px] bg-accent-blue rounded-full left-[85%] top-[20%] animate-[sv-float-particle_6s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
              <span className="absolute w-[3px] h-[3px] bg-accent-orange rounded-full left-[20%] top-[70%] animate-[sv-float-particle_6s_ease-in-out_infinite]" style={{ animationDelay: '3s' }} />
              <span className="absolute w-[2px] h-[2px] bg-accent-purple rounded-full left-[75%] top-[65%] animate-[sv-float-particle_6s_ease-in-out_infinite]" style={{ animationDelay: '4.5s' }} />
            </div>

            <div className="relative z-[1]">
              <span className="inline-block text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
                Votre projet commence ici
              </span>

              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.2] mb-4">
                Confiez votre projet solaire<br />à Vicking Solar.
              </h2>

              <p className="text-base text-gray-400 max-w-[520px] mx-auto mb-10 leading-relaxed">
                Nous concevons, installons et maintenons des systèmes énergétiques fiables pour vous accompagner sur le long terme.
              </p>

              <div className="flex justify-center gap-6 flex-wrap mb-10">
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="flex items-center gap-3 bg-bg-elevated border border-border rounded-xl px-6 py-3.5 text-sm font-semibold text-gray-200 transition-all duration-350 hover:bg-green/8 hover:border-green/25 hover:text-white"
                >
                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-green/12 text-green">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </div>
                  {SITE_CONFIG.phone}
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-3 bg-bg-elevated border border-border rounded-xl px-6 py-3.5 text-sm font-semibold text-gray-200 transition-all duration-350 hover:bg-green/8 hover:border-green/25 hover:text-white"
                >
                  <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-green/12 text-green">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  {SITE_CONFIG.email}
                </a>
              </div>

              <div className="flex justify-center gap-3 flex-wrap">
                <a
                  href={SITE_CONFIG.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-3.5 text-sm font-bold text-white transition-all duration-350 hover:bg-[#1dba5a] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(37,211,102,0.3)]"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  </svg>
                  Contacter sur WhatsApp
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white/6 backdrop-blur-sm border border-white/15 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-350 hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9V3.5L18.5 9H13zM7 17l2-2 2 2 4-4 2 2v4H7v-2z" />
                  </svg>
                  Demander un devis
                </a>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
