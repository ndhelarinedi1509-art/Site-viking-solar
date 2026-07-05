'use client';

import { BENEFITS } from '@/constants/benefits';
import { Reveal } from '@/components/ui/reveal';
import { Leaf, TrendingDown, Headphones, Zap, Gauge } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  green: <Leaf className="h-6 w-6 text-green" />,
  blue: <TrendingDown className="h-6 w-6 text-accent-blue" />,
  orange: <Headphones className="h-6 w-6 text-accent-orange" />,
  teal: <Zap className="h-6 w-6 text-accent-teal" />,
  purple: <Gauge className="h-6 w-6 text-accent-purple" />,
};

export function HomeBenefits() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Pourquoi choisir{' '}
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                Vicking Solar
              </span>{' '}
              ?
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BENEFITS.slice(0, 5).map((benefit, i) => (
            <Reveal key={benefit.id} delay={i * 80}>
              <div className="group h-full rounded-2xl border border-border bg-bg-card p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-green/25 hover:shadow-card-hover">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated">
                  {iconMap[benefit.iconColor]}
                </div>
                <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
