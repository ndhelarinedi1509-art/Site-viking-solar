'use client';

import Link from 'next/link';
import { PROJECTS } from '@/constants/projects';
import { Reveal } from '@/components/ui/reveal';

export function HomeProjectsPreview() {
  const previewProjects = PROJECTS.slice(0, 4);

  return (
    <section className="relative py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Réalisations Récentes</h2>
              <p className="mt-2 text-base text-gray-400">Découvrez nos dernières installations solaires et projets réalisés au Congo.</p>
            </div>
            <Link
              href="/projects"
              className="group hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-green transition-all duration-300 hover:gap-2"
            >
              Voir tous les projets
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </Link>
          </div>
        </Reveal>

        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {previewProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 80}>
              <div className="group min-w-[280px] sm:min-w-0 overflow-hidden rounded-2xl border border-border bg-bg-card transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:border-green/25 hover:shadow-card-hover">
                <div className="relative h-44 flex items-center justify-center bg-bg-elevated overflow-hidden">
                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <svg className="h-10 w-10 transition-all duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-green/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-white transition-colors duration-300 group-hover:text-green">{project.title}</h3>
                  <p className="mt-1.5 text-xs text-gray-500">{project.location} — {project.power}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-1 text-sm font-semibold text-green transition-all duration-300 hover:gap-2"
            >
              Voir tous les projets
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
