'use client';

import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { TEAM_MEMBERS } from '@/constants/team';
import { User } from 'lucide-react';

const accents = [
  { bg: 'bg-green/10', ring: 'ring-green/30', text: 'text-green' },
  { bg: 'bg-green/10', ring: 'ring-green/30', text: 'text-green' },
  { bg: 'bg-accent-amber/10', ring: 'ring-accent-amber/30', text: 'text-accent-amber' },
  { bg: 'bg-accent-purple/10', ring: 'ring-accent-purple/30', text: 'text-accent-purple' },
];

export function AboutTeam() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Des experts passionnés..."
            title="L'Équipe Dirigeante"
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM_MEMBERS.map((member, i) => {
            const accent = accents[i % accents.length];
            return (
              <Reveal key={member.id} delay={i * 100}>
                <div className="group rounded-2xl border border-white/6 bg-bg-card p-6 text-center transition-all duration-350 hover:bg-bg-card-hover hover:border-white/10 hover:shadow-card-hover">
                  {/* Avatar */}
                  <div className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full ${accent.bg} ring-2 ${accent.ring}`}>
                    <User className={`h-9 w-9 ${accent.text}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{member.name}</h3>
                  <p className="mt-1 text-sm text-gray-400">{member.role}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
