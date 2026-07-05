'use client';

import { BENEFITS } from '@/constants/benefits';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
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

export function ServicesBenefits() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Nos atouts"
            title="Les Avantages"
            titleHighlight="Vicking Solar"
            description="Des raisons concrètes de nous confier votre projet d'énergie solaire en RDC."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.id} delay={i * 100}>
              <div className="group flex h-full flex-col items-center text-center rounded-2xl border border-white/5 bg-bg-card p-6 transition-all duration-300 hover:border-green/20 hover:shadow-card-hover">
                <div
                  className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full border ${bgMap[benefit.iconColor]}`}
                >
                  {iconMap[benefit.iconColor]}
                </div>
                <h3 className="text-base font-semibold text-white">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
