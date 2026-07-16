'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import {
  FolderOpen, Users, MessageSquare, Mail, FileEdit, Image,
  TrendingUp, ArrowRight, Loader2, Home, Newspaper, Info, Zap,
  ShieldCheck,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Home, Newspaper, Info, Zap, FolderOpen, Mail,
};

interface StatCard {
  title: string;
  value: string;
  color: string;
  icon: React.ElementType;
  href: string;
}

interface QuickAction {
  label: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const [pages, setPages] = useState<Array<{ key: string; label: string; icon: string }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const json = await res.json();
      setPages(json.data?.slice(0, 3) ?? []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const stats: StatCard[] = [
    { title: t('admin.dashboard.projectsCompleted'), value: '124', color: 'text-green', icon: FolderOpen, href: '/admin/projects' },
    { title: t('admin.dashboard.visitors30d'), value: '8,450', color: 'text-accent-blue', icon: Users, href: '#' },
    { title: t('admin.dashboard.quoteRequests'), value: '32', color: 'text-accent-orange', icon: MessageSquare, href: '/admin/messages' },
    { title: t('admin.dashboard.newMessages'), value: '14', color: 'text-accent-purple', icon: Mail, href: '/admin/messages' },
  ];

  const quickActions: QuickAction[] = [
    { label: 'Modifier Accueil', href: '/admin/pages/home', icon: Home, color: 'text-green' },
    { label: 'Modifier Actualités', href: '/admin/pages/actualites', icon: Newspaper, color: 'text-accent-blue' },
    { label: 'Modifier Services', href: '/admin/pages/services', icon: Zap, color: 'text-accent-orange' },
    { label: 'Médias', href: '/admin/media', icon: Image, color: 'text-accent-purple' },
    { label: 'Messages', href: '/admin/messages', icon: Mail, color: 'text-accent-teal' },
    { label: 'Administrateurs', href: '/admin/users', icon: Users, color: 'text-accent-orange' },
    { label: 'Paramètres', href: '/admin/settings', icon: FileEdit, color: 'text-gray-400' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-green/8 to-accent-teal/8 border border-green/10 rounded-2xl p-6 shadow-card">
        <h1 className="text-2xl font-bold text-white">{t('admin.dashboard.overview')}</h1>
        <p className="text-sm text-gray-400 mt-1">Bienvenue dans votre tableau de bord CMS. Gérez tout le contenu de votre site en quelques clics.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}
            className="bg-bg-card border border-white/6 rounded-2xl p-5 shadow-card hover:border-green/20 hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{stat.title}</span>
              <stat.icon className="h-5 w-5 text-gray-500" />
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="lg:col-span-2 bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-white mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl border border-white/6 hover:border-green/20 hover:bg-white/3 transition-all duration-300 group">
                  <div className={`h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-400 text-center">{action.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pages overview */}
        <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Pages</h2>
            <Link href="/admin/pages" className="text-xs font-semibold text-green hover:text-green-dark transition-colors flex items-center gap-1">
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2">
            {pages.map((page) => {
              const Icon = iconMap[page.icon] ?? FileEdit;
              return (
                <Link key={page.key} href={`/admin/pages/${page.key}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <Icon className="h-4 w-4 text-green" />
                  <span className="text-sm text-gray-300">{page.label}</span>
                  <ArrowRight className="h-3 w-3 text-gray-600 ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-bg-card border border-white/6 rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold text-white mb-4">{t('admin.dashboard.recentActivity')}</h2>
        <div className="space-y-3">
          {[
            { text: 'Page Accueil mise à jour', time: 'Il y a 2 heures' },
            { text: 'Nouveau message de contact', time: 'Il y a 5 heures' },
            { text: 'Image uploadée dans la médiathèque', time: 'Hier' },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-white/6 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green" />
                <p className="text-sm text-gray-300">{activity.text}</p>
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
