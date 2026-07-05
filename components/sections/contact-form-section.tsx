'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { Reveal } from '@/components/ui/reveal';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { SITE_CONFIG } from '@/config/site';

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
  'Systèmes Hybrides',
  'Autre',
];

const INFO_ITEMS = [
  {
    icon: Phone,
    title: 'Téléphone',
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`,
  },
  {
    icon: Mail,
    title: 'Email',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: SITE_CONFIG.phone,
    href: SITE_CONFIG.whatsapp,
  },
  {
    icon: MapPin,
    title: 'Localisation',
    value: SITE_CONFIG.address,
    href: null,
  },
];

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
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeader
            title="Contactez-nous"
            titleHighlight="Directement"
            description="Remplissez le formulaire ci-dessous ou contactez-nous via nos canaux. Nous répondons dans les plus brefs délais."
          />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-2xl border border-white/10 bg-bg-card p-8">
              <h3 className="text-2xl font-bold text-white">Restons en contact</h3>
              <p className="mt-3 text-sm text-gray-400 leading-relaxed">
                N&apos;hésitez pas à nous joindre par l&apos;un de ces moyens. Notre équipe
                s&apos;engage à vous répondre dans les meilleurs délais pour vous accompagner
                dans votre transition énergétique.
              </p>

              <div className="mt-8 space-y-6">
                {INFO_ITEMS.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green/10 text-green">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-300">{item.title}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.title === 'WhatsApp' ? '_blank' : undefined}
                          rel={item.title === 'WhatsApp' ? 'noopener noreferrer' : undefined}
                          className="text-sm text-white hover:text-green transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm text-white">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form
              onSubmit={handleSubmit(submit)}
              className="rounded-2xl border border-white/10 bg-bg-card p-8 space-y-5"
            >
              <Input
                label="Nom complet"
                placeholder="Votre nom complet"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Téléphone"
                type="tel"
                placeholder="+243 ..."
                error={errors.phone?.message}
                {...register('phone')}
              />
              <Input
                label="Email"
                type="email"
                placeholder="votre@email.com"
                error={errors.email?.message}
                {...register('email')}
              />

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">
                  Service souhaité
                </label>
                <select
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
                  {...register('service')}
                >
                  <option value="" className="bg-bg-card">
                    Sélectionnez un service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s} value={s} className="bg-bg-card">
                      {s}
                    </option>
                  ))}
                </select>
                {errors.service?.message && (
                  <p className="text-xs text-accent-red">{errors.service.message}</p>
                )}
              </div>

              <Textarea
                label="Message"
                placeholder="Décrivez votre projet ou posez votre question..."
                error={errors.message?.message}
                {...register('message')}
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                Envoyer le message
              </Button>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
