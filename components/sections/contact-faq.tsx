'use client';

import { useState } from 'react';
import { FAQ_ITEMS } from '@/constants/faq';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';
import { Plus, Minus } from 'lucide-react';

export function ContactFAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            title="Questions Fréquentes"
            description="Trouvez rapidement les réponses à vos interrogations les plus courantes."
          />
        </Reveal>

        <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-bg-card">
          {FAQ_ITEMS.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <div>
                <button
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <span className="text-sm font-medium text-white">{item.question}</span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition-colors group-hover:bg-green/10">
                    {activeIndex === index ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: activeIndex === index ? '200px' : '0px',
                  }}
                >
                  <p className="px-6 pb-5 text-sm text-gray-400 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
