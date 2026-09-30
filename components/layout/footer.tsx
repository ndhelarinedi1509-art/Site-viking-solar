'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SITE_CONFIG } from '@/config/site';

/* ─── Icônes réseaux sociaux du fournisseur ─────────────────────────── */
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

/* ─── Modal Fournisseur ──────────────────────────────────────────────── */
function SupplierModal({ onClose }: { onClose: () => void }) {
  const socials = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/share/1FiG9dXvx8/?mibextid=wwXIfr',
      icon: <FacebookIcon />,
      color: 'hover:bg-[#1877F2]/20 hover:border-[#1877F2]/50 hover:text-[#1877F2]',
      bg: 'bg-[#1877F2]',
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/reylegend_?stkn=MTFzajI2c2VleG5zOQ%3D%3D&utm_source=qr',
      icon: <InstagramIcon />,
      color: 'hover:bg-[#E1306C]/20 hover:border-[#E1306C]/50 hover:text-[#E1306C]',
      bg: 'bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
    },
    {
      label: 'X (Twitter)',
      href: 'https://x.com/ndhelarinedi1?s=11',
      icon: <XIcon />,
      color: 'hover:bg-white/10 hover:border-white/30 hover:text-white',
      bg: 'bg-black',
    },
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/rinedi-ndhela-5b732331a?utm_source=share_via&utm_content=profile&utm_medium=member_ios',
      icon: <LinkedInIcon />,
      color: 'hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 hover:text-[#0A66C2]',
      bg: 'bg-[#0A66C2]',
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      >
        {/* Card */}
        <div
          className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl"
          style={{
            background: 'linear-gradient(145deg, #0f1a0f 0%, #111b11 50%, #0a150a 100%)',
            border: '1px solid rgba(74,222,128,0.15)',
            animation: 'supplierFadeIn 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow top */}
          <div
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(74,222,128,0.6),transparent)' }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-all duration-200 hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Header band */}
          <div
            className="h-24 w-full"
            style={{
              background: 'linear-gradient(135deg, #0d2b0d 0%, #1a4d1a 50%, #0d2b0d 100%)',
            }}
          >
            {/* Decorative dots */}
            <div className="absolute top-4 left-4 h-1.5 w-1.5 rounded-full bg-green-400/40" />
            <div className="absolute top-6 left-8 h-1 w-1 rounded-full bg-green-400/20" />
            <div className="absolute top-5 right-12 h-1 w-1 rounded-full bg-green-400/30" />
          </div>

          {/* Avatar */}
          <div className="flex justify-center -mt-14 mb-4 px-6">
            <div
              className="relative h-28 w-28 rounded-full overflow-hidden ring-4"
              style={{ boxShadow: '0 0 0 4px rgba(74,222,128,0.3), 0 0 24px rgba(74,222,128,0.2)' }}
            >
              <Image
                src="/supplier-photo.jpg"
                alt="N'dhela Rinedi"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>
          </div>

          {/* Info */}
          <div className="px-6 pb-6 text-center">
            {/* Badge */}
            <div className="flex justify-center mb-3">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{
                  background: 'rgba(74,222,128,0.1)',
                  border: '1px solid rgba(74,222,128,0.3)',
                  color: '#4ade80',
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                Fournisseur
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">N&apos;dhela Rinedi</h2>
            <p className="text-sm font-medium text-green-400 mb-1">@Reylegend_</p>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Informaticien, Développeur &amp; Designer Infographiste
            </p>

            {/* Divider */}
            <div
              className="mx-auto mb-5 h-px w-2/3"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(74,222,128,0.25),transparent)' }}
            />

            {/* Socials */}
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Réseaux sociaux
            </p>
            <div className="flex justify-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  title={s.label}
                  className={`group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition-all duration-300 ${s.color}`}
                >
                  {/* Tooltip */}
                  <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none border border-white/10">
                    {s.label}
                  </span>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Glow bottom */}
          <div
            className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-1/2"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(74,222,128,0.3),transparent)' }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes supplierFadeIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────── */
export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [showSupplier, setShowSupplier] = useState(false);

  return (
    <>
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
                  Viking <span className="font-bold">Solar</span>
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
                <li><Link href="/services" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.services')}</Link></li>
                <li><Link href="/projects" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.projects')}</Link></li>
                <li><Link href="/about" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.about')}</Link></li>
                <li><Link href="/about#contact" className="text-sm text-gray-400 transition-colors hover:text-green">{t('footer.links.contact')}</Link></li>
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
                className="mt-4 flex items-center gap-2 rounded-full border border-border bg-white p-1.5 pl-4"
                onSubmit={(e) => { e.preventDefault(); alert('Merci pour votre inscription !'); }}
              >
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  required
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none border-none"
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Copyright (cliquable vers admin) */}
            <Link
              href="/admin/login"
              className="text-xs text-gray-500 cursor-default"
              aria-label="Administration"
              title=""
            >
              &copy; {currentYear} Viking Solar. {t('footer.rights')}
            </Link>

            {/* ── Fournisseur ── */}
            <button
              id="btn-fournisseur"
              onClick={() => setShowSupplier(true)}
              className="group flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-all duration-300 hover:text-green-400"
              style={{
                border: '1px solid rgba(74,222,128,0.0)',
                background: 'transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(74,222,128,0.25)';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(74,222,128,0.06)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.border = '1px solid rgba(74,222,128,0.0)';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
            >
              {/* Mini avatar */}
              <span className="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full ring-1 ring-green-400/30">
                <Image src="/supplier-photo.jpg" alt="Fournisseur" fill className="object-cover" sizes="20px" />
              </span>
              <span className="transition-colors duration-300 group-hover:text-green-400">
                Fournisseur
              </span>
              <svg
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className="h-3 w-3 opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5"
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {showSupplier && <SupplierModal onClose={() => setShowSupplier(false)} />}
    </>
  );
}
