'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInView } from '@/hooks/useInView';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils';

const contactSchema = z.object({
  name: z.string().min(1, 'Le nom complet est requis'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  service: z.string().min(1, 'Veuillez sélectionner un service'),
  message: z.string().min(1, 'Le message est requis'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const SERVICES = [
  'Installation Solaire Résidentielle',
  'Solution Solaire Industrielle',
  'Maintenance Électrique',
  'Systèmes Hybrides (Batteries/Secours)',
  'Autre demande',
];

const INFO_ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
      </svg>
    ),
    title: 'Téléphone',
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    title: 'Email',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    title: 'WhatsApp',
    value: 'Discuter en ligne',
    href: SITE_CONFIG.whatsapp,
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    title: 'Adresse',
    value: SITE_CONFIG.address || 'Kinshasa, RDC',
    href: null,
  },
];

function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700 ease-premium', isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function ContactFormSection() {
  const { submit, isLoading } = useFormSubmit('/api/contact', {
    successMessage: 'Message envoyé avec succès ! Nous vous répondrons bientôt.',
    onSuccess: () => reset(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  return (
    <section className="py-20 sm:py-24 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16 items-start">
          {/* LEFT: Info */}
          <FadeIn>
            <div>
              <h2 className="text-[clamp(2rem,4vw,2.5rem)] font-bold text-white mb-6">
                Restons en contact
              </h2>
              <p className="text-base text-gray-400 leading-relaxed mb-10">
                Vous avez un projet solaire résidentiel ou industriel ? Contactez-nous dès aujourd&apos;hui pour bénéficier de notre expertise. Nous sommes basés à Kinshasa et intervenons partout en RDC.
              </p>

              <div className="flex flex-col gap-4">
                {INFO_ITEMS.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-5 rounded-2xl border border-border bg-bg-card p-5 sm:p-6 transition-all duration-350 hover:-translate-y-1 hover:border-green"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green/12 text-green">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[1.1rem] font-semibold text-white mb-1">{item.title}</h4>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.title === 'WhatsApp' ? '_blank' : undefined}
                          rel={item.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                          className="text-[0.95rem] text-gray-400 transition-colors hover:text-green no-underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-[0.95rem] text-gray-400">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* RIGHT: Form */}
          <FadeIn delay={150}>
            <div className="rounded-2xl border border-white/10 bg-[rgba(13,19,34,0.7)] backdrop-blur-xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <h3 className="text-[1.8rem] font-bold text-white mb-8">
                Envoyez un message
              </h3>

              <form onSubmit={handleSubmit(submit)} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-[0.9rem] font-medium text-gray-300 mb-2">
                      Nom complet
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Votre nom"
                      {...register('name')}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-base text-white placeholder:text-gray-500 transition-colors focus:border-green focus:bg-white/[0.08] focus:outline-none"
                    />
                    {errors.name?.message && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[0.9rem] font-medium text-gray-300 mb-2">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+243..."
                      {...register('phone')}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-base text-white placeholder:text-gray-500 transition-colors focus:border-green focus:bg-white/[0.08] focus:outline-none"
                    />
                    {errors.phone?.message && <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[0.9rem] font-medium text-gray-300 mb-2">
                    Adresse Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    {...register('email')}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-base text-white placeholder:text-gray-500 transition-colors focus:border-green focus:bg-white/[0.08] focus:outline-none"
                  />
                  {errors.email?.message && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="service" className="block text-[0.9rem] font-medium text-gray-300 mb-2">
                    Service souhaité
                  </label>
                  <select
                    id="service"
                    {...register('service')}
                    defaultValue=""
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-base text-white transition-colors focus:border-green focus:bg-white/[0.08] focus:outline-none"
                  >
                    <option value="" disabled className="bg-bg-card">Sélectionnez un service</option>
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-bg-card">{s}</option>
                    ))}
                  </select>
                  {errors.service?.message && <p className="mt-1 text-xs text-red-400">{errors.service.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-[0.9rem] font-medium text-gray-300 mb-2">
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    placeholder="Décrivez brièvement votre projet ou votre question..."
                    rows={4}
                    {...register('message')}
                    className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-base text-white placeholder:text-gray-500 transition-colors focus:border-green focus:bg-white/[0.08] focus:outline-none min-h-[120px]"
                  />
                  {errors.message?.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-green px-6 py-4 text-[1.1rem] font-bold text-bg-primary transition-all duration-350 hover:bg-green-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le message'
                  )}
                </button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
