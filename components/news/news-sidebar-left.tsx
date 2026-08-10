'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Home, Newspaper, FolderOpen, TrendingUp, ChevronDown, Info, HelpCircle, Mail, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsCategory } from '@/types';

type NavLink =
  | { key: string; icon: LucideIcon; expandable: true }
  | { key: string; icon: LucideIcon; href: string; expandable?: false };

const NAV_LINKS: NavLink[] = [
  { href: '/', key: 'nav.home', icon: Home },
  { href: '/actualites', key: 'nav.actualites', icon: Newspaper },
  { key: 'news.categories', icon: FolderOpen, expandable: true },
  { href: '/actualites', key: 'news.trending', icon: TrendingUp },
];

const BOTTOM_NAV = [
  { href: '/about', key: 'nav.about', icon: Info },
  { href: '/about#contact', key: 'news.help', icon: HelpCircle },
  { href: '/about#contact', key: 'nav.contact', icon: Mail },
];

export function NewsSidebarLeft({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: NewsCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  const isActive = (href: string) => {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname.startsWith(base);
  };

  const hasCategorySelected = selectedCategory !== null;

  return (
    <aside className="sticky top-24 hidden lg:flex flex-col h-[calc(100vh-7rem)]">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group mb-6">
        <Image src="/logo.webp" alt="Viking Solar" className="h-9 w-auto object-contain" width={36} height={36} />
        <span className="text-base font-normal text-white tracking-tight">
          Viking <span className="font-bold">Solar</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-0.5">
          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            return 'expandable' in link ? (
              <li key={link.key}>
                <>
                  <button
                    type="button"
                    onClick={() => setCategoriesOpen((o) => !o)}
                    className={cn(
                      'flex items-center justify-between gap-3 w-full rounded-lg px-2.5 py-2 text-sm font-medium transition-colors text-left',
                      categoriesOpen || hasCategorySelected
                        ? 'bg-green/10 text-green'
                        : 'text-gray-400 hover:text-white hover:bg-white/5',
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {t(link.key)}
                    </span>
                    <ChevronDown
                      className={cn('h-4 w-4 flex-shrink-0 transition-transform duration-200', categoriesOpen && 'rotate-180')}
                    />
                  </button>

                  {categoriesOpen && (
                    <ul className="mt-1 ml-3 space-y-0.5 border-l border-border pl-3">
                      <li>
                        <button
                          type="button"
                          onClick={() => {
                            onSelectCategory(null);
                            setCategoriesOpen(false);
                          }}
                          className={cn(
                            'flex items-center gap-2.5 w-full rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors text-left',
                            !hasCategorySelected ? 'text-green' : 'text-gray-400 hover:text-white',
                          )}
                        >
                          {t('news.all')}
                        </button>
                      </li>
                      {categories.map((cat) => (
                        <li key={cat.id}>
                          <button
                            type="button"
                            onClick={() => {
                              onSelectCategory(cat.slug);
                              setCategoriesOpen(false);
                            }}
                            className={cn(
                              'flex items-center gap-2.5 w-full rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors text-left',
                              selectedCategory === cat.slug ? 'text-white' : 'text-gray-400 hover:text-white',
                            )}
                          >
                            <span
                              className="h-2 w-2 flex-shrink-0 rounded-full"
                              style={{ backgroundColor: cat.color || '#22C55E' }}
                            />
                            {cat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              </li>
            ) : (
              <li key={link.key}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                    isActive(link.href) ? 'bg-green/10 text-green' : 'text-gray-400 hover:text-white hover:bg-white/5',
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {t(link.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 h-px bg-border" />

        {/* Bottom Navigation */}
        <ul className="space-y-0.5">
          {BOTTOM_NAV.map(({ href, key, icon: Icon }) => (
            <li key={key}>
              <Link
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                  isActive(href) ? 'bg-green/10 text-green' : 'text-gray-400 hover:text-white hover:bg-white/5',
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Subscribe Now Button */}
      <Link
        href="/about#contact"
        className="block w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-gray-100 transition-colors mt-6"
      >
        {t('news.subscribeNow')}
      </Link>

      {/* Footer Icons */}
      <div className="flex items-center justify-center gap-4 mt-4 text-gray-500">
        <Link href="/about#contact" className="hover:text-gray-400 transition-colors">
          <Mail className="h-4 w-4" />
        </Link>
        <Link href="/" className="hover:text-gray-400 transition-colors">
          <Home className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  );
}
