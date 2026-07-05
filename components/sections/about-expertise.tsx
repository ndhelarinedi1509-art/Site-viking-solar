'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { useInView } from '@/hooks/useInView';
import { Reveal } from '@/components/ui/reveal';
import { Card } from '@/components/ui/card';

const stats = [
  { value: 800, suffix: '+', label: 'Installations' },
  { value: 2497, suffix: ' kW', label: 'Installée' },
  { value: 15, suffix: '+', label: 'Experts' },
  { value: 5, suffix: '', label: 'Années' },
  { value: 100, suffix: '%', label: 'Home Local' },
];

const expertise = [
  { title: 'Énergie Solaire', width: 95, color: 'bg-accent-blue' },
  { title: 'Maintenance', width: 90, color: 'bg-accent-orange' },
  { title: 'Systèmes Hybrides', width: 88, color: 'bg-accent-purple' },
  { title: 'Solar Industriel', width: 85, color: 'bg-green' },
];

function ProgressBar({ width, color, delay }: { width: number; color: string; delay: number }) {
  const { ref, isInView } = useInView();

  return (
    <div ref={ref} className="h-2.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full rounded-full ${color} transition-all duration-1000 ease-premium`}
        style={{
          width: isInView ? `${width}%` : '0%',
          transitionDelay: `${delay}ms`,
        }}
      />
    </div>
  );
}

export function AboutExpertise() {
  return (
    <section className="relative py-24 sm:py-32 bg-gradient-to-b from-bg-primary via-bg-card to-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Notre Expertise{' '}
              <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                Technique
              </span>
            </h2>
            <p className="mt-4 text-base text-gray-400 max-w-2xl mx-auto">
              Des chiffres qui reflètent notre engagement et notre savoir-faire dans le domaine de
              l&apos;énergie solaire en RDC.
            </p>
          </div>
        </Reveal>

        {/* Stats row */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 100}>
              <StatCard value={stat.value} suffix={stat.suffix} label={stat.label} />
            </Reveal>
          ))}
        </div>

        {/* Expertise cards with progress bars */}
        <div className="grid gap-6 sm:grid-cols-2">
          {expertise.map((item, i) => (
            <Reveal key={item.title} delay={i * 150}>
              <Card className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  <span className="text-sm font-bold text-gray-300">{item.width}%</span>
                </div>
                <ProgressBar width={item.width} color={item.color} delay={i * 200} />
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const counter = useCountUp(value);

  return (
    <div className="rounded-2xl border border-white/6 bg-bg-card p-6 text-center transition-all duration-350 hover:bg-bg-card-hover hover:border-white/10">
      <div className="text-3xl font-bold text-white sm:text-4xl">
        <span ref={counter.ref}>0</span>
        {suffix}
      </div>
      <div className="mt-1 text-sm text-gray-400">{label}</div>
    </div>
  );
}
