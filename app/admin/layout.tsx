'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileEdit,
  Image,
  Mail,
  Users,
  Settings,
  ExternalLink,
  LogOut,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/content', label: 'Contenu Site', icon: FileEdit },
  { href: '/admin/projects', label: 'Projets & Médias', icon: Image },
  { href: '/admin/messages', label: 'Messages Inbox', icon: Mail },
  { href: '/admin/team', label: 'Équipe', icon: Users },
  { href: '/admin/settings', label: 'Configuration', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <aside className="w-64 bg-bg-card border-r border-white/6 flex flex-col flex-shrink-0">
        <div className="px-6 py-5 border-b border-white/6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green/10 border border-green/30 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="#22C55E" strokeWidth="2" />
                <path
                  d="M16 6L18.5 13H26L20 17.5L22.5 25L16 20.5L9.5 25L12 17.5L6 13H13.5L16 6Z"
                  fill="#22C55E"
                />
              </svg>
            </div>
            <span className="text-base font-bold text-white">Viking Solar</span>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === '/admin'
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
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green/10 border border-green/30 flex items-center justify-center text-sm font-bold text-green">
              A
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin Principal</p>
              <p className="text-xs text-gray-500">Rôle: Super Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-white/6 bg-bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">Administration</h2>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Voir le site
              <ExternalLink className="h-4 w-4" />
            </a>
            <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-red transition-colors">
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
