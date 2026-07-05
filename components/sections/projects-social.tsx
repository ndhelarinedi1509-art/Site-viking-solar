'use client';

import { SITE_CONFIG } from '@/config/site';
import { Reveal } from '@/components/ui/reveal';

const socialButtons = [
  {
    key: 'facebook',
    label: 'Facebook',
    href: SITE_CONFIG.socials.facebook,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    label: 'Instagram',
    href: SITE_CONFIG.socials.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    key: 'twitter',
    label: 'X (Twitter)',
    href: SITE_CONFIG.socials.twitter,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    href: SITE_CONFIG.socials.tiktok,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.01.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.39-2.2 1.88-5.31 2.5-8.11 1.77-2.61-.69-4.81-2.45-5.91-4.88-1.12-2.46-.92-5.46.52-7.72 1.45-2.25 3.91-3.66 6.55-3.83v4.05c-1.22.14-2.41.67-3.21 1.6-1.02 1.18-1.28 2.9-.66 4.31.57 1.32 1.83 2.26 3.25 2.5 1.51.26 3.1-.2 4.1-1.31 1.05-1.15 1.4-2.77 1.35-4.32-.05-6.07-.03-12.15-.03-18.23h3.42z" />
      </svg>
    ),
  },
];

export function ProjectsSocial() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <Reveal>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Suivez{' '}
            <span className="bg-gradient-to-r from-green to-accent-teal bg-clip-text text-transparent">
              Vicking Solar
            </span>{' '}
            sur nos réseaux sociaux
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {socialButtons.map((social) => (
              <a
                key={social.key}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-medium text-gray-300 transition-all duration-300 hover:border-green/30 hover:bg-green/10 hover:text-green"
              >
                {social.icon}
                {social.label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
