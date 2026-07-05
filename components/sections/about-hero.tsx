'use client';

import { Reveal } from '@/components/ui/reveal';
import { ChevronDown } from 'lucide-react';

export function AboutHero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-card to-bg-primary">
      {/* Overlay pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow effect */}
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-green/8 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Reveal>
          <span className="mb-4 inline-block rounded-full border border-green/20 bg-green/5 px-5 py-2 text-xs font-medium tracking-wider text-green uppercase">
            À propos de Vicking Solar
          </span>
        </Reveal>

        <Reveal delay={150}>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            À propos de{' '}
            <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
              Vicking Solar
            </span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Entreprise congolaise spécialisée dans les solutions solaires innovantes, nous
            accompagnons particuliers et professionnels vers un avenir énergétique durable en
            République Démocratique du Congo.
          </p>
        </Reveal>

        {/* Down arrow */}
        <Reveal delay={500}>
          <div className="mt-16 flex justify-center">
            <a
              href="#innovation"
              className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-green/30 hover:text-green hover:shadow-glow"
            >
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
