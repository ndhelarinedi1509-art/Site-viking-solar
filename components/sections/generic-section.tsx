import { Reveal } from '@/components/ui/reveal';
import { CheckCircle2, ArrowRight, Leaf, TrendingDown, Headphones, Zap, Gauge, ShieldCheck } from 'lucide-react';
import type { PageSection } from '@/types';
import {
  sectionString,
  sectionItems,
  sectionStats,
  sectionHighlights,
  sectionButton,
} from '@/lib/section-utils';

const iconMap: Record<string, React.ReactNode> = {
  green: <Leaf className="h-6 w-6 text-green" />,
  blue: <TrendingDown className="h-6 w-6 text-accent-blue" />,
  orange: <Headphones className="h-6 w-6 text-accent-orange" />,
  teal: <Zap className="h-6 w-6 text-accent-teal" />,
  purple: <Gauge className="h-6 w-6 text-accent-purple" />,
  amber: <ShieldCheck className="h-6 w-6 text-accent-amber" />,
};

interface GenericSectionProps {
  section?: PageSection;
}

export function GenericSection({ section }: GenericSectionProps) {
  if (!section) return null;

  const type = section.section_type;
  const title = section.title || sectionString(section, 'title');
  const subtitle = section.subtitle || sectionString(section, 'subtitle');
  const description = section.description || sectionString(section, 'description');
  const badge = sectionString(section, 'badge');
  const images = section.images ?? [];
  const items = sectionItems(section);
  const highlights = sectionHighlights(section);
  const stats = sectionStats(section);
  const button = sectionButton(section);

  const showHeader = Boolean(badge || title || subtitle);
  const showItems = items.length > 0 && (type === 'cards' || type === 'benefits' || type === 'team' || type === 'faq');
  const showImages = images.length > 0 && (type === 'gallery' || type === 'image-text' || type === 'hero' || type === 'text');

  return (
    <section className="relative py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="space-y-10">
            {showHeader && (
              <div className="max-w-2xl">
                {badge && (
                  <span className="inline-block rounded-full bg-green px-3 py-1 text-xs font-semibold text-bg-primary uppercase tracking-wider mb-4">
                    {badge}
                  </span>
                )}
                {title && <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">{title}</h2>}
                {subtitle && <p className="mt-3 text-base font-semibold text-green">{subtitle}</p>}
              </div>
            )}

            {description && (
              <p className="max-w-3xl text-base text-gray-400 leading-relaxed whitespace-pre-line">{description}</p>
            )}

            {highlights.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2 max-w-3xl">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-green shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {stats.length > 0 && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-bg-card p-6 text-center">
                    <span className="text-3xl font-bold text-white">
                      {s.value}{s.suffix}
                    </span>
                    <p className="mt-1 text-xs text-gray-500">{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            {showItems && (
              <div className={type === 'faq' ? 'space-y-3 max-w-3xl' : 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'}>
                {items.map((item, i) => {
                  if (type === 'faq') {
                    return (
                      <details key={i} className="group rounded-2xl border border-border bg-bg-card px-5 py-4">
                        <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-sm font-semibold text-white">
                          {item.question}
                          <span className="text-green transition-transform group-open:rotate-45">+</span>
                        </summary>
                        <p className="mt-3 text-sm text-gray-400 leading-relaxed">{item.answer}</p>
                      </details>
                    );
                  }
                  if (type === 'team') {
                    return (
                      <div key={i} className="rounded-2xl border border-border bg-bg-card p-6 text-center">
                        <h3 className="text-sm font-semibold text-white">{item.name}</h3>
                        <p className="mt-1 text-xs text-green">{item.role}</p>
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="group h-full rounded-2xl border border-border bg-bg-card p-6 transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-green/25 hover:shadow-card-hover">
                      {type === 'benefits' && (
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated">
                          {iconMap[item.iconColor ?? ''] ?? <Zap className="h-6 w-6 text-green" />}
                        </div>
                      )}
                      <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                      <p className="mt-2 text-xs text-gray-500 leading-relaxed">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {showImages && (
              <div className={images.length === 1 ? 'max-w-3xl' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}>
                {images.map((img, i) => (
                  <figure key={i}>
                    <img
                      src={img.url}
                      alt={img.alt ?? ''}
                      className="w-full h-64 rounded-2xl object-cover border border-border"
                    />
                    {img.caption && <figcaption className="mt-2 text-xs text-gray-500">{img.caption}</figcaption>}
                  </figure>
                ))}
              </div>
            )}

            {button && (
              <a
                href={button.href}
                className="group inline-flex items-center gap-2 rounded-full bg-green px-7 py-3 text-sm font-semibold text-bg-primary hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98]"
              >
                {button.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
