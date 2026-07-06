'use client';

import { useState } from 'react';
import { PROJECTS, PROJECT_FILTERS, CATEGORY_LABELS } from '@/constants/projects';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const categoryBg: Record<string, string> = {
  residentiel: 'bg-green/75',
  industriel: 'bg-accent-blue/75',
  commercial: 'bg-accent-orange/75',
  institutionnel: 'bg-accent-purple/75',
};

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

export function ProjectsGallery() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = PROJECTS.filter((project) => {
    if (activeFilter === 'all') return true;
    return (
      project.category === activeFilter ||
      project.tags.some((tag) => tag.toLowerCase() === activeFilter)
    );
  });

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeCard>
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {PROJECT_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  'rounded-full px-5 py-2.5 text-[0.85rem] font-semibold transition-all duration-350',
                  activeFilter === filter.value
                    ? 'bg-green text-bg-primary shadow-[0_4px_15px_rgba(34,197,94,0.3)]'
                    : 'border border-border bg-bg-card text-gray-400 hover:bg-bg-elevated hover:text-white hover:border-white/10',
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </FadeCard>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <FadeCard key={project.id} delay={i * 80}>
              <article
                id={project.id}
                className="group rounded-[20px] border border-border bg-bg-card overflow-hidden flex flex-col transition-all duration-[0.45s] ease-premium hover:-translate-y-2 hover:border-white/15 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
              >
                <div className="relative h-60 overflow-hidden bg-bg-elevated">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0A1020] to-[#0F1A2E]">
                    <div className="flex h-full items-center justify-center">
                      <div className="flex flex-col items-center gap-2 z-[1]">
                        <svg
                          width="42"
                          height="42"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-gray-600 animate-[pj-icon-pulse_4s_ease-in-out_infinite]"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                        </svg>
                        <p className="text-[0.85rem] font-semibold text-gray-500">Image à venir</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-[sv-shimmer_3s_ease-in-out_infinite]" />
                  </div>

                  <span
                    className={cn(
                      'absolute top-3 left-3 z-[2] text-[0.7rem] font-bold text-white uppercase tracking-[0.05em] px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.3)] backdrop-blur-sm',
                      categoryBg[project.category] || 'bg-green/75',
                    )}
                  >
                    {CATEGORY_LABELS[project.category] || project.category}
                  </span>
                </div>

                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-1.5 mb-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#22C55E">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className="text-[0.75rem] font-semibold text-gray-500">{project.location}</span>
                  </div>

                  <h3 className="text-[1.15rem] font-bold text-white leading-tight mb-3 transition-colors group-hover:text-green">
                    {project.title}
                  </h3>

                  <p className="text-[0.85rem] text-gray-400 leading-relaxed mb-6 flex-1">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 border-t border-border pt-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.7rem] font-semibold text-gray-300 bg-bg-primary border border-border px-2.5 py-1 rounded-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </FadeCard>
          ))}
        </div>
      </div>
    </section>
  );
}
