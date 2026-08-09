'use client';

import { useTranslation } from 'react-i18next';
import { Flame, Clock, Layers, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsCategory, NewsPost, NewsTrendingTag } from '@/types';
import { NewsCard } from './news-card';

export function NewsSidebarRight({
  pinned,
  recent,
  categories,
  selectedCategory,
  onSelectCategory,
  tags,
  selectedTag,
  onSelectTag,
}: {
  pinned: NewsPost[];
  recent: NewsPost[];
  categories: NewsCategory[];
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  tags: NewsTrendingTag[];
  selectedTag: string | null;
  onSelectTag: (tag: string | null) => void;
}) {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:block space-y-6">
      {/* À la une */}
      {pinned.length > 0 && (
        <div className="rounded-lg border border-green/20 bg-bg-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <Flame className="h-4 w-4 text-green" />
            {t('news.aLaUne')}
          </h3>
          <div className="space-y-2">
            {pinned.slice(0, 3).map((post) => (
              <NewsCard key={post.id} post={post} compact />
            ))}
          </div>
        </div>
      )}

      {/* Dernières actualités */}
      <div className="rounded-lg border border-border bg-bg-card p-4">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
          <Clock className="h-4 w-4 text-green" />
          {t('news.dernieres')}
        </h3>
        <div className="space-y-2">
          {recent.slice(0, 5).map((post) => (
            <NewsCard key={post.id} post={post} compact />
          ))}
        </div>
      </div>

      {/* Catégories */}
      {categories.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <Layers className="h-4 w-4 text-green" />
            {t('news.categories')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectCategory(null)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors',
                selectedCategory === null
                  ? 'bg-green/10 border-green/40 text-green'
                  : 'border-border text-gray-400 hover:text-white hover:border-green/30',
              )}
            >
              {t('news.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors',
                  selectedCategory === cat.slug
                    ? 'border-transparent text-white'
                    : 'border-border text-gray-400 hover:text-white hover:border-green/30',
                )}
                style={selectedCategory === cat.slug ? { backgroundColor: cat.color || '#22C55E' } : undefined}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hashtags tendance */}
      {tags.length > 0 && (
        <div className="rounded-lg border border-border bg-bg-card p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-3">
            <Hash className="h-4 w-4 text-green" />
            {t('news.trendingTags')}
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSelectTag(null)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors',
                selectedTag === null
                  ? 'bg-green/10 border-green/40 text-green'
                  : 'border-border text-gray-400 hover:text-white hover:border-green/30',
              )}
            >
              {t('news.all')}
            </button>
            {tags.slice(0, 12).map(({ tag, count }) => (
              <button
                key={tag}
                onClick={() => onSelectTag(tag)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors',
                  selectedTag === tag
                    ? 'bg-green/10 border-green/40 text-green'
                    : 'border-border text-gray-400 hover:text-white hover:border-green/30',
                )}
              >
                #{tag}
                <span className="opacity-60"> {count}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
