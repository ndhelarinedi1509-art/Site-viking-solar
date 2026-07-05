'use client';

import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { ClipboardCheck, Search, Wrench, Zap, RefreshCw } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Analyse des Besoins',
    description:
      'Nous étudions votre consommation énergétique, votre infrastructure et vos objectifs pour proposer la solution la plus adaptée.',
    duration: 'Jour 1',
    color: 'blue',
    icon: <ClipboardCheck className="h-5 w-5" />,
  },
  {
    number: 2,
    title: 'Étude Technique',
    description:
      'Dimensionnement précis, étude d\'ensoleillement et conception des schémas électriques certifiés pour garantir la performance.',
    duration: 'Jours 2-3',
    color: 'green',
    icon: <Search className="h-5 w-5" />,
  },
  {
    number: 3,
    title: 'Installation',
    description:
      'Pose professionnelle des panneaux, onduleurs et batteries par nos techniciens certifiés, avec respect des normes internationales.',
    duration: '1-5 jours',
    color: 'orange',
    icon: <Wrench className="h-5 w-5" />,
  },
  {
    number: 4,
    title: 'Mise en Service',
    description:
      'Tests de performance, configuration du monitoring et formation à l\'utilisation de votre nouvelle installation solaire.',
    duration: 'Jour J',
    color: 'purple',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    number: 5,
    title: 'Maintenance Continue',
    description:
      'Surveillance à distance, entretien préventif et dépannage rapide pour assurer la longévité et les performances optimales.',
    duration: 'En continu',
    color: 'teal',
    icon: <RefreshCw className="h-5 w-5" />,
  },
];

const dotColorMap: Record<string, string> = {
  blue: 'bg-accent-blue text-white shadow-glow-blue',
  green: 'bg-green text-white shadow-glow',
  orange: 'bg-accent-orange text-white shadow-glow-orange',
  purple: 'bg-accent-purple text-white shadow-glow-purple',
  teal: 'bg-accent-teal text-white',
};

const badgeColorMap: Record<string, string> = {
  blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  green: 'bg-green/10 text-green border-green/20',
  orange: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
  purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  teal: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
};

const iconBgMap: Record<string, string> = {
  blue: 'bg-accent-blue/10 text-accent-blue',
  green: 'bg-green/10 text-green',
  orange: 'bg-accent-orange/10 text-accent-orange',
  purple: 'bg-accent-purple/10 text-accent-purple',
  teal: 'bg-accent-teal/10 text-accent-teal',
};

export function ServicesProcess() {
  return (
    <section className="relative py-24 sm:py-32 bg-bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Comment ça marche"
            title="Notre"
            titleHighlight="Processus"
            description="De la première consultation à la maintenance continue, chaque étape est pensée pour vous garantir une installation solaire performante et durable."
          />
        </Reveal>

        <div className="relative mt-16">
          {/* Vertical connector line - mobile */}
          <div className="absolute left-6 top-0 h-full w-px bg-gradient-to-b from-accent-blue/40 via-green/40 to-accent-teal/40 sm:hidden" />

          {/* Vertical connector line - desktop */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-accent-blue/40 via-green/40 to-accent-teal/40 lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;

              return (
                <Reveal key={step.number} delay={i * 120}>
                  <div
                    className={`relative flex items-start gap-6 lg:items-center lg:gap-0 ${
                      i < steps.length - 1 ? 'pb-12 lg:pb-16' : ''
                    }`}
                  >
                    {/* Mobile layout */}
                    <div className="flex flex-col items-center gap-0 lg:hidden">
                      <div
                        className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold ${dotColorMap[step.color]}`}
                      >
                        {step.number}
                      </div>
                      {i < steps.length - 1 && <div className="h-12" />}
                    </div>

                    {/* Mobile content */}
                    <div className="flex-1 lg:hidden">
                      <div className="rounded-2xl border border-white/5 bg-bg-card p-5">
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconBgMap[step.color]}`}
                          >
                            {step.icon}
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${badgeColorMap[step.color]}`}
                          >
                            {step.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                        <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-8 lg:w-full">
                      {/* Left content */}
                      <div className={isLeft ? '' : 'order-3'}>
                        {isLeft ? (
                          <div className="text-right">
                            <div
                              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${badgeColorMap[step.color]}`}
                            >
                              {step.duration}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        ) : (
                          <div className="flex justify-start pl-4">
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBgMap[step.color]}`}
                            >
                              {step.icon}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Center dot */}
                      <div className="order-2 flex justify-center">
                        <div
                          className={`relative z-10 flex h-14 w-14 items-center justify-center rounded-full text-base font-bold ${dotColorMap[step.color]}`}
                        >
                          {step.number}
                        </div>
                      </div>

                      {/* Right content */}
                      <div className={isLeft ? 'order-3' : ''}>
                        {isLeft ? (
                          <div className="flex justify-start pl-4">
                            <div
                              className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBgMap[step.color]}`}
                            >
                              {step.icon}
                            </div>
                          </div>
                        ) : (
                          <div className="text-left">
                            <div
                              className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${badgeColorMap[step.color]}`}
                            >
                              {step.duration}
                            </div>
                            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                            <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
