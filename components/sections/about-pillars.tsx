'use client';

import { Reveal } from '@/components/ui/reveal';
import { Card } from '@/components/ui/card';
import { Globe, MapPin, Zap } from 'lucide-react';

const pillars = [
  {
    icon: Globe,
    color: 'accent-blue' as const,
    title: 'Étendue Notre Réseau',
    description:
      "Une présence nationale couvrant l'ensemble du territoire congolais, avec des antennes stratégiquement positionnées pour servir chaque province.",
  },
  {
    icon: MapPin,
    color: 'green' as const,
    title: 'Proximité Locale',
    description:
      "Un ancrage profond dans les communautés locales, comprenant les besoins spécifiques de chaque région et offrant un service personnalisé.",
  },
  {
    icon: Zap,
    color: 'accent-purple' as const,
    title: 'Innovation Solaire',
    description:
      "Des technologies de dernière génération adaptées aux conditions climatiques africaines, garantissant performance et durabilité.",
  },
];

const colorMap = {
  'accent-blue': {
    bg: 'bg-accent-blue/10',
    text: 'text-accent-blue',
    border: 'border-accent-blue/20',
    glow: 'hover:shadow-glow-blue',
  },
  green: {
    bg: 'bg-green/10',
    text: 'text-green',
    border: 'border-green/20',
    glow: 'hover:shadow-glow',
  },
  'accent-purple': {
    bg: 'bg-accent-purple/10',
    text: 'text-accent-purple',
    border: 'border-accent-purple/20',
    glow: 'hover:shadow-glow-purple',
  },
};

export function AboutPillars() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-bg-primary via-bg-card to-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Nos Piliers{' '}
              <span className="bg-gradient-to-r from-green to-accent-blue bg-clip-text text-transparent">
                Fondamentaux
              </span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => {
            const colors = colorMap[pillar.color];
            return (
              <Reveal key={pillar.title} delay={i * 150}>
                <Card className={`h-full p-8 text-center ${colors.glow}`}>
                  <div className={`mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${colors.bg} ${colors.border} border`}>
                    <pillar.icon className={`h-8 w-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{pillar.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{pillar.description}</p>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
