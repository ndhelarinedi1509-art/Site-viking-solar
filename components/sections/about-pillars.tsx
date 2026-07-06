'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const pillars: { icon: React.ReactNode; color: 'blue' | 'green' | 'purple'; title: string; description: string }[] = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
      </svg>
    ),
    color: 'blue',
    title: 'Étendue Notre Réseau',
    description:
      'Nous couvrons l\'ensemble du territoire congolais avec nos équipes spécialisées et nos partenaires agréés en régions.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    color: 'green',
    title: 'Proximité Locale',
    description:
      'Ancrés dans le tissu congolais, nous collaborons avec les communautés locales pour proposer des solutions adaptées, accessibles et qui contribuent à la croissance locale.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
      </svg>
    ),
    color: 'purple',
    title: 'Innovation Solaire',
    description:
      'Nous nous appuyons sur les dernières avancées technologiques pour offrir des solutions solaires de pointe qui répondent aux exigences élevées et permettent d\'optimiser chaque installation.',
  },
];

const colorMap = {
  blue: { bg: 'bg-accent-blue/15', text: 'text-accent-blue', border: 'border-accent-blue/30', shadow: 'shadow-[0_20px_48px_rgba(0,0,0,0.35),0_0_20px_rgba(59,130,246,0.12)]' },
  green: { bg: 'bg-green/15', text: 'text-green', border: 'border-green/30', shadow: 'shadow-[0_20px_48px_rgba(0,0,0,0.35),0_0_20px_rgba(34,197,94,0.15)]' },
  purple: { bg: 'bg-accent-purple/15', text: 'text-accent-purple', border: 'border-accent-purple/30', shadow: 'shadow-[0_20px_48px_rgba(0,0,0,0.35),0_0_20px_rgba(139,92,246,0.12)]' },
};

function PillarCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-[0.45s] ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function AboutPillars() {
  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-[clamp(1.6rem,2.8vw,2.2rem)] font-extrabold text-white text-center tracking-[-0.02em] mb-12">
          Nos Piliers Fondamentaux
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p, i) => {
            const c = colorMap[p.color];
            return (
              <PillarCard key={p.title} delay={i * 100}>
                <div className={cn(
                  'group rounded-2xl border border-border bg-bg-elevated p-8 transition-all duration-[0.45s] ease-premium will-change-transform',
                  'hover:-translate-y-2 hover:scale-[1.02]',
                  `hover:${c.border} hover:${c.shadow}`,
                )}>
                  <div className={cn('mb-5 flex h-[54px] w-[54px] items-center justify-center rounded-xl', c.bg, c.text)}>
                    {p.icon}
                  </div>
                  <h3 className="text-[1.05rem] font-bold text-white mb-2.5">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                </div>
              </PillarCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
