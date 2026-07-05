'use client';

import { Reveal } from '@/components/ui/reveal';
import { CheckCircle } from 'lucide-react';

const highlights = [
  'Ingénierie complète et fiable',
  'Équipements de pointe certifiés',
  'Support 24/7 toute l\'année',
];

export function HomeAboutPreview() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left - Content */}
          <Reveal direction="left">
            <div>
              <span className="mb-3 inline-block rounded-full border border-green/20 bg-green/5 px-4 py-1.5 text-xs font-medium tracking-wider text-green uppercase">
                À propos
              </span>
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Expertise locale,{' '}
                <span className="bg-gradient-to-r from-green to-accent-blue bg-clip-text text-transparent">
                  Standards internationaux
                </span>
              </h2>
              <p className="mt-6 text-base text-gray-400 leading-relaxed">
                Viking Solar est une équipe d&apos;ingénieurs et techniciens congolais passionnés par
                l&apos;énergie solaire. Basée à Kinshasa, nous mettons notre expertise locale au
                service de solutions durables pour tout le Congo.
              </p>
              <p className="mt-4 text-base text-gray-400 leading-relaxed">
                Chaque projet est traité avec rigueur, de l&apos;étude initiale à la mise en service,
                en utilisant des équipements certifiés aux standards internationaux.
              </p>

              {/* Checkmarks */}
              <ul className="mt-8 space-y-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green" />
                    <span className="text-sm text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Right - Image placeholder */}
          <Reveal direction="right">
            <div className="flex items-center justify-center">
              <div className="relative flex h-[360px] w-full max-w-md items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-bg-card to-bg-elevated border border-white/5">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                  <svg
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm">Photo de l&apos;équipe</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
