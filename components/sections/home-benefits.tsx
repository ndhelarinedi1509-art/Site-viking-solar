'use client';

import { BENEFITS } from '@/constants/benefits';
import { Reveal } from '@/components/ui/reveal';
import { Leaf, TrendingDown, Headphones, Zap, Gauge, Award } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  green: <Leaf className="h-6 w-6 text-green" />,
  blue: <TrendingDown className="h-6 w-6 text-accent-blue" />,
  orange: <Headphones className="h-6 w-6 text-accent-orange" />,
  teal: <Zap className="h-6 w-6 text-accent-teal" />,
  purple: <Gauge className="h-6 w-6 text-accent-purple" />,
  amber: <Award className="h-6 w-6 text-accent-amber" />,
};

const bgMap: Record<string, string> = {
  green: 'bg-green/10 border-green/20',
  blue: 'bg-accent-blue/10 border-accent-blue/20',
  orange: 'bg-accent-orange/10 border-accent-orange/20',
  teal: 'bg-accent-teal/10 border-accent-teal/20',
  purple: 'bg-accent-purple/10 border-accent-purple/20',
  amber: 'bg-accent-amber/10 border-accent-amber/20',
};

export function HomeBenefits() {
  return (
    <section className="relative py-24 sm:py-32 bg-bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="mb-3 inline-block rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-medium tracking-wider text-green uppercase">
              Avantages
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                Viking Solar
              </span>{' '}
              ?
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BENEFITS.slice(0, 5).map((benefit, i) => (
            <Reveal key={benefit.id} delay={i * 100}>
              <div className="flex h-full flex-col items-center text-center rounded-2xl border border-white/5 bg-bg-card p-6 transition-all duration-300 hover:border-green/20 hover:shadow-card-hover">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${bgMap[benefit.iconColor]}`}
                >
                  {iconMap[benefit.iconColor]}
                </div>
                <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
