'use client';

import { useState } from 'react';
import { PROJECTS, PROJECT_FILTERS } from '@/constants/projects';
import { Reveal } from '@/components/ui/reveal';
import { MapPin } from 'lucide-react';

const categoryColors: Record<string, string> = {
  residentiel: 'bg-green/80',
  industriel: 'bg-orange-500/80',
  commercial: 'bg-accent-blue/80',
  institutionnel: 'bg-accent-purple/80',
};

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
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Tous nos{' '}
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                Projets
              </span>
            </h2>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {PROJECT_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  activeFilter === filter.value
                    ? 'bg-green text-white shadow-glow'
                    : 'border border-white/10 bg-white/5 text-gray-400 hover:border-green/30 hover:text-green'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <div
              key={project.id}
              id={project.id}
              className={`group overflow-hidden rounded-2xl border border-white/5 bg-bg-card transition-all duration-500 hover:border-green/20 hover:shadow-card-hover`}
            >
              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-bg-elevated to-bg-card">
                <div className="flex flex-col items-center gap-2 text-gray-600">
                  <svg
                    className="h-12 w-12"
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
                <span
                  className={`absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ${
                    categoryColors[project.category] || 'bg-green/80'
                  }`}
                >
                  {project.category}
                </span>
              </div>

              <div className="p-6">
                <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {project.location}
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-green transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
