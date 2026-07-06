'use client';

import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const visionCards = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#22C55E">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    ),
    iconBg: 'bg-green/12',
    title: 'Vision Solaire',
    description:
      "Démocratiser l'accès à l'énergie propre en utilisant la puissance du soleil pour transformer le quotidien des Congolais et bâtir un futur durable.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#10B981">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
      </svg>
    ),
    iconBg: 'bg-[rgba(16,185,129,0.12)]',
    title: 'Engagement Durable',
    description:
      "Nous nous engageons à réduire l'empreinte carbone et à favoriser une croissance économique respectueuse de l'environnement au cœur du Congo.",
  },
];

const bottomItems = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#22C55E">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    title: 'Notre Histoire',
    description:
      "Fondée à Kinshasa, Vicking Solar est née d'une vision ambitieuse : transformer l'accès à l'énergie du pays en combinant le savoir-faire local et une expertise de haut niveau.",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="#3B82F6">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
    title: 'Mission',
    description:
      'Démocratiser l\'accès à l\'énergie solaire et propulser les entreprises, ménages et collectivités sur la voie du progrès national.',
  },
];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className,
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function AboutInnovation() {
  return (
    <section id="innovation" className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: title + 2 cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-start mb-12">
          <FadeIn>
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-white leading-[1.2] tracking-[-0.02em]">
              L&apos;innovation au cœur<br />du Congo
            </h2>
          </FadeIn>

          <div className="flex flex-col gap-5">
            {visionCards.map((card, i) => (
              <FadeIn key={card.title} delay={i * 150}>
                <div className="group rounded-2xl border border-border bg-bg-card p-6 sm:p-7 transition-all duration-350 hover:-translate-y-1 hover:border-green/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.25)]">
                  <div className={cn('mb-4 flex h-[42px] w-[42px] items-center justify-center rounded-xl', card.iconBg)}>
                    {card.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{card.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* Bottom: Histoire + Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-10 border-t border-border">
          {bottomItems.map((item, i) => (
            <FadeIn key={item.title} delay={i * 150}>
              <div className="flex gap-4 items-start">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bg-elevated mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[0.95rem] font-bold text-white mb-1.5">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
