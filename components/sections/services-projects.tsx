'use client';

import { PROJECTS } from '@/constants/projects';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { MapPin, Zap } from 'lucide-react';

export function ServicesProjects() {
  const previewProjects = PROJECTS.slice(0, 4);

  return (
    <section className="relative py-24 sm:py-32 bg-bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Réalisations"
            title="Projets"
            titleHighlight="Récents"
            description="Découvrez quelques-unes de nos installations solaires réalisées en RDC."
          />
        </Reveal>

        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewProjects.map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
              <div
                className={`group overflow-hidden rounded-2xl border border-white/5 bg-bg-card transition-all duration-300 hover:border-green/20 hover:shadow-card-hover ${
                  i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''
                }`}
              >
                <div
                  className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-bg-elevated to-bg-card ${
                    i === 0 ? 'h-64 sm:h-full sm:min-h-[320px]' : 'h-48'
                  }`}
                >
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
                  <span className="absolute top-3 left-3 rounded-full bg-green/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-white group-hover:text-green transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      {project.power}
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
