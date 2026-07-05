'use client';

import { Reveal } from '@/components/ui/reveal';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    id: 'test-1',
    lines: 4,
  },
  {
    id: 'test-2',
    lines: 5,
  },
  {
    id: 'test-3',
    lines: 3,
  },
];

export function ProjectsTestimonials() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-bg-primary via-bg-card to-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Avis de{' '}
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                Nos Clients
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={i * 150}>
              <div className="rounded-2xl border border-white/5 bg-bg-card p-8">
                <Quote className="mb-4 h-8 w-8 text-green/40" />
                <div className="space-y-3">
                  {Array.from({ length: t.lines }).map((_, j) => (
                    <div
                      key={j}
                      className={`h-3 rounded-full bg-white/5 ${
                        j === t.lines - 1 ? 'w-3/4' : 'w-full'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/5" />
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded-full bg-white/5" />
                    <div className="h-2.5 w-16 rounded-full bg-white/5" />
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
