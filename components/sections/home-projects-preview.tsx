'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { PROJECTS } from '@/constants/projects';
import { Reveal } from '@/components/ui/reveal';

export function HomeProjectsPreview() {
  const previewProjects = PROJECTS.slice(0, 4);

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="mb-3 block rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-medium tracking-wider text-green uppercase w-fit">
                Réalisations
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Réalisations Récentes
              </h2>
            </div>
            <Link
              href="/projects"
              className="group hidden items-center gap-2 text-sm font-semibold text-green transition-colors hover:text-green-dark sm:inline-flex"
            >
              Voir tous les projets
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* Mobile scroll / Desktop grid */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:pb-0">
          {previewProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <div className="group min-w-[280px] sm:min-w-0 overflow-hidden rounded-2xl border border-white/5 bg-bg-card transition-all duration-300 hover:border-green/20 hover:shadow-card-hover">
                {/* Image placeholder */}
                <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-bg-elevated to-bg-card">
                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <svg
                      className="h-10 w-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {/* Category tag */}
                  <span className="absolute top-3 left-3 rounded-full bg-green/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-semibold text-white group-hover:text-green transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">
                    {project.location} — {project.power}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-green transition-colors hover:text-green-dark"
            >
              Voir tous les projets
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
