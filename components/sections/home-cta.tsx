'use client';

import { SITE_CONFIG } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export function HomeCTA() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-green/20 bg-bg-card p-8 sm:p-12 lg:p-16">
            {/* Green accent line */}
            <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-green to-accent-teal" />

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                Prêt à passer à l&apos;énergie solaire ?
              </h2>
              <p className="mt-4 text-base text-gray-400 leading-relaxed">
                Contactez-nous dès aujourd&apos;hui pour un devis gratuit et personnalisé.
              </p>

              {/* Contact details */}
              <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-10">
                <a
                  href={`tel:${SITE_CONFIG.phone}`}
                  className="group flex items-center gap-3 text-gray-300 transition-colors hover:text-green"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-green transition-colors group-hover:bg-green/20">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs text-gray-500">Téléphone</span>
                    <span className="text-sm font-medium">{SITE_CONFIG.phone}</span>
                  </div>
                </a>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="group flex items-center gap-3 text-gray-300 transition-colors hover:text-green"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green/10 text-green transition-colors group-hover:bg-green/20">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs text-gray-500">Email</span>
                    <span className="text-sm font-medium">{SITE_CONFIG.email}</span>
                  </div>
                </a>
              </div>

              {/* WhatsApp button */}
              <div className="mt-10">
                <a
                  href={SITE_CONFIG.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)] active:scale-[0.98]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
