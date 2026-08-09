'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, RefreshCw, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsCategory, NewsPost } from '@/types';
import { getVisitorId } from '@/lib/news-helpers';
import { NewsCard } from './news-card';
import { NewsSidebarLeft } from './news-sidebar-left';
import { NewsSidebarRight } from './news-sidebar-right';

const PAGE_SIZE = 12;

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-bg-card overflow-hidden">
      <div className="h-52 animate-pulse bg-bg-elevated" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-24 animate-pulse rounded bg-bg-elevated" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-bg-elevated" />
        <div className="h-3 w-full animate-pulse rounded bg-bg-elevated" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-bg-elevated" />
      </div>
    </div>
  );
}

export function NewsFeed() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/news/categories');
      if (res.ok) {
        const json = await res.json();
        setCategories(json.data ?? []);
      }
    } catch {
      /* categories are optional */
    }
  }, []);

  const loadPosts = useCallback(
    async (pageToLoad: number, category: string | null, reset: boolean) => {
      if (reset) {
        setLoading(true);
        setError(false);
      } else {
        setLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({ page: String(pageToLoad), limit: String(PAGE_SIZE) });
        if (category) params.set('category', category);
        params.set('visitorId', getVisitorId());
        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error();
        const json = await res.json();
        setPosts((prev) => (reset ? json.data : [...prev, ...json.data]));
        setTotal(json.total ?? 0);
        setPage(pageToLoad);
      } catch {
        if (reset) setError(true);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadCategories();
    loadPosts(1, null, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectCategory = useCallback(
    (slug: string | null) => {
      setSelectedCategory(slug);
      loadPosts(1, slug, true);
    },
    [loadPosts],
  );

  const hasMore = posts.length < total;

  const pinned = useMemo(() => posts.filter((p) => p.is_pinned), [posts]);
  const nonPinned = useMemo(() => posts.filter((p) => !p.is_pinned), [posts]);

  return (
    <section className="border-t border-border bg-bg-primary py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[230px_minmax(0,1fr)_300px] gap-8 items-start">
          {/* Left column */}
          <NewsSidebarLeft
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* Center: feed */}
          <div className="min-w-0">
            {/* Mobile category chips */}
            <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide pb-3 -mx-4 px-4">
              <button
                onClick={() => handleSelectCategory(null)}
                className={cn(
                  'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors',
                  selectedCategory === null
                    ? 'bg-green/10 border-green/40 text-green'
                    : 'border-border text-gray-400',
                )}
              >
                {t('news.all')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.slug)}
                  className={cn(
                    'shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold border transition-colors',
                    selectedCategory === cat.slug
                      ? 'border-transparent text-white'
                      : 'border-border text-gray-400',
                  )}
                  style={selectedCategory === cat.slug ? { backgroundColor: cat.color || '#22C55E' } : undefined}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Feed header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{t('news.feedTitle')}</h2>
              <span className="text-xs text-gray-500">
                {total} {t('news.articles')}
              </span>
            </div>

            {/* Error state */}
            {error && (
              <div className="rounded-lg border border-border bg-bg-card p-10 text-center">
                <p className="text-sm text-gray-400 mb-4">{t('news.error')}</p>
                <button
                  onClick={() => loadPosts(1, selectedCategory, true)}
                  className="inline-flex items-center gap-2 rounded-full border border-green/30 px-5 py-2.5 text-sm font-semibold text-green hover:bg-green/10 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t('news.retry')}
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="grid gap-5 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && posts.length === 0 && (
              <div className="rounded-lg border border-border bg-bg-card p-14 text-center">
                <FileQuestion className="h-10 w-10 text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-400">
                  {selectedCategory ? t('news.noPostsCategory') : t('news.noPosts')}
                </p>
              </div>
            )}

            {/* Feed */}
            {!loading && !error && posts.length > 0 && (
              <div className="space-y-6">
                {pinned.length > 0 && selectedCategory === null && (
                  <div>
                    <div className="grid gap-5">
                      {pinned.map((post) => (
                        <NewsCard key={post.id} post={post} />
                      ))}
                    </div>
                    {nonPinned.length > 0 && (
                      <div className="my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                    )}
                  </div>
                )}

                <div className="grid gap-5">
                  {nonPinned.map((post) => (
                    <NewsCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Load more */}
            {!loading && !error && hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => loadPosts(page + 1, selectedCategory, false)}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2 rounded-full border border-green/30 px-6 py-2.5 text-sm font-semibold text-green hover:bg-green/10 transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t('news.loadingMore')}
                    </>
                  ) : (
                    t('news.loadMore')
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right column */}
          <NewsSidebarRight
            pinned={pinned}
            recent={posts}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>
      </div>
    </section>
  );
}
