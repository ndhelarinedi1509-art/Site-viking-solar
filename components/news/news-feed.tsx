'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, RefreshCw, FileQuestion, Search, ArrowUpDown, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsCategory, NewsPost, NewsTrendingTag } from '@/types';
import { getVisitorId } from '@/lib/news-helpers';
import { NewsCard } from './news-card';
import { NewsSidebarLeft } from './news-sidebar-left';
import { NewsSidebarRight } from './news-sidebar-right';

const PAGE_SIZE = 12;
const SORT_OPTIONS = ['latest', 'oldest', 'likes', 'comments'] as const;
type SortOption = (typeof SORT_OPTIONS)[number];

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

interface NewsFeedProps {
  headerTitle?: string;
  headerDescription?: string;
}

export function NewsFeed({ headerTitle, headerDescription }: NewsFeedProps) {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('latest');
  const [tags, setTags] = useState<NewsTrendingTag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQuery(query), 350);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

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

  const loadTags = useCallback(async () => {
    try {
      const res = await fetch('/api/news/tags');
      if (res.ok) {
        const json = await res.json();
        setTags(json.data ?? []);
      }
    } catch {
      /* tags are optional */
    }
  }, []);

  const loadPosts = useCallback(
    async (pageToLoad: number, category: string | null, reset: boolean, currentQuery?: string, currentTag?: string | null, currentSort?: SortOption) => {
      if (reset) {
        setLoading(true);
        setError(false);
      } else {
        setLoadingMore(true);
      }
      try {
        const params = new URLSearchParams({ page: String(pageToLoad), limit: String(PAGE_SIZE) });
        if (category) params.set('category', category);
        if (currentQuery && currentQuery.trim()) params.set('q', currentQuery.trim());
        if (currentTag) params.set('tag', currentTag);
        if (currentSort && currentSort !== 'latest') params.set('sort', currentSort);
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
    const params = new URLSearchParams(window.location.search);
    const urlTag = params.get('tag');
    const urlSort = params.get('sort') as SortOption | null;
    const urlQ = params.get('q') ?? '';
    if (urlTag) setSelectedTag(urlTag.replace(/^#/, ''));
    if (urlQ) {
      setQuery(urlQ);
      setDebouncedQuery(urlQ);
    }
    if (urlSort && SORT_OPTIONS.includes(urlSort)) setSort(urlSort);
    loadCategories();
    loadTags();
    loadPosts(1, null, true, urlQ, urlTag ? urlTag.replace(/^#/, '') : null, urlSort && SORT_OPTIONS.includes(urlSort) ? urlSort : 'latest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadPosts(1, selectedCategory, true, debouncedQuery, selectedTag, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, selectedTag, sort]);

  const handleSelectCategory = useCallback(
    (slug: string | null) => {
      setSelectedCategory(slug);
      loadPosts(1, slug, true, debouncedQuery, selectedTag, sort);
    },
    [loadPosts, debouncedQuery, selectedTag, sort],
  );

  const handleSelectTag = useCallback(
    (tag: string | null) => {
      setSelectedTag(tag === selectedTag ? null : tag);
    },
    [selectedTag],
  );

  const hasMore = posts.length < total;

  const pinned = useMemo(() => posts.filter((p) => p.is_pinned), [posts]);
  const nonPinned = useMemo(() => posts.filter((p) => !p.is_pinned), [posts]);

  const sortLabels: Record<SortOption, string> = {
    latest: t('news.sort.latest'),
    oldest: t('news.sort.oldest'),
    likes: t('news.sort.likes'),
    comments: t('news.sort.comments'),
  };

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

            {/* Search + sort bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('news.searchPlaceholder')}
                  className="w-full rounded-xl border border-border bg-bg-card pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-green/40 focus:ring-1 focus:ring-green/20 transition-colors"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-white transition-colors"
                    aria-label={t('news.clearSearch')}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div className="relative">
                <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="appearance-none rounded-xl border border-border bg-bg-card pl-10 pr-9 py-2.5 text-sm text-white focus:outline-none focus:border-green/40 focus:ring-1 focus:ring-green/20 transition-colors cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} className="bg-bg-card text-white">
                      {sortLabels[opt]}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500 pointer-events-none"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Hashtag chips */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Hash className="h-3.5 w-3.5" />
                  {t('news.trendingTags')}:
                </span>
                <button
                  onClick={() => handleSelectTag(null)}
                  className={cn(
                    'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                    selectedTag === null
                      ? 'bg-green/10 border-green/40 text-green'
                      : 'border-border text-gray-400 hover:text-white hover:border-green/30',
                  )}
                >
                  {t('news.all')}
                </button>
                {tags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={cn(
                      'rounded-full px-3 py-1 text-xs font-semibold border transition-colors',
                      selectedTag === tag
                        ? 'bg-green/10 border-green/40 text-green'
                        : 'border-border text-gray-400 hover:text-white hover:border-green/30',
                    )}
                  >
                    #{tag} <span className="opacity-60">· {count}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Feed header */}
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">{headerTitle || t('news.feedTitle')}</h2>
                <span className="text-xs text-gray-500">
                  {total} {t('news.articles')}
                </span>
              </div>
              {headerDescription && (
                <p className="mt-1 text-sm text-gray-400">{headerDescription}</p>
              )}
            </div>

            {/* Error state */}
            {error && (
              <div className="rounded-lg border border-border bg-bg-card p-10 text-center">
                <p className="text-sm text-gray-400 mb-4">{t('news.error')}</p>
                <button
                  onClick={() => loadPosts(1, selectedCategory, true, debouncedQuery, selectedTag, sort)}
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
                  {selectedCategory ? t('news.noPostsCategory') : debouncedQuery || selectedTag ? t('news.noResults') : t('news.noPosts')}
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
                  onClick={() => loadPosts(page + 1, selectedCategory, false, debouncedQuery, selectedTag, sort)}
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
            tags={tags}
            selectedTag={selectedTag}
            onSelectTag={handleSelectTag}
          />
        </div>
      </div>
    </section>
  );
}
