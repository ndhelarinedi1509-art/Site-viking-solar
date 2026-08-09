'use client';

import { Reveal } from '@/components/ui/reveal';
import { Leaf, TrendingDown, Headphones, Zap, Gauge, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PageSection } from '@/types';
import { sectionItems } from '@/lib/section-utils';

const iconMap: Record<string, React.ReactNode> = {
  green: <Leaf className="h-6 w-6 text-green" />,
  blue: <TrendingDown className="h-6 w-6 text-accent-blue" />,
  orange: <Headphones className="h-6 w-6 text-accent-orange" />,
  teal: <Zap className="h-6 w-6 text-accent-teal" />,
  purple: <Gauge className="h-6 w-6 text-accent-purple" />,
  amber: <ShieldCheck className="h-6 w-6 text-accent-amber" />,
};

interface HomeBenefitsProps {
  section?: PageSection;
}

export function HomeBenefits({ section }: HomeBenefitsProps) {
  const { t } = useTranslation();

  const title = section?.title || t('home.benefits.badge');
  const items = sectionItems(section);

  const benefitItems =
    items.length > 0
      ? items.slice(0, 5)
      : (t('home.benefits.items', { returnObjects: true }) as Array<{ title: string; description: string; iconColor: string }> | undefined) ?? [];

  return (
    <section className="relative py-20 sm:py-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {title}
            </h2>
          </div>
        </Reveal>

        {benefitItems.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {benefitItems.map((benefit, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="group h-full rounded-2xl border border-border bg-bg-card p-6 text-center transition-all duration-500 hover:-translate-y-1.5 hover:scale-[1.02] hover:border-green/25 hover:shadow-card-hover">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated">
                    {iconMap[benefit.iconColor ?? ''] ?? <Zap className="h-6 w-6 text-green" />}
                  </div>
                  <h3 className="text-sm font-semibold text-white">{benefit.title}</h3>
                  <p className="mt-2 text-xs text-gray-500 leading-relaxed">{benefit.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
