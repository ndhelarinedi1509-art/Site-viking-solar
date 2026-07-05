import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';
import { FOOTER_QUICK_LINKS, FOOTER_SERVICE_LINKS } from '@/config/routes';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import type { ReactNode } from 'react';

const socialIcons: Record<string, ReactNode> = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.39-2.2 1.88-5.31 2.5-8.11 1.77-2.61-.69-4.81-2.45-5.91-4.88-1.12-2.46-.92-5.46.52-7.72 1.45-2.25 3.91-3.66 6.55-3.83v4.05c-1.22.14-2.41.67-3.21 1.6-1.02 1.18-1.28 2.9-.66 4.31.57 1.32 1.83 2.26 3.25 2.5 1.51.26 3.1-.2 4.1-1.31 1.05-1.15 1.4-2.77 1.35-4.32-.05-6.07-.03-12.15-.03-18.23h3.42z" />
    </svg>
  ),
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/6 bg-bg-primary">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-green/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2.5" />
                <path d="M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z" fill="#22C55E" />
              </svg>
              <span className="text-lg font-semibold text-white">
                Vicking <span className="font-bold text-green">Solar</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">{SITE_CONFIG.description}</p>
            <p className="text-xs text-gray-500">{SITE_CONFIG.slogan}</p>
            <div className="flex gap-3">
              {Object.entries(SITE_CONFIG.socials).map(([key, url]) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={key}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-all hover:border-green/30 hover:bg-green/10 hover:text-green"
                >
                  {socialIcons[key]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Liens Rapides</h4>
            <ul className="space-y-2.5">
              {FOOTER_QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-green">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Nos Services</h4>
            <ul className="space-y-2.5">
              {FOOTER_SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-green">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">Contactez-nous</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Mail className="h-4 w-4 text-green" />
                <a href={`mailto:${SITE_CONFIG.email}`} className="hover:text-green transition-colors">
                  {SITE_CONFIG.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-gray-400">
                <Phone className="h-4 w-4 text-green" />
                <a href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`} className="hover:text-green transition-colors">
                  {SITE_CONFIG.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" />
                <span>{SITE_CONFIG.address}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/6">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-500">{SITE_CONFIG.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
