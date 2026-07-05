'use client';

import { Reveal } from '@/components/ui/reveal';

export function ContactHero() {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-card to-bg-primary">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-green/8 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Reveal>
          <span className="mb-4 inline-block rounded-full border border-green/20 bg-green/5 px-5 py-2 text-xs font-medium tracking-wider text-green uppercase">
            Votre partenaire en énergie solaire durable
          </span>
        </Reveal>

        <Reveal delay={150}>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Contactez{' '}
            <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
              Vicking Solar
            </span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Notre équipe est prête à vous accompagner dans vos projets énergétiques.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
