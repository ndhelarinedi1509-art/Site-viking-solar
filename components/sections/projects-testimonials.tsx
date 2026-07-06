'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const testimonials = [
  { id: 'test-1', lines: [{ w: 'full' }, { w: '' }, { w: 'short' }] },
  { id: 'test-2', lines: [{ w: 'full' }, { w: '' }, { w: 'medium' }] },
  { id: 'test-3', lines: [{ w: 'full' }, { w: 'full' }, { w: 'short' }] },
];

function FadeCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.6s] ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ProjectsTestimonials() {
  return (
    <section className="py-24 sm:py-28 border-t border-border bg-bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeCard>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
              Ce qu&apos;ils disent de nous
            </span>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15]">
              Avis de{' '}
              <span className="bg-gradient-to-r from-accent-orange to-red-500 bg-clip-text text-transparent">
                Nos Clients
              </span>
            </h2>
          </div>
        </FadeCard>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <FadeCard key={t.id} delay={i * 150}>
              <div className="rounded-[20px] border border-border bg-bg-elevated p-8 sm:p-10 relative transition-all duration-350 hover:-translate-y-1 hover:border-white/10">
                <span className="absolute top-6 right-8 text-[4rem] font-serif leading-none text-white/[0.03]">
                  &ldquo;
                </span>

                <div className="flex flex-col gap-3 mb-10">
                  {t.lines.map((line, j) => (
                    <div
                      key={j}
                      className={cn(
                        'h-[10px] rounded-sm bg-bg-card relative overflow-hidden',
                        line.w === 'full' ? 'w-full' : line.w === 'medium' ? 'w-[85%]' : 'w-[60%]',
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-[sv-shimmer_2s_ease-in-out_infinite]" />
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-bg-card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-[sv-shimmer_2s_ease-in-out_infinite]" />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="h-3 w-[50%] rounded-sm bg-white/[0.05] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-[sv-shimmer_2s_ease-in-out_infinite]" />
                    </div>
                    <div className="h-2 w-[35%] rounded-sm bg-green/10 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-[sv-shimmer_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </FadeCard>
          ))}
        </div>
      </div>
    </section>
  );
}
