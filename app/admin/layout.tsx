'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileEdit, Image, Mail, Users, Settings,
  ExternalLink, LogOut, PanelRightClose, PanelRight, Loader2,
  Home, Newspaper, Info, Zap, FolderOpen, ChevronRight,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { PageInfo } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Home, Newspaper, Info, Zap, FolderOpen, Mail,
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [pages, setPages] = useState<PageInfo[]>([]);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const json = await res.json();
      setPages(json.data ?? []);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const mainNavItems = [
    { href: '/admin', label: t('admin.layout.dashboard'), icon: LayoutDashboard },
    { href: '/admin/pages', label: 'Pages', icon: FileEdit },
    { href: '/admin/media', label: 'Médias', icon: Image },
    { href: '/admin/messages', label: t('admin.layout.messages'), icon: Mail },
    { href: '/admin/team', label: t('admin.layout.team'), icon: Users },
    { href: '/admin/settings', label: t('admin.layout.settings'), icon: Settings },
  ];

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-bg-card border-r border-white/6 flex flex-col flex-shrink-0 transition-all duration-300 relative`}>
        {/* Logo */}
        <div className={`px-4 py-5 border-b border-white/6 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {sidebarOpen ? (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/10">
                <img src="/logo.webp" alt="Vicking Solar" className="h-full w-full object-contain" />
              </div>
              <span className="text-base font-bold text-white">Vicking Solar</span>
            </Link>
          ) : (
            <Link href="/admin">
              <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-white/10">
                <img src="/logo.webp" alt="Vicking Solar" className="h-full w-full object-contain" />
              </div>
            </Link>
          )}
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <PanelRightClose className="h-4 w-4" />
            </button>
          )}
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="absolute -right-3 top-5 h-6 w-6 rounded-full bg-bg-card border border-white/6 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
              <PanelRight className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {/* Main items */}
          {mainNavItems.map((item) => {
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-green/10 text-green'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${!sidebarOpen && 'justify-center'}`}
                title={sidebarOpen ? undefined : item.label}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && item.label}
              </Link>
            );
          })}

          {/* Page shortcuts */}
          {sidebarOpen && pages.length > 0 && (
            <>
              <div className="pt-4 pb-1 px-3">
                <p className="text-[0.65rem] font-semibold text-gray-600 uppercase tracking-[0.12em]">Pages</p>
              </div>
              {pages.map((page) => {
                const Icon = iconMap[page.icon] ?? FileEdit;
                const isActive = pathname === `/admin/pages/${page.key}`;
                return (
                  <Link
                    key={page.key}
                    href={`/admin/pages/${page.key}`}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-green/10 text-green'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-1 truncate">{page.label}</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${page.published ? 'bg-green' : 'bg-gray-500'}`} />
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* User bottom */}
        {sidebarOpen && (
          <div className="px-4 py-4 border-t border-white/6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
                <img src="/logo.webp" alt="Admin" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{t('admin.layout.adminName')}</p>
                <p className="text-xs text-gray-500 truncate">{t('admin.layout.role')}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/6 bg-bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {pathname.startsWith('/admin/pages/') && pathname.split('/').pop() !== 'pages'
              ? 'Éditeur de page'
              : pathname.split('/').filter(Boolean).pop() === 'admin'
                ? 'Tableau de bord'
                : pathname.split('/').filter(Boolean).pop() ?? ''
            }
          </h2>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              {t('admin.layout.viewSite')}
              <ExternalLink className="h-4 w-4" />
            </a>
            <button onClick={async () => { await fetch('/api/auth/logout', { method: 'POST' }); window.location.href = '/admin/login'; }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-red transition-colors">
              <LogOut className="h-4 w-4" />
              {t('admin.layout.logout')}
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
