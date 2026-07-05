'use client';

import { Reveal } from '@/components/ui/reveal';
import { Card } from '@/components/ui/card';
import { Sun, Leaf, History, Target } from 'lucide-react';

const mainCards = [
  {
    icon: Sun,
    color: 'green' as const,
    title: 'Vision Solaire',
    description:
      "Démocratiser l'accès à l'énergie solaire pour chaque ménage et entreprise congolais, en proposant des solutions performantes et accessibles qui transforment la vie quotidienne.",
  },
  {
    icon: Leaf,
    color: 'green' as const,
    title: 'Engagement Durable',
    description:
      'Réduire l\'empreinte carbone du Congo en promouvant les énergies renouvelables. Chaque installation contribue à un avenir plus vert pour les générations futures.',
  },
];

const bottomCards = [
  {
    icon: History,
    color: 'accent-blue' as const,
    title: 'Notre Histoire',
    description:
      'Fondée à Kinshasa par une équipe d\'ingénieurs congolais passionnés, Vicking Solar est née de la volonté de changer le paysage énergétique du Congo.',
  },
  {
    icon: Target,
    color: 'accent-purple' as const,
    title: 'Mission',
    description:
      'Fournir des solutions solaires fiables et durables, adaptées aux réalités congolaises, tout en créant des emplois locaux et en formant la prochaine génération d\'experts.',
  },
];

const colorMap = {
  green: { bg: 'bg-green/10', text: 'text-green', border: 'border-green/20' },
  'accent-blue': { bg: 'bg-accent-blue/10', text: 'text-accent-blue', border: 'border-accent-blue/20' },
  'accent-purple': { bg: 'bg-accent-purple/10', text: 'text-accent-purple', border: 'border-accent-purple/20' },
};

export function AboutInnovation() {
  return (
    <section id="innovation" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              L&apos;innovation au cœur du{' '}
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                Congo
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Top 2 large cards */}
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          {mainCards.map((card, i) => {
            const colors = colorMap[card.color];
            return (
              <Reveal key={card.title} delay={i * 150}>
                <Card className="h-full p-8">
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border`}>
                    <card.icon className={`h-7 w-7 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{card.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom 2 cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {bottomCards.map((card, i) => {
            const colors = colorMap[card.color];
            return (
              <Reveal key={card.title} delay={(i + 2) * 150}>
                <Card className="h-full p-8">
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border`}>
                    <card.icon className={`h-6 w-6 ${colors.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{card.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
