'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/constants/faq';
import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';

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

export function ContactFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 sm:py-20 bg-bg-elevated">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center mb-14">
            <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-bold text-white mb-4">
              Questions Fréquentes
            </h2>
            <p className="text-[1.1rem] text-gray-400 max-w-[600px] mx-auto leading-relaxed">
              Retrouvez ci-dessous les réponses aux questions les plus courantes concernant nos installations solaires en RDC.
            </p>
          </div>
        </FadeIn>

        <div className="mx-auto max-w-[800px]">
          {FAQ_ITEMS.map((item, index) => (
            <FadeIn key={item.id} delay={index * 80}>
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
                  <span className="text-[1.1rem] font-semibold text-white">{item.question}</span>
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
                  <div className="bg-bg-primary px-6 pb-6 text-[1rem] text-gray-400 leading-relaxed">
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
