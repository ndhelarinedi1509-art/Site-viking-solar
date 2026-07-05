'use client';

import { SITE_CONFIG } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import { useCountUp } from '@/hooks/useCountUp';
import { Star, ArrowRight, MessageCircle, ChevronDown } from 'lucide-react';

const stats = [
  { value: 800, suffix: '+', label: 'Installations' },
  { value: 2497, suffix: ' kW', label: 'Puissance installée' },
  { value: 5, suffix: '+', label: "Années d'expérience" },
];

export function ServicesHero() {
  const count1 = useCountUp(800);
  const count2 = useCountUp(2497);
  const count3 = useCountUp(5);
  const counters = [count1, count2, count3];

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-gradient-to-br from-bg-primary via-bg-card to-bg-primary">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-green/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-accent-blue/6 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center">
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-5 py-2 text-xs font-medium tracking-wider text-green uppercase">
            <Star className="h-3.5 w-3.5 fill-green text-green" />
            Votre partenaire en énergie solaire durable
          </span>
        </Reveal>

        <Reveal delay={150}>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-7xl">
            Nos{' '}
            <span className="bg-gradient-to-r from-green to-accent-blue bg-clip-text text-transparent">
              Services
            </span>
          </h1>
        </Reveal>

        <Reveal delay={300}>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-400 leading-relaxed">
            Des solutions énergétiques modernes, fiables et adaptées aux besoins du Congo.
          </p>
        </Reveal>

        <Reveal delay={450}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#services-section"
              className="group inline-flex items-center gap-2 rounded-xl bg-green px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
            >
              Explorer nos services
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href={SITE_CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 px-7 py-3.5 text-sm font-semibold text-gray-300 transition-all duration-300 hover:text-white hover:bg-white/5 active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </Reveal>

        <Reveal delay={600}>
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  <span ref={counters[i].ref}>0</span>
                  {stat.suffix}
                </div>
                <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={750}>
          <div className="mt-16 flex justify-center">
            <a
              href="#services-section"
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
