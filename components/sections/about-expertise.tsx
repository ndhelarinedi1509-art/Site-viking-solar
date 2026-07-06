'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

const stats = [
  { value: 800, suffix: '+', label: 'Installations' },
  { value: 2497, suffix: 'kW', label: 'Installée' },
  { value: 15, suffix: '+', label: 'Experts' },
  { value: 5, suffix: '', label: 'Années' },
  { value: 100, suffix: '%', label: 'Home Local' },
];

const expertise = [
  {
    icon: 'solar',
    title: 'Énergie Solaire',
    description:
      'Conception et installation de systèmes photovoltaïques résidentiels et commerciaux, adaptés aux réalités climatiques du Congo.',
    width: 95,
    barColor: 'bg-accent-blue',
    iconBg: 'bg-accent-blue/15',
    iconColor: '#3B82F6',
    hoverBorder: 'border-accent-blue/35',
    hoverShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(59,130,246,0.12)]',
  },
  {
    icon: 'maint',
    title: 'Maintenance Élec.',
    description:
      'Surveillance proactive, entretien préventif et réponse rapide aux pannes pour assurer la continuité de votre alimentation électrique.',
    width: 90,
    barColor: 'bg-accent-orange',
    iconBg: 'bg-accent-orange/15',
    iconColor: '#F59E0B',
    hoverBorder: 'border-accent-orange/35',
    hoverShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(245,158,11,0.12)]',
  },
  {
    icon: 'hybrid',
    title: 'Systèmes Hybrides',
    description:
      'Couplage intelligent du solaire avec batteries de stockage et groupes électrogènes pour une alimentation ininterrompue en toutes conditions.',
    width: 88,
    barColor: 'bg-accent-purple',
    iconBg: 'bg-accent-purple/15',
    iconColor: '#8B5CF6',
    hoverBorder: 'border-accent-purple/35',
    hoverShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(139,92,246,0.12)]',
  },
  {
    icon: 'indus',
    title: 'Solar Industriel',
    description:
      'Infrastructure solaire sur grande échelle pour usines, entrepôts et projets industriels avec un rendement optimisé et une fiabilité maximale.',
    width: 85,
    barColor: 'bg-green',
    iconBg: 'bg-green/15',
    iconColor: '#22C55E',
    hoverBorder: 'border-green/35',
    hoverShadow: 'shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(34,197,94,0.15)]',
  },
];

const icons = {
  solar: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
    </svg>
  ),
  maint: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    </svg>
  ),
  hybrid: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z" />
    </svg>
  ),
  indus: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7zm0-4c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z" />
    </svg>
  ),
};

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

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const counter = useCountUp(value);
  return (
    <div className="flex-1 py-6 px-4 text-center border-r border-border last:border-r-0">
      <div className="inline text-[1.8rem] font-extrabold text-white">
        <span ref={counter.ref}>0</span>
      </div>
      {suffix === 'kW' ? (
        <span className="text-base font-bold text-green">{suffix}</span>
      ) : suffix === '%' ? (
        <span className="text-base font-bold text-green">{suffix}</span>
      ) : suffix === '+' ? (
        <span className="text-lg font-bold text-green">+</span>
      ) : null}
      <span className="block text-[0.72rem] text-gray-500 uppercase tracking-[0.06em] mt-1.5">{label}</span>
    </div>
  );
}

function ProgressBar({ width, color, delay }: { width: number; color: string; delay: number }) {
  const { ref, isInView } = useInView();
  return (
    <div ref={ref} className="flex-1 h-[5px] rounded-full bg-bg-elevated overflow-hidden">
      <div
        className={cn('h-full rounded-full transition-all duration-[1.2s] ease-premium', color)}
        style={{ width: isInView ? `${width}%` : '0%', transitionDelay: `${delay}ms` }}
      />
    </div>
  );
}

export function AboutExpertise() {
  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-[clamp(1.6rem,2.8vw,2.2rem)] font-extrabold text-white text-center tracking-[-0.02em] mb-3">
            Notre Expertise Technique
          </h2>
          <p className="text-center text-sm text-gray-400 max-w-[560px] mx-auto mb-11 leading-relaxed">
            Maîtrise de toute la chaîne de valeur solaire pour vous offrir les meilleurs résultats, dans les règles de l&apos;art.
          </p>
        </FadeIn>

        {/* Stats segmented bar */}
        <FadeIn>
          <div className="flex justify-center mb-12 rounded-2xl border border-border bg-bg-elevated overflow-hidden">
            {stats.map((stat, i) => (
              <StatItem key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </FadeIn>

        {/* Expertise cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {expertise.map((item, i) => (
            <FadeIn key={item.title} delay={i * 100}>
              <div
                className={cn(
                  'group rounded-2xl border border-border bg-bg-primary p-6 transition-all duration-[0.45s] ease-premium will-change-transform',
                  'hover:-translate-y-2 hover:scale-[1.025]',
                  'hover:border-green/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(34,197,94,0.12)]',
                )}
              >
                <div className={cn('mb-4 flex h-[46px] w-[46px] items-center justify-center rounded-xl', item.iconBg)} style={{ color: item.iconColor }}>
                  {icons[item.icon as keyof typeof icons]}
                </div>
                <h3 className="text-[0.95rem] font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.description}</p>
                <div className="flex items-center gap-2.5">
                  <ProgressBar width={item.width} color={item.barColor} delay={i * 200} />
                  <span className="text-xs font-bold text-gray-400 shrink-0">{item.width}%</span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
