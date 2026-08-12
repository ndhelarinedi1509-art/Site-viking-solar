'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageToggle } from '@/components/ui/language-toggle';

export function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const NAV_LINKS = [
    { href: '/', label: t('nav.home') },
    { href: '/actualites', label: t('nav.actualites') },
    { href: '/services', label: t('nav.services') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/about', label: t('nav.about') },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-350 ${
          scrolled
            ? 'bg-bg-primary/95 backdrop-blur-xl border-b border-border shadow-lg'
            : 'bg-bg-primary/80 backdrop-blur-xl border-b border-border'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group" aria-label="Viking Solar Home">
              <Image
                src="/logo.webp"
                alt="Viking Solar"
                className="h-9 w-auto object-contain"
                width={36}
                height={36}
                priority
              />
              <span className="text-lg font-normal text-white tracking-tight">
                Vicking <span className="font-bold">Solar</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-green text-bg-primary font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right side: Language toggle + Theme Toggle + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Link
                href="/about#contact"
                className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
              >
                {t('nav.freeQuote')}
              </Link>
            </div>

            {/* Mobile hamburger only - toggles moved inside drawer */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                aria-label={t('nav.menu')}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  {mobileOpen ? (
                    <>
                      <path d="M18 6L6 18" />
                      <path d="M6 6l12 12" />
                    </>
                  ) : (
                    <>
                      <path d="M4 6h16" />
                      <path d="M4 12h16" />
                      <path d="M4 18h16" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile right-side drawer (70% width) */}
      <div className="lg:hidden">
        {/* Overlay */}
        <div
          onClick={() => setMobileOpen(false)}
          aria-hidden
          style={{ backgroundColor: 'var(--drawer-overlay)' }}
          className={`fixed inset-0 z-40 transition-opacity duration-300 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />

        {/* Drawer panel */}
        <aside
          className={`fixed top-0 right-0 z-50 h-full w-[60vw] max-w-[360px] transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-[100%]'} flex flex-col bg-bg-card border-l border-border py-6 px-6`}
        >

          <div className="flex items-center justify-between mb-4">
            {/* logo removed from inside drawer per request - keep space for visual balance */}
            <div />
            <button onClick={() => setMobileOpen(false)} className="p-2 text-gray-300 hover:text-white" aria-label={t('nav.closeMenu')}>
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Theme + Language toggles inside drawer */}
          <div className="flex items-center gap-3 mb-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <nav className="flex flex-col gap-3 flex-1 overflow-y-auto pl-2">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-lg font-medium text-left transition-all duration-150 ${isActive(item.href) ? 'text-green bg-green/20 rounded-md px-3 py-2' : 'text-white hover:text-green px-2 py-1'}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4">
            <Link
              href="/about#contact"
              className="w-full inline-flex items-center justify-center rounded-full bg-green px-6 py-3 text-base font-semibold text-bg-primary"
              onClick={() => setMobileOpen(false)}
            >
              {t('nav.freeQuote')}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
