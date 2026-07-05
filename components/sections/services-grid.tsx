'use client';

import { SERVICES } from '@/constants/services';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeader } from '@/components/ui/section-header';
import { SITE_CONFIG } from '@/config/site';
import { Sun, FileText, Wrench, Factory, Home, ClipboardList, Check } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  sun: <Sun className="h-6 w-6" />,
  'file-text': <FileText className="h-6 w-6" />,
  wrench: <Wrench className="h-6 w-6" />,
  industrial: <Factory className="h-6 w-6" />,
  home: <Home className="h-6 w-6" />,
  'clipboard-list': <ClipboardList className="h-6 w-6" />,
};

const colorMap: Record<string, string> = {
  blue: 'bg-accent-blue/10 text-accent-blue border-accent-blue/20',
  green: 'bg-green/10 text-green border-green/20',
  orange: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
  purple: 'bg-accent-purple/10 text-accent-purple border-accent-purple/20',
  teal: 'bg-accent-teal/10 text-accent-teal border-accent-teal/20',
  amber: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
};

const glowMap: Record<string, string> = {
  blue: 'bg-accent-blue/5',
  green: 'bg-green/5',
  orange: 'bg-accent-orange/5',
  purple: 'bg-accent-purple/5',
  teal: 'bg-accent-teal/5',
  amber: 'bg-accent-amber/5',
};

const tagColorMap: Record<string, string> = {
  blue: 'bg-accent-blue/10 text-accent-blue',
  green: 'bg-green/10 text-green',
  orange: 'bg-accent-orange/10 text-accent-orange',
  purple: 'bg-accent-purple/10 text-accent-purple',
  teal: 'bg-accent-teal/10 text-accent-teal',
  amber: 'bg-accent-amber/10 text-accent-amber',
};

export function ServicesGrid() {
  return (
    <section id="services-section" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            eyebrow="Ce que nous offrons"
            title="Solutions Énergétiques"
            description="Une gamme complète de services pour répondre à tous vos besoins en énergie solaire, de l'étude à la maintenance."
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => (
            <Reveal key={service.id} delay={i * 100}>
              <div
                id={service.id}
                className={`group relative h-full overflow-hidden rounded-2xl border border-white/5 bg-bg-card p-6 transition-all duration-300 hover:border-green/20 hover:shadow-card-hover ${
                  service.id === 'systemes-hybrides' ? 'border-green/15' : ''
                }`}
              >
                <div
                  className={`pointer-events-none absolute -top-12 -right-12 h-32 w-32 rounded-full blur-[60px] ${
                    service.id === 'systemes-hybrides'
                      ? 'bg-green/15'
                      : glowMap[service.color]
                  }`}
                />

                {service.id === 'systemes-hybrides' && (
                  <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-green/10 px-3 py-1 text-xs font-medium text-green">
                    ⭐ Le plus demandé
                  </span>
                )}

                <div className="relative z-10">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${colorMap[service.color]}`}
                  >
                    {iconMap[service.icon]}
                  </div>

                  <span
                    className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium ${tagColorMap[service.color]}`}
                  >
                    {service.tag}
                  </span>

                  <h3 className="mt-3 text-lg font-semibold text-white">{service.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                    {service.description}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <a
                      href={SITE_CONFIG.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-green transition-colors hover:text-green-dark"
                    >
                      Demander un devis
                      <svg
                        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
