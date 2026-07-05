'use client';

import Link from 'next/link';
import { Reveal } from '@/components/ui/reveal';
import { SITE_CONFIG } from '@/config/site';
import { ArrowRight, MessageCircle } from 'lucide-react';

export function AboutCTA() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-green/20 bg-bg-card p-8 sm:p-12 lg:p-16">
            {/* Green accent line */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green to-accent-teal" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Passez à l&apos;énergie solaire avec{' '}
                <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
                  Vicking Solar
                </span>
                .
              </h2>
              <p className="mt-4 text-base text-gray-400 leading-relaxed">
                Contactez-nous dès aujourd&apos;hui pour un devis gratuit et personnalisé. Notre
                équipe d&apos;experts est prête à concevoir la solution solaire idéale pour votre
                maison ou entreprise.
              </p>

              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/#contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-green px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
                >
                  Demander un devis
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={SITE_CONFIG.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp contact
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
