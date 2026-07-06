'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const steps = [
  {
    number: '01',
    title: 'Analyse des Besoins',
    description:
      'Visite sur site gratuite et audit énergétique complet de votre installation existante. Identification de vos consommations et objectifs.',
    duration: 'Jour 1',
    color: 'blue',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#3B82F6">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Étude Technique',
    description:
      "Dimensionnement précis du système, sélection des équipements, plans d'installation et devis détaillé remis sous 48h.",
    duration: 'Jours 2-3',
    color: 'green',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#22C55E">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9V3.5L18.5 9H13zM7 17l2-2 2 2 4-4 2 2v4H7v-2z" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Installation',
    description:
      "Déploiement par nos techniciens certifiés. Pose des panneaux, câblage, protection électrique et intégration des onduleurs selon les normes IEC.",
    duration: '1–5 jours',
    color: 'orange',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#F59E0B">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: 'Mise en Service',
    description:
      "Tests complets du système, configuration du monitoring, formation de l'utilisateur et remise du dossier de conformité avec certificats.",
    duration: 'Jour J',
    color: 'purple',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#8B5CF6">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    number: '05',
    title: 'Maintenance Continue',
    description:
      "Suivi à distance via notre plateforme IoT, visites préventives programmées et assistance téléphonique 7j/7 pour garantir vos performances.",
    duration: 'En continu',
    color: 'teal',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="#14B8A6">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </svg>
    ),
  },
];

const dotStyles: Record<string, { border: string; shadow: string }> = {
  blue:   { border: 'border-accent-blue', shadow: 'shadow-[0_0_0_6px_rgba(59,130,246,0.08)]' },
  green:  { border: 'border-green', shadow: 'shadow-[0_0_0_6px_rgba(34,197,94,0.08)]' },
  orange: { border: 'border-accent-orange', shadow: 'shadow-[0_0_0_6px_rgba(245,158,11,0.08)]' },
  purple: { border: 'border-accent-purple', shadow: 'shadow-[0_0_0_6px_rgba(139,92,246,0.08)]' },
  teal:   { border: 'border-accent-teal', shadow: 'shadow-[0_0_0_6px_rgba(20,184,166,0.08)]' },
};

const dotTextColors: Record<string, string> = {
  blue: 'text-accent-blue', green: 'text-green', orange: 'text-accent-orange',
  purple: 'text-accent-purple', teal: 'text-accent-teal',
};

function StepItem({ step, index }: { step: typeof steps[0]; index: number }) {
  const { ref, isInView } = useInView();
  const isRight = index % 2 === 1;
  const ds = dotStyles[step.color];

  return (
    <div
      ref={ref}
      className={cn(
        'sv-tl-item grid grid-cols-[1fr_60px_1fr] items-center min-h-[140px]',
        'transition-all duration-[0.6s] ease-out',
        isInView ? 'opacity-100 translate-x-0' : `opacity-0 ${isRight ? 'translate-x-8' : '-translate-x-8'}`,
      )}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Left card */}
      {!isRight && (
        <div className="sv-tl-card mr-8 bg-bg-elevated border border-border rounded-2xl p-6 flex items-start gap-4 transition-all duration-350 hover:scale-[1.02] hover:border-white/10 hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)]">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.color === 'blue' ? 'bg-accent-blue/10' : step.color === 'green' ? 'bg-green/10' : step.color === 'orange' ? 'bg-accent-orange/10' : step.color === 'purple' ? 'bg-accent-purple/10' : 'bg-accent-teal/10'}`}>
            {step.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
          </div>
          <span className="flex items-center gap-1 text-[0.7rem] font-semibold text-gray-600 shrink-0 mt-0.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            {step.duration}
          </span>
        </div>
      )}

      {/* Dot */}
      <div className="flex justify-center">
        <div className={cn(
          'flex h-[52px] w-[52px] items-center justify-center rounded-full border-2 bg-bg-primary z-[2] relative',
          ds.border, ds.shadow,
        )}>
          <span className={cn('text-[0.75rem] font-extrabold tracking-[0.02em]', dotTextColors[step.color])}>
            {step.number}
          </span>
        </div>
      </div>

      {/* Right card */}
      {isRight && (
        <div className="sv-tl-card ml-8 bg-bg-elevated border border-border rounded-2xl p-6 flex items-start gap-4 transition-all duration-350 hover:scale-[1.02] hover:border-white/10 hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)]">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.color === 'blue' ? 'bg-accent-blue/10' : step.color === 'green' ? 'bg-green/10' : step.color === 'orange' ? 'bg-accent-orange/10' : step.color === 'purple' ? 'bg-accent-purple/10' : 'bg-accent-teal/10'}`}>
            {step.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
          </div>
          <span className="flex items-center gap-1 text-[0.7rem] font-semibold text-gray-600 shrink-0 mt-0.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
            </svg>
            {step.duration}
          </span>
        </div>
      )}

      {/* Empty third column when needed */}
      {!isRight && <div />}
      {isRight && <div />}
    </div>
  );
}

export function ServicesProcess() {
  return (
    <section className="sv-process relative py-24 sm:py-28 border-t border-border bg-bg-card overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/8 px-4 py-1.5 text-[0.72rem] font-bold tracking-[0.14em] text-green uppercase mb-4">
            Comment ça marche
          </span>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.8rem)] font-extrabold text-white tracking-[-0.03em] leading-[1.15] mb-3">
            Notre <span className="bg-gradient-to-r from-accent-orange to-accent-red bg-clip-text text-transparent">Processus</span>
          </h2>
          <p className="text-base text-gray-400 max-w-[580px] mx-auto leading-relaxed">
            De la première analyse à la mise en service, nous vous accompagnons à chaque étape avec rigueur et transparence.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-border-light to-transparent hidden lg:block" />
          {/* Mobile line */}
          <div className="absolute left-7 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-border-light to-transparent lg:hidden" />

          <div className="flex flex-col gap-0">
            {steps.map((step, i) => (
              <div key={step.number} className="block lg:hidden">
                {/* Mobile layout */}
                <div
                  className={cn(
                    'flex items-start gap-4 min-h-[140px]',
                    'transition-all duration-[0.6s] ease-out',
                  )}
                >
                  <div className={cn(
                    'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border-2 bg-bg-primary z-[2] relative',
                    dotStyles[step.color].border, dotStyles[step.color].shadow,
                  )}>
                    <span className={cn('text-[0.75rem] font-extrabold', dotTextColors[step.color])}>
                      {step.number}
                    </span>
                  </div>
                  <div className="flex-1 bg-bg-elevated border border-border rounded-2xl p-5 transition-all duration-350 hover:scale-[1.02] hover:border-white/10 hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)]">
                    <div className="flex items-start gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${step.color === 'blue' ? 'bg-accent-blue/10' : step.color === 'green' ? 'bg-green/10' : step.color === 'orange' ? 'bg-accent-orange/10' : step.color === 'purple' ? 'bg-accent-purple/10' : 'bg-accent-teal/10'}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{step.title}</h3>
                          <span className="flex items-center gap-1 text-[0.7rem] font-semibold text-gray-600 shrink-0">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                            </svg>
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Desktop layout */}
            <div className="hidden lg:block">
              <div className="flex flex-col gap-0">
                {steps.map((step, i) => (
                  <StepItem key={step.number} step={step} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
