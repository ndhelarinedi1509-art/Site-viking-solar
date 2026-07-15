'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  Home, Newspaper, Info, Zap, FolderOpen, Mail, ChevronRight,
} from 'lucide-react';
import type { PageInfo } from '@/types';

const iconMap: Record<string, React.ElementType> = {
  Home, Newspaper, Info, Zap, FolderOpen, Mail,
};

export default function AdminPagesPage() {
  const { t } = useTranslation();
  const [pages, setPages] = useState<PageInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections');
      const json = await res.json();
      setPages(json.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-green border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">{t('admin.pages.title')}</h1>
        <p className="text-sm text-gray-400 mt-1">{t('admin.pages.description')}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => {
          const Icon = iconMap[page.icon] ?? FolderOpen;
          return (
            <Link
              key={page.key}
              href={`/admin/pages/${page.key}`}
              className="group bg-bg-card border border-white/6 rounded-2xl p-5 shadow-card hover:border-green/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-green" />
                </div>
                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-green transition-colors" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">{page.label}</h3>
              <p className="text-sm text-gray-500">
                {page.sections} section{page.sections > 1 ? 's' : ''}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${page.published ? 'bg-green' : 'bg-gray-500'}`} />
                <span className="text-xs text-gray-500">{page.published ? 'Publiée' : 'Brouillon'}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
