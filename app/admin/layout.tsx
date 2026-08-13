'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileEdit, Image, Mail, Users, Settings,
  ExternalLink, LogOut, PanelRightClose, PanelRight, Loader2, Menu, X,
  Home, Newspaper, Info, Zap, FolderOpen, MessageSquareText, Tags,
} from 'lucide-react';
import type { PageInfo } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Home, Newspaper, Info, Zap, FolderOpen, Mail,
};

type SidebarProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  isMobile: boolean;
  pathname: string;
  t: (key: string) => string;
  pages: PageInfo[];
  sessionUser: { name: string; email: string; role: string } | null;
  sessionLoading: boolean;
};

function SidebarContent({ sidebarOpen, setSidebarOpen, isMobile, pathname, t, pages, sessionUser, sessionLoading }: SidebarProps) {
  const mainNavItems = [
    { href: '/admin', label: t('admin.layout.dashboard'), icon: LayoutDashboard },
    { href: '/admin/pages', label: t('admin.layout.pages'), icon: FileEdit },
    { href: '/admin/news', label: t('admin.layout.news'), icon: Newspaper },
    { href: '/admin/comments', label: t('admin.layout.comments'), icon: MessageSquareText },
    { href: '/admin/categories', label: t('admin.layout.categories'), icon: Tags },
    { href: '/admin/services', label: t('admin.layout.services'), icon: Zap },
    { href: '/admin/projects', label: t('admin.layout.projects'), icon: FolderOpen },
    { href: '/admin/media', label: t('admin.layout.media'), icon: Image },
    { href: '/admin/messages', label: t('admin.layout.messages'), icon: Mail },
    { href: '/admin/team', label: t('admin.layout.team'), icon: Users },
    { href: '/admin/users', label: t('admin.layout.admins'), icon: Users },
    { href: '/admin/settings', label: t('admin.layout.settings'), icon: Settings },
  ];

  return (
    <>
      {/* Logo */}
      <div className={`px-4 py-5 border-b border-white/6 flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
        {sidebarOpen ? (
          <Link href="/admin" onClick={() => isMobile && setSidebarOpen(false)} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-white/10">
              <img src="/logo.webp" alt="Vicking Solar" className="h-full w-full object-contain" />
            </div>
            <span className="text-base font-bold text-white">Vicking Solar</span>
          </Link>
        ) : (
          <Link href="/admin" onClick={() => isMobile && setSidebarOpen(false)}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-white/10">
              <img src="/logo.webp" alt="Vicking Solar" className="h-full w-full object-contain" />
            </div>
          </Link>
        )}
        {sidebarOpen && (
          <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-white transition-colors">
            {isMobile ? <X className="h-5 w-5" /> : <PanelRightClose className="h-4 w-4" />}
          </button>
        )}
        {!sidebarOpen && !isMobile && (
          <button onClick={() => setSidebarOpen(true)} className="absolute -right-3 top-5 h-6 w-6 rounded-full bg-bg-card border border-white/6 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <PanelRight className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {mainNavItems.map((item) => {
          const isActive = item.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => isMobile && setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-green/10 text-green'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${!sidebarOpen && !isMobile ? 'justify-center' : ''}`}
              title={sidebarOpen ? undefined : item.label}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {(sidebarOpen || isMobile) && item.label}
            </Link>
          );
        })}

        {/* Page shortcuts */}
        {(sidebarOpen || isMobile) && pages.length > 0 && (
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
                  onClick={() => isMobile && setSidebarOpen(false)}
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
      {(sidebarOpen || isMobile) && (
        <div className="px-4 py-4 border-t border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden bg-white/10 border border-white/10 flex-shrink-0">
              {sessionUser ? (
                <span className="text-sm font-bold text-green">{sessionUser.name.charAt(0).toUpperCase()}</span>
              ) : (
                <img src="/logo.webp" alt="Admin" className="h-full w-full object-contain" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {sessionLoading ? '...' : (sessionUser?.name || 'Admin')}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {sessionUser?.role === 'super_admin' ? 'Super Admin' : 'Administrateur'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [sessionUser, setSessionUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      if (e.matches) setSidebarOpen(false);
    };
    mq.addEventListener('change', handler);
    if (mq.matches) {
      setIsMobile(true);
      setSidebarOpen(false);
    }
    return () => mq.removeEventListener('change', handler);
  }, []);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const json = await res.json();
      setPages(json.data ?? []);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    fetch('/api/admin/auth/session')
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d) => setSessionUser(d.user))
      .catch(() => {})
      .finally(() => setSessionLoading(false));
    fetchPages();
  }, [fetchPages, pathname]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen [@supports(height:100dvh)]:h-dvh bg-bg-primary overflow-hidden">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" />
      )}

      {/* Sidebar */}
      {isMobile ? (
        <aside className={`bg-bg-card border-r border-white/6 flex flex-col h-full fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMobile={isMobile}
            pathname={pathname}
            t={t}
            pages={pages}
            sessionUser={sessionUser}
            sessionLoading={sessionLoading}
          />
        </aside>
      ) : (
        <aside className={`bg-bg-card border-r border-white/6 flex flex-col flex-shrink-0 relative h-full ${
          sidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-300`}>
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isMobile={isMobile}
            pathname={pathname}
            t={t}
            pages={pages}
            sessionUser={sessionUser}
            sessionLoading={sessionLoading}
          />
        </aside>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <header className="h-16 border-b border-white/6 bg-bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {isMobile && (
              <button onClick={() => setSidebarOpen(true)}
                className="md:hidden h-9 w-9 rounded-lg border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <h2 className="text-base md:text-lg font-semibold text-white truncate">
              {pathname.startsWith('/admin/pages/') && pathname.split('/').pop() !== 'pages'
                ? t('admin.layout.pageEditor')
                : pathname.split('/').filter(Boolean).pop() === 'admin'
                  ? t('admin.layout.dashboardTitle')
                  : pathname.split('/').filter(Boolean).pop() ?? ''
              }
            </h2>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
              <ExternalLink className="h-4 w-4" />
              <span className="hidden md:inline">{t('admin.layout.viewSite')}</span>
            </a>
            <button onClick={async () => { await fetch('/api/admin/auth/logout', { method: 'POST' }); window.location.href = '/admin/login'; }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-red transition-colors">
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">{t('admin.layout.logout')}</span>
            </button>
          </div>
        </header>
        <main className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
