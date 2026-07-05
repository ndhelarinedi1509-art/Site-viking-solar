'use client';

import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { MapPin } from 'lucide-react';

export function ContactMap() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            title="Nos Bureaux à"
            titleHighlight="Kinshasa"
            description="Retrouvez-nous au cœur de Kinshasa, prêts à vous servir."
          />
        </Reveal>

        <Reveal delay={150}>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-bg-card">
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10 text-green">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Nos Bureaux à Kinshasa</h3>
              <p className="max-w-sm text-sm text-gray-400">
                Bientôt disponible sur la carte interactive
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
