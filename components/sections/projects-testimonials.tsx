'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { PageSection, CmsTestimonial } from '@/types';
import { sectionString } from '@/lib/section-utils';

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

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill={i < rating ? '#F59E0B' : 'rgba(255,255,255,0.12)'}>
          <path d="M12 2L14.09 8.26L20 9.27L15.45 13.14L16.82 19.02L12 16.09L7.18 19.02L8.55 13.14L4 9.27L9.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

interface ProjectsTestimonialsProps {
  section?: PageSection;
  testimonials?: CmsTestimonial[];
}

export function ProjectsTestimonials({ section, testimonials = [] }: ProjectsTestimonialsProps) {
  const { t } = useTranslation();

  const badge = sectionString(section, 'badge', t('projects.testimonials.badge'));
  const title = section?.title || t('projects.testimonials.title');
  const titleHighlight = sectionString(section, 'titleHighlight', t('projects.testimonials.titleHighlight'));

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeCard>
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
              {badge}
            </span>
            <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15]">
              {title}{' '}
              <span className="bg-gradient-to-r from-accent-orange to-red-500 bg-clip-text text-transparent">
                {titleHighlight}
              </span>
            </h2>
          </div>
        </FadeCard>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial, i) => (
            <FadeCard key={testimonial.id} delay={i * 150}>
              <div className="relative flex h-full flex-col rounded-[20px] border border-border bg-bg-elevated p-8 sm:p-10 transition-all duration-350 hover:-translate-y-1 hover:border-white/10">
                <span className="absolute top-6 right-8 text-[4rem] font-serif leading-none text-white/[0.06]">
                  &ldquo;
                </span>

                <Stars rating={testimonial.rating ?? 5} />

                <p className="mt-5 flex-1 text-[0.95rem] leading-relaxed text-gray-300">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                <div className="mt-8 flex items-center gap-4 border-t border-white/6 pt-6">
                  {testimonial.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-12 w-12 rounded-full object-cover border border-white/10"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/15 text-sm font-bold text-green">
                      {initials(testimonial.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white">{testimonial.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {testimonial.role}
                      {testimonial.location ? ` — ${testimonial.location}` : ''}
                    </p>
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
