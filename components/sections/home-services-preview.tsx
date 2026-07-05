'use client';

import Link from 'next/link';
import { ChevronRight, Sun, FileText, Wrench, Factory, Home, ClipboardList } from 'lucide-react';
import { SERVICES } from '@/constants/services';
import { Reveal } from '@/components/ui/reveal';

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

export function HomeServicesPreview() {
  const previewServices = SERVICES.slice(0, 6);

  return (
    <section className="relative py-24 sm:py-32 bg-bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="mb-3 inline-block rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-medium tracking-wider text-green uppercase">
              Services
            </span>
            <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Nos Solutions Énergétiques
            </h2>
            <p className="mt-4 text-base text-gray-400 leading-relaxed">
              Une gamme complète de services pour répondre à tous vos besoins en énergie solaire,
              de l&apos;étude à la maintenance.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewServices.map((service, i) => (
            <Reveal key={service.id} delay={i * 100}>
              <div className="group h-full rounded-2xl border border-white/5 bg-bg-card p-6 transition-all duration-300 hover:border-green/20 hover:shadow-card-hover">
                <div
                  className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border ${colorMap[service.color]}`}
                >
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-green transition-colors hover:text-green-dark"
            >
              Voir tous nos services en détail
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
