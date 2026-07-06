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
    { href: '/about', label: t('nav.about') },
    { href: '/services', label: t('nav.services') },
    { href: '/projects', label: t('nav.projects') },
    { href: '/contact', label: t('nav.contact') },
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
            ? 'bg-bg-primary/85 backdrop-blur-xl border-b border-border'
            : 'bg-transparent'
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
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm font-medium transition-colors duration-200 py-0.5 ${
                    isActive(item.href)
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-green transition-all duration-350 ${
                      isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right side: Language toggle + Theme Toggle + CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <LanguageToggle />
              <ThemeToggle />
              <Link
                href="/#contact"
                className="rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-bg-primary transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
              >
                {t('nav.freeQuote')}
              </Link>
            </div>

            {/* Mobile toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
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

      {/* Mobile fullscreen menu */}
      <div
        className={`fixed inset-0 z-40 bg-bg-primary/97 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 transition-all duration-350 lg:hidden ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-2xl font-medium transition-colors ${
              isActive(item.href) ? 'text-green' : 'text-white hover:text-green'
            }`}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="mt-4 rounded-full bg-green px-8 py-3 text-base font-semibold text-bg-primary"
          onClick={() => setMobileOpen(false)}
        >
          {t('nav.freeQuote')}
        </Link>
      </div>
    </>
  );
}
