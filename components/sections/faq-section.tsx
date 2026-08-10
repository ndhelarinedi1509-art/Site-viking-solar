'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/constants/faq';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { sectionItems, sectionString } from '@/lib/section-utils';
import { useTranslation } from 'react-i18next';
import type { PageSection } from '@/types';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-premium',
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

interface FaqSectionProps {
  section?: PageSection;
}

export function FaqSection({ section }: FaqSectionProps) {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const dbItems = sectionItems(section);
  const items =
    dbItems.length > 0
      ? dbItems
      : FAQ_ITEMS.map((i) => ({ question: i.question, answer: i.answer }));

  const badge = sectionString(section, 'badge') || t('about.faq.badge');
  const title = sectionString(section, 'title') || section?.title || t('about.faq.title');
  const titleHighlight = sectionString(section, 'titleHighlight') || t('about.faq.titleHighlight');

  return (
    <section className="py-14 sm:py-20 border-t border-border bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-semibold tracking-wider text-green uppercase mb-5">
              {badge}
            </span>
            <h2 className="text-[clamp(1.7rem,3.2vw,2.4rem)] font-bold text-white mb-2 tracking-[-0.02em]">
              {title}{' '}
              {titleHighlight && (
                <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">{titleHighlight}</span>
              )}
            </h2>
          </div>
        </FadeIn>

        <div className="mx-auto max-w-[800px]">
          {items.map((item, index) => (
            <FadeIn key={index} delay={index * 60}>
              <div
                className={cn(
                  'mb-3 overflow-hidden rounded-xl border transition-colors duration-350',
                  activeIndex === index ? 'border-green' : 'border-border',
                )}
              >
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 bg-bg-primary px-6 py-5 text-left"
                >
                  <span className="text-[1.05rem] font-semibold text-white">{item.question}</span>
                  <span className="relative h-6 w-6 shrink-0">
                    <span className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 rounded-sm bg-green transition-transform duration-350" />
                    <span
                      className={cn(
                        'absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 rounded-sm bg-green transition-all duration-350',
                        activeIndex === index ? 'rotate-90 opacity-0' : '',
                      )}
                    />
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-400 ease-in-out"
                  style={{
                    maxHeight: activeIndex === index ? '300px' : '0px',
                  }}
                >
                  <div className="bg-bg-primary px-6 pb-6 text-[0.95rem] text-gray-400 leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
