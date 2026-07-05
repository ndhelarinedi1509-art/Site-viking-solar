'use client';

import Link from 'next/link';
import { SERVICES } from '@/constants/services';
import { Reveal } from '@/components/ui/reveal';

const iconMap: Record<string, React.ReactNode> = {
  sun: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M3.55 18.54l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8zM11 22.45h2V19.5h-2v2.95zM4 10.5H1v2h3v-2zm9-9.95h-2v3h2v-3zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"/></svg>,
  'file-text': <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 9V3.5L18.5 9H13zM7 17l2-2 2 2 4-4 2 2v4H7v-2z"/></svg>,
  wrench: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/></svg>,
  industrial: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-3.87 0-7-3.13-7-7h2c0 2.76 2.24 5 5 5s5-2.24 5-5h2c0 3.87-3.13 7-7 7zm0-4c-1.66 0-3-1.34-3-3h2c0 .55.45 1 1 1s1-.45 1-1h2c0 1.66-1.34 3-3 3z"/></svg>,
  home: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9l-7-7-7 7h4v7h6V9h4zm-7 11c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2zM4 19h16v2H4z"/></svg>,
  'clipboard-list': <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
};

const colorMap: Record<string, { bg: string; color: string; border: string }> = {
  blue: { bg: 'bg-accent-blue/15', color: 'text-accent-blue', border: 'hover:border-accent-blue/30' },
  green: { bg: 'bg-green/15', color: 'text-green', border: 'hover:border-green/30' },
  orange: { bg: 'bg-accent-orange/15', color: 'text-accent-orange', border: 'hover:border-accent-orange/30' },
  purple: { bg: 'bg-accent-purple/15', color: 'text-accent-purple', border: 'hover:border-accent-purple/30' },
  teal: { bg: 'bg-accent-teal/15', color: 'text-accent-teal', border: 'hover:border-accent-teal/30' },
  amber: { bg: 'bg-accent-amber/15', color: 'text-accent-amber', border: 'hover:border-accent-amber/30' },
};

export function HomeServicesPreview() {
  return (
    <section className="relative py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Nos Solutions Énergétiques</h2>
            <p className="mt-4 text-base text-gray-400">
              Une gamme complète de services pour répondre à tous les besoins énergétiques, en résidentiel et industriel.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((service, i) => (
            <Reveal key={service.id} delay={i * 80}>
              <div className={`group h-full rounded-2xl border border-border bg-bg-card p-6 md:p-7 transition-all duration-500 ${colorMap[service.color]?.border || 'hover:border-green/30'} hover:-translate-y-2 hover:scale-[1.02] hover:shadow-card-hover`}>
                <div className={`mb-5 flex h-13 w-13 items-center justify-center rounded-xl ${colorMap[service.color]?.bg || 'bg-green/15'} ${colorMap[service.color]?.color || 'text-green'}`}>
                  {iconMap[service.icon]}
                </div>
                <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{service.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 rounded-full border border-border-light bg-transparent px-6 py-2.5 text-sm font-semibold text-green transition-all duration-300 hover:border-green/40 hover:bg-green/5"
            >
              Voir tous nos services en détail
              <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
