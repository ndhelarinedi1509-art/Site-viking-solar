'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  FileEdit,
  FolderOpen,
  Home,
  Image,
  Info,
  Loader2,
  Mail,
  Newspaper,
  Reply,
  Users,
  Zap,
} from 'lucide-react';
import { UNREAD_CHANGED_EVENT } from '@/lib/admin-events';

interface LatestQuote {
  id: string;
  name: string;
  email: string;
  service: string | null;
  subject: string | null;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
}

interface Stats {
  projects: number;
  quoteRequests: number;
  unreadQuotes: number;
  posts: number;
  subscribers: number;
  media: number;
  latestQuotes: LatestQuote[];
}

const REFRESH_INTERVAL_MS = 30_000;

const iconMap: Record<string, React.ElementType> = {
  Home,
  Newspaper,
  Info,
  Zap,
  FolderOpen,
  Mail,
};

const EMPTY_STATS: Stats = {
  projects: 0,
  quoteRequests: 0,
  unreadQuotes: 0,
  posts: 0,
  subscribers: 0,
  media: 0,
  latestQuotes: [],
};

export default function AdminDashboardPage() {
  const { t, i18n } = useTranslation();
  const [pages, setPages] = useState<Array<{ key: string; label: string; icon: string }>>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  const locale = i18n.language?.startsWith('en') ? 'en-US' : 'fr-FR';
  const numberFormat = new Intl.NumberFormat(locale);

  const formatDate = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(
        new Date(iso),
      ),
    [locale],
  );

  const serviceLabel = useCallback(
    (key: string | null) => (key ? t(`contact.form.serviceOptions.${key}`) : '—'),
    [t],
  );

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      setStats({ ...EMPTY_STATS, ...((await res.json()) as Partial<Stats>) });
    } catch {
      // Le tableau de bord garde les dernieres valeurs connues plutot que de
      // toutes les effacer : une coupure reseau ne doit pas tout faire disparaitre.
    }
  }, []);

  useEffect(() => {
    let active = true;

    (async () => {
      const [sections, statsRes] = await Promise.all([
        fetch('/api/admin/sections').then((r) => (r.ok ? r.json() : null)).catch(() => null),
        fetch('/api/admin/stats', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null),
      ]);

      if (!active) return;
      setPages(sections?.data?.slice(0, 3) ?? []);
      if (statsRes) setStats({ ...EMPTY_STATS, ...(statsRes as Partial<Stats>) });
      setLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  // Un nouveau devis doit apparaitre sans rechargement manuel.
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') fetchStats();
    }, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchStats]);

  // Le traitement d'un message (lu, repondu, supprime) doit faire disparaitre
  // l'alerte du tableau de bord immediatement.
  useEffect(() => {
    const handler = () => fetchStats();
    window.addEventListener(UNREAD_CHANGED_EVENT, handler);
    return () => window.removeEventListener(UNREAD_CHANGED_EVENT, handler);
  }, [fetchStats]);

  const cards = [
    {
      title: t('admin.dashboard.projects'),
      value: numberFormat.format(stats.projects),
      color: 'text-green',
      icon: FolderOpen,
      href: '/admin/projects',
    },
    {
      title: t('admin.dashboard.quoteRequests'),
      value: numberFormat.format(stats.quoteRequests),
      color: 'text-accent-orange',
      icon: Mail,
      href: '/admin/messages',
    },
    {
      title: t('admin.dashboard.unreadQuotes'),
      value: numberFormat.format(stats.unreadQuotes),
      color: 'text-accent-purple',
      icon: Bell,
      href: '/admin/messages',
    },
    {
      title: t('admin.dashboard.subscribers'),
      value: numberFormat.format(stats.subscribers),
      color: 'text-accent-blue',
      icon: Users,
      href: '/admin/news',
    },
  ];

  const quickActions = [
    { label: t('admin.layout.dashboard'), href: '/admin/pages/home', icon: Home, color: 'text-green' },
    { label: t('admin.layout.news'), href: '/admin/pages/actualites', icon: Newspaper, color: 'text-accent-blue' },
    { label: t('admin.layout.services'), href: '/admin/services', icon: Zap, color: 'text-accent-orange' },
    { label: t('admin.layout.media'), href: '/admin/media', icon: Image, color: 'text-accent-purple' },
    { label: t('admin.layout.messages'), href: '/admin/messages', icon: Mail, color: 'text-accent-teal' },
    { label: t('admin.layout.admins'), href: '/admin/users', icon: Users, color: 'text-accent-orange' },
    { label: t('admin.layout.settings'), href: '/admin/settings', icon: FileEdit, color: 'text-gray-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green animate-spin" aria-hidden />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green/8 to-accent-teal/8 border border-green/10 rounded-2xl p-5 sm:p-6 shadow-card">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {t('admin.dashboard.overview')}
        </h1>
        <p className="text-sm text-gray-400 mt-1">{t('admin.dashboard.overviewHint')}</p>
      </div>

      {/* Notification : nouveau devis reçu */}
      {stats.unreadQuotes > 0 &&
        (() => {
          const latestNew = stats.latestQuotes.find((q) => q.status === 'new');
          const others = stats.unreadQuotes - 1;
          const hint = !latestNew
            ? t('admin.dashboard.newQuoteNotificationPlain')
            : others > 0
              ? t('admin.dashboard.newQuoteNotificationMore', {
                  name: latestNew.name,
                  subject: latestNew.subject || t('admin.messages.noSubject'),
                  count: others,
                })
              : t('admin.dashboard.newQuoteNotificationFirst', {
                  name: latestNew.name,
                  subject: latestNew.subject || t('admin.messages.noSubject'),
                });

          return (
            <Link
              href="/admin/messages"
              role="alert"
              className="flex items-start gap-3 rounded-2xl border border-accent-orange/40 bg-accent-orange/10 p-5 transition-colors hover:bg-accent-orange/15"
            >
              <Bell className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-accent-orange">
                  {t('admin.dashboard.newQuoteNotification', { count: stats.unreadQuotes })}
                </span>
                <span className="mt-0.5 block text-xs text-gray-300">{hint}</span>
              </span>
              <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-accent-orange" aria-hidden />
            </Link>
          );
        })()}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-bg-card border border-white/6 rounded-2xl p-5 shadow-card hover:border-green/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{card.title}</span>
              <card.icon className="h-5 w-5 text-gray-500" aria-hidden />
            </div>
            <p className={`text-3xl font-bold ${card.color}`}>{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-card border border-white/6 rounded-2xl p-4 sm:p-6 shadow-card">
          <h2 className="text-lg font-semibold text-white mb-4">
            {t('admin.dashboard.quickActions')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href + action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/6 hover:border-green/20 hover:bg-white/3 transition-all duration-300 group"
                >
                  <div
                    className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <span className="text-xs font-medium text-gray-400 text-center">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="bg-bg-card border border-white/6 rounded-2xl p-4 sm:p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{t('admin.dashboard.pages')}</h2>
            <Link
              href="/admin/pages"
              className="text-xs font-semibold text-green hover:text-green-dark transition-colors flex items-center gap-1"
            >
              {t('admin.dashboard.viewAll')}
              <ArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>
          <div className="space-y-2">
            {pages.map((page) => {
              const Icon = iconMap[page.icon] ?? FileEdit;
              return (
                <Link
                  key={page.key}
                  href={`/admin/pages/${page.key}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors"
                >
                  <Icon className="h-4 w-4 text-green" aria-hidden />
                  <span className="text-sm text-gray-300">{page.label}</span>
                  <ArrowRight className="h-3 w-3 text-gray-600 ml-auto" aria-hidden />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dernieres demandes de devis — donnees reelles, pas d'activite inventee */}
      <div className="bg-bg-card border border-white/6 rounded-2xl p-4 sm:p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {t('admin.dashboard.latestQuotes')}
          </h2>
          <Link
            href="/admin/messages"
            className="text-xs font-semibold text-green hover:text-green-dark transition-colors flex items-center gap-1"
          >
            {t('admin.dashboard.viewAll')}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        {stats.latestQuotes.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            {t('admin.messages.empty')}
          </p>
        ) : (
          <ul className="space-y-1">
            {stats.latestQuotes.map((quote) => (
              <li key={quote.id}>
                <Link
                  href="/admin/messages"
                  className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-white/6 last:border-0 hover:bg-white/3 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    {quote.status === 'replied' ? (
                      <Reply className="h-4 w-4 shrink-0 text-accent-blue" aria-hidden />
                    ) : (
                      <Mail
                        className={`h-4 w-4 shrink-0 ${quote.status === 'new' ? 'text-accent-orange' : 'text-gray-600'}`}
                        aria-hidden
                      />
                    )}
                    <span className="min-w-0">
                      <span
                        className={`block truncate text-sm ${quote.status === 'new' ? 'font-semibold text-white' : 'text-gray-300'}`}
                      >
                        {quote.name}
                      </span>
                      <span className="block truncate text-xs text-gray-500">
                        {quote.subject || t('admin.messages.noSubject')} —{' '}
                        {serviceLabel(quote.service)}
                      </span>
                    </span>
                  </span>
                  <time
                    dateTime={quote.created_at}
                    className="shrink-0 whitespace-nowrap text-xs text-gray-500"
                  >
                    {formatDate(quote.created_at)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
