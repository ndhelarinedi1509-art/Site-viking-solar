'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { Reveal } from '@/components/ui/reveal';
import { FolderOpen, Users, Zap, LayoutGrid } from 'lucide-react';

const stats = [
  {
    icon: FolderOpen,
    value: 800,
    suffix: '+',
    label: 'Projets & Installations',
    color: 'green' as const,
  },
  {
    icon: Users,
    value: 1500,
    suffix: '+',
    label: 'Clients Satisfaits',
    color: 'blue' as const,
  },
  {
    icon: Zap,
    value: 2497,
    suffix: ' kW',
    label: 'Capacité Solaire',
    color: 'orange' as const,
  },
  {
    icon: LayoutGrid,
    value: 3200,
    suffix: '+',
    label: 'Panneaux Installés',
    color: 'purple' as const,
  },
];

const colorMap = {
  green: {
    bg: 'bg-green/10',
    text: 'text-green',
    border: 'border-green/20',
    glow: 'shadow-[0_0_30px_rgba(34,197,94,0.15)]',
  },
  blue: {
    bg: 'bg-accent-blue/10',
    text: 'text-accent-blue',
    border: 'border-accent-blue/20',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
  },
  orange: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.15)]',
  },
  purple: {
    bg: 'bg-accent-purple/10',
    text: 'text-accent-purple',
    border: 'border-accent-purple/20',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.15)]',
  },
};

function StatCard({ stat, index }: { stat: (typeof stats)[number]; index: number }) {
  const { ref } = useCountUp(stat.value);
  const colors = colorMap[stat.color];

  return (
    <Reveal delay={index * 100}>
      <div
        className={`rounded-2xl border ${colors.border} bg-bg-card p-8 text-center transition-all duration-300 hover:border-opacity-50 ${colors.glow}`}
      >
        <div
          className={`mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl ${colors.bg} ${colors.border} border`}
        >
          <stat.icon className={`h-7 w-7 ${colors.text}`} />
        </div>
        <div className="text-3xl font-bold text-white sm:text-4xl">
          <span ref={ref}>0</span>
          {stat.suffix}
        </div>
        <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
      </div>
    </Reveal>
  );
}

export function ProjectsStats() {
  return (
    <section id="stats" className="relative py-24 sm:py-32 bg-gradient-to-b from-bg-primary via-bg-card to-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
