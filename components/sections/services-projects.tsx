'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { CmsProject, PageSection } from '@/types';
import { sectionString, sectionButton } from '@/lib/section-utils';

const tagColors: Record<string, string> = {
  industriel: 'text-green bg-green/10 border-green/20',
  residentiel: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20',
  commercial: 'text-accent-orange bg-accent-orange/10 border-accent-orange/20',
  institutionnel: 'text-accent-purple bg-accent-purple/10 border-accent-purple/20',
  hybride: 'text-accent-teal bg-accent-teal/10 border-accent-teal/20',
};

const icons: Record<string, React.ReactNode> = {
  industriel: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(34,197,94,0.3)">
      <path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
    </svg>
  ),
  residentiel: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(59,130,246,0.3)">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  ),
  commercial: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(245,158,11,0.3)">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7zm0-4c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z" />
    </svg>
  ),
  institutionnel: (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="rgba(139,92,246,0.3)">
      <path d="M12 2C6.48 2 2 6.48 2 12s2.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  ),
};

function ProjCard({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.5s] ease-out',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[22px]',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface ServicesProjectsProps {
  section?: PageSection;
  projects?: CmsProject[];
}

export function ServicesProjects({ section, projects = [] }: ServicesProjectsProps) {
  const { t } = useTranslation();

  const badge = sectionString(section, 'badge', t('services.projects.badge'));
  const title = section?.title || t('services.projects.title');
  const titleHighlight = sectionString(section, 'titleHighlight', t('services.projects.titleHighlight'));
  const description = section?.description || t('services.projects.description');
  const button = sectionButton(section);

  const previewProjects = [...projects]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
            {badge}
          </span>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-3">
            {title} <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">{titleHighlight}</span>
          </h2>
          <p className="text-base text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="-mx-4 sm:-mx-6 lg:-mx-8 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          <div className="flex gap-5 px-4 sm:px-6 lg:px-8 min-w-max">
            {previewProjects.map((project, i) => (
              <ProjCard
                key={project.id}
                delay={i * 100}
                className="snap-start shrink-0 w-[300px] sm:w-[340px]"
              >
                <div className={cn(
                  'group flex flex-col overflow-hidden rounded-[20px] border border-border bg-bg-elevated transition-all duration-350 h-full',
                  'hover:-translate-y-1.5 hover:border-white/10 hover:shadow-[0_16px_48px_rgba(0,0,0,0.32)]',
                )}>
                  {/* Image ou placeholder */}
                  <div className={cn(
                    'relative flex items-center justify-center overflow-hidden',
                    'bg-[linear-gradient(145deg,#0A1020,#0E1828)]',
                    'h-[200px] aspect-[4/3] w-full',
                  )}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="relative z-[1] text-center flex flex-col items-center gap-2">
                        <div className="animate-[sv-icon-pulse_3s_ease-in-out_infinite]">
                          {icons[project.category] || icons.industriel}
                        </div>
                        <p className="text-sm font-semibold text-gray-600">{t('common.photoComing')}</p>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 flex flex-col flex-1">
                    <span className={cn(
                      'inline-block text-[0.68rem] font-bold tracking-[0.06em] px-2.5 py-1 rounded-full border mb-3 self-start',
                      tagColors[project.category] || tagColors.industriel,
                    )}>
                      {t(`projects.gallery.filters.${project.category}`, { defaultValue: project.category })}
                    </span>
                    <h3 className="text-[1rem] font-bold text-white mb-2 leading-tight">{project.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-3 flex-1">{project.description}</p>
                    <div className="flex gap-4 flex-wrap text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
                        </svg>
                        {project.power}
                      </span>
                    </div>
                  </div>
                </div>
              </ProjCard>
            ))}
          </div>
        </div>

        {button && (
          <div className="mt-12 text-center">
            <a
              href={button.href}
              className="group inline-flex items-center gap-2 rounded-full border border-border-light bg-transparent px-6 py-2.5 text-sm font-semibold text-green transition-all duration-300 hover:border-green/40 hover:bg-green/5"
            >
              {button.label}
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
