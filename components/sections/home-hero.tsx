'use client';

import Link from 'next/link';
import { Star, ArrowRight, ChevronRight } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { value: 150, suffix: '+', label: 'Projets Réalisés' },
  { value: 5, suffix: '', label: "Années d'Expertise" },
  { value: 24, suffix: '/7', label: 'Support 24/7' },
];

export function HomeHero() {
  const count1 = useCountUp(150);
  const count2 = useCountUp(5);
  const count3 = useCountUp(24);

  const counters = [count1, count2, count3];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Glow effect */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-green/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center lg:text-left">
        <div className="mx-auto max-w-3xl lg:mx-0">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-2 text-sm font-medium text-green">
            <Star className="h-4 w-4 fill-green text-green" />
            Leader en énergie renouvelable en RDC
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            L&apos;énergie de demain,{' '}
            <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
              disponible aujourd&apos;hui
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg text-gray-400 sm:text-xl max-w-2xl mx-auto lg:mx-0">
            Viking Solar conçoit et installe des solutions solaires fiables et performantes pour les
            particuliers, entreprises et industries en République Démocratique du Congo.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link
              href="/#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-green px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
            >
              Demander un devis
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-xl border border-green/30 px-7 py-3.5 text-sm font-semibold text-green transition-all duration-300 hover:bg-green/10 hover:border-green/50 active:scale-[0.98]"
            >
              Découvrir nos projets
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {stats.map((stat, i) => (
              <div key={stat.label} className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  <span ref={counters[i].ref}>0</span>
                  {stat.suffix}
                </div>
                <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
