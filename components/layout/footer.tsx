'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { SITE_CONFIG } from '@/config/site';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-bg-card/90 backdrop-blur-md">
      {/* Green glow top line */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-green/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <Image
                src="/logo.webp"
                alt="Viking Solar"
                className="h-8 w-auto object-contain"
                width={32}
                height={32}
              />
              <span className="text-lg font-normal text-white tracking-tight">
                Vicking <span className="font-bold">Solar</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-2 max-w-xs">
              {t('footer.tagline')}
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              <a href={SITE_CONFIG.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 transition-all duration-300 hover:border-green/30 hover:bg-green/10 hover:text-green">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
              </a>
              <a href={SITE_CONFIG.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 transition-all duration-300 hover:border-green/30 hover:bg-green/10 hover:text-green">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>
              </a>
              <a href={SITE_CONFIG.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="X" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 transition-all duration-300 hover:border-green/30 hover:bg-green/10 hover:text-green">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={SITE_CONFIG.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-gray-400 transition-all duration-300 hover:border-green/30 hover:bg-green/10 hover:text-green">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.39-2.2 1.88-5.31 2.5-8.11 1.77-2.61-.69-4.81-2.45-5.91-4.88-1.12-2.46-.92-5.46.52-7.72 1.45-2.25 3.91-3.66 6.55-3.83v4.05c-1.22.14-2.41.67-3.21 1.6-1.02 1.18-1.28 2.9-.66 4.31.57 1.32 1.83 2.26 3.25 2.5 1.51.26 3.1-.2 4.1-1.31 1.05-1.15 1.4-2.77 1.35-4.32-.05-6.07-.03-12.15-.03-18.23h3.42z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.home')}</Link></li>
              <li><Link href="/actualites" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.actualites')}</Link></li>
              <li><Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.about')}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.services')}</Link></li>
              <li><Link href="/projects" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.projects')}</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.contact')}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.services')}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.servicesList.installation')}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.servicesList.hybrid')}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.servicesList.maintenance')}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.servicesList.industrial')}</Link></li>
              <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.servicesList.residential')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-green"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-green transition-colors">{SITE_CONFIG.email}</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-green"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className="hover:text-green transition-colors">{SITE_CONFIG.phone}</a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 shrink-0 text-green"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>{SITE_CONFIG.address}</span>
              </li>
            </ul>
            {/* Newsletter */}
            <form
              className="mt-4 flex items-center gap-2 rounded-full border border-border bg-white/5 p-1.5 pl-4"
              onSubmit={(e) => { e.preventDefault(); alert('Merci pour votre inscription !'); }}
            >
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                required
                className="flex-1 bg-transparent text-sm text-white placeholder:text-gray-500 outline-none border-none"
              />
              <button
                type="submit"
                aria-label={t('footer.newsletter.button')}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-green text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">&copy; {currentYear} Vicking Solar. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
