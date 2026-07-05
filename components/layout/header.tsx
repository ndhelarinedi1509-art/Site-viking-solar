'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NAV_ITEMS } from '@/config/routes';
import { SITE_CONFIG } from '@/config/site';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-350',
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-white/6 shadow-soft'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" aria-label="Viking Solar Home">
            <svg className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2.5" />
              <path d="M16 6 L18 14 L26 16 L18 18 L16 26 L14 18 L6 16 L14 14 Z" fill="#22C55E" />
            </svg>
            <span className="text-lg font-semibold text-white">
              Vicking <span className="font-bold text-green">Solar</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'relative text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'text-green'
                      : 'text-gray-400 hover:text-white',
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-green" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-green-dark hover:shadow-glow active:scale-[0.98]"
            >
              Devis gratuit
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'lg:hidden overflow-hidden transition-all duration-350',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav className="flex flex-col gap-1 border-t border-white/6 bg-bg-primary/95 backdrop-blur-xl px-4 pb-4 pt-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-green/10 text-green'
                    : 'text-gray-400 hover:text-white hover:bg-white/5',
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="mt-2 rounded-xl bg-green px-5 py-2.5 text-center text-sm font-semibold text-white"
          >
            Devis gratuit
          </Link>
        </nav>
      </div>
    </header>
  );
}
