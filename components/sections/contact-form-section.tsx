'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useInView } from '@/hooks/useInView';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

const contactSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, t('formErrors.name')),
    phone: z.string().min(1, t('formErrors.phone')),
    email: z.string().min(1, t('formErrors.email')).email(t('formErrors.emailInvalid')),
    service: z.string().min(1, t('formErrors.service')),
    message: z.string().min(1, t('formErrors.message')),
  });

type ContactFormData = z.infer<ReturnType<typeof contactSchema>>;

const serviceOptions = [
  { key: 'installation', labelKey: 'contact.form.serviceOptions.installation' },
  { key: 'hybrid', labelKey: 'contact.form.serviceOptions.hybrid' },
  { key: 'maintenance', labelKey: 'contact.form.serviceOptions.maintenance' },
  { key: 'industrial', labelKey: 'contact.form.serviceOptions.industrial' },
  { key: 'residential', labelKey: 'contact.form.serviceOptions.residential' },
  { key: 'audit', labelKey: 'contact.form.serviceOptions.audit' },
  { key: 'other', labelKey: 'contact.form.serviceOptions.other' },
];

const INFO_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
      </svg>
    ),
    titleKey: 'contact.info.phone',
    value: SITE_CONFIG.phone,
    href: `tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
    titleKey: 'contact.info.email',
    value: SITE_CONFIG.email,
    href: `mailto:${SITE_CONFIG.email}`,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    titleKey: 'contact.info.whatsapp',
    valueKey: 'contact.info.chatOnline',
    href: SITE_CONFIG.whatsapp,
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    titleKey: 'contact.info.address',
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

interface ContactFormSectionProps {
  mapUrl?: string;
  embedUrl?: string;
}

export function ContactFormSection({ mapUrl, embedUrl }: ContactFormSectionProps) {
  const { t } = useTranslation();
  const { submit, isLoading } = useFormSubmit('/api/contact', {
    successMessage: t('contact.form.success'),
    onSuccess: () => reset(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema(t)),
  });

  return (
    <section className="py-12 sm:py-14 border-t border-border bg-bg-primary">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <FadeIn>
          <div className="text-center mb-8">
            <h2 className="text-[clamp(1.4rem,2.6vw,1.8rem)] font-bold text-white mb-2">
              {t('contact.form.title')}
            </h2>
            <p className="text-sm text-gray-400 max-w-[560px] mx-auto leading-relaxed">
              {t('contact.form.description')}
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.05fr] lg:gap-7 items-start">
          {/* LEFT: Geolocation + contact info at bottom */}
          <FadeIn>
            <div className="overflow-hidden rounded-2xl border border-border bg-bg-card">
              <div className="p-4 border-b border-border">
                <h3 className="text-base font-bold text-white">{t('contact.map.title')}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{t('contact.map.subtitle')}</p>
              </div>
              <div className="relative w-full" style={{ height: 'clamp(190px, 28vw, 250px)' }}>
                <iframe
                  src={embedUrl || 'https://maps.google.com/maps?q=-4.4013038,15.3227446&z=12&output=embed'}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  title={t('contact.map.title')}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>

              {/* Contact info at bottom of map card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                {INFO_ITEMS.map((item) => (
                  <div key={item.titleKey} className="flex items-center gap-3 bg-bg-card p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green/12 text-green">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[0.7rem] font-semibold text-white mb-0.5">{t(item.titleKey)}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.titleKey === 'contact.info.whatsapp' ? '_blank' : undefined}
                          rel={item.titleKey === 'contact.info.whatsapp' ? 'noopener noreferrer' : undefined}
                          className="text-xs text-gray-400 transition-colors hover:text-green no-underline block truncate"
                        >
                          {item.valueKey ? t(item.valueKey) : item.value}
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400 truncate">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 flex flex-wrap items-center justify-between gap-2 border-t border-border bg-white/2">
                <a
                  href={mapUrl || 'https://maps.app.goo.gl/voTqLWVc3Qxdw2sa7'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.7rem] font-medium text-green hover:text-green-dark transition-colors"
                >
                  {t('contact.map.openLarger')}
                </a>
              </div>
            </div>
          </FadeIn>

          {/* RIGHT: Form (compact) */}
          <FadeIn delay={150}>
            <div className="rounded-2xl border border-white/10 bg-[rgba(13,19,34,0.7)] backdrop-blur-xl p-5 sm:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <h3 className="text-lg font-bold text-white mb-5">
                {t('contact.form.badge')}
              </h3>

              <form onSubmit={handleSubmit(submit)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-[0.85rem] font-medium text-gray-300 mb-1.5">
                      {t('contact.form.name')}
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder={t('contact.form.namePlaceholder')}
                      {...register('name')}
                      className="w-full rounded-lg border border-white/10 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green focus:bg-gray-50 focus:outline-none"
                    />
                    {errors.name?.message && <p className="mt-1 text-[0.7rem] text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-[0.85rem] font-medium text-gray-300 mb-1.5">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder={t('contact.form.phonePlaceholder')}
                      {...register('phone')}
                      className="w-full rounded-lg border border-white/10 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green focus:bg-gray-50 focus:outline-none"
                    />
                    {errors.phone?.message && <p className="mt-1 text-[0.7rem] text-red-400">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-[0.85rem] font-medium text-gray-300 mb-1.5">
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder={t('contact.form.emailPlaceholder')}
                    {...register('email')}
                    className="w-full rounded-lg border border-white/10 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green focus:bg-gray-50 focus:outline-none"
                  />
                  {errors.email?.message && <p className="mt-1 text-[0.7rem] text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="service" className="block text-[0.85rem] font-medium text-gray-300 mb-1.5">
                    {t('contact.form.service')}
                  </label>
                  <select
                    id="service"
                    {...register('service')}
                    defaultValue=""
                    className="w-full rounded-lg border border-white/10 bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors focus:border-green focus:bg-gray-50 focus:outline-none"
                  >
                    <option value="" disabled className="bg-bg-card">{t('contact.form.servicePlaceholder')}</option>
                    {serviceOptions.map((s) => (
                      <option key={s.key} value={s.key} className="bg-bg-card">{t(s.labelKey)}</option>
                    ))}
                  </select>
                  {errors.service?.message && <p className="mt-1 text-[0.7rem] text-red-400">{errors.service.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className="block text-[0.85rem] font-medium text-gray-300 mb-1.5">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    placeholder={t('contact.form.messagePlaceholder')}
                    rows={3}
                    {...register('message')}
                    className="w-full resize-y rounded-lg border border-white/10 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:border-green focus:bg-gray-50 focus:outline-none min-h-[90px]"
                  />
                  {errors.message?.message && <p className="mt-1 text-[0.7rem] text-red-400">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-lg bg-green px-6 py-3 text-sm font-bold text-bg-primary transition-all duration-350 hover:bg-green-dark hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    t('contact.form.submit')
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
