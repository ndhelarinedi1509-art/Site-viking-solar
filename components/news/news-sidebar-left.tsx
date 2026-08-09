'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Home, Newspaper, Zap, FolderOpen, Info, Mail, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsCategory } from '@/types';

const NAV_LINKS = [
  { href: '/', key: 'nav.home', icon: Home },
  { href: '/actualites', key: 'nav.actualites', icon: Newspaper },
  { href: '/services', key: 'nav.services', icon: Zap },
  { href: '/projects', key: 'nav.projects', icon: FolderOpen },
  { href: '/about', key: 'nav.about', icon: Info },
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

  const isActive = (href: string) => {
    const base = href.split('#')[0];
    if (base === '/') return pathname === '/';
    return pathname.startsWith(base);
  };

  return (
    <aside className="sticky top-24 hidden lg:block space-y-6">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <Image src="/logo.webp" alt="Viking Solar" className="h-9 w-auto object-contain" width={36} height={36} />
        <span className="text-base font-normal text-white tracking-tight">
          Vicking <span className="font-bold">Solar</span>
        </span>
      </Link>

      {/* Navigation */}
      <nav className="rounded-lg border border-border bg-bg-card p-3">
        <p className="px-2 pb-2 text-[0.65rem] font-semibold text-gray-500 uppercase tracking-[0.12em]">
          {t('news.menu')}
        </p>
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ href, key, icon: Icon }) => (
            <li key={href}>
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

      {/* Categories */}
      {categories.length > 0 && (
        <nav className="rounded-lg border border-border bg-bg-card p-3">
          <p className="px-2 pb-2 text-[0.65rem] font-semibold text-gray-500 uppercase tracking-[0.12em]">
            {t('news.categories')}
          </p>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => onSelectCategory(null)}
                className={cn(
                  'w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors text-left',
                  selectedCategory === null ? 'bg-green/10 text-green' : 'text-gray-400 hover:text-white hover:bg-white/5',
                )}
              >
                <Layers className="h-4 w-4 flex-shrink-0" />
                {t('news.all')}
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onSelectCategory(cat.slug)}
                  className={cn(
                    'w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors text-left',
                    selectedCategory === cat.slug ? 'bg-green/10 text-green' : 'text-gray-400 hover:text-white hover:bg-white/5',
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color || '#22C55E' }}
                  />
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </aside>
  );
}
