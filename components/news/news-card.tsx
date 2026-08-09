'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Calendar, MessageCircle, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsPost } from '@/types';
import { timeAgo } from '@/lib/news-helpers';
import { LikeButton, ShareButton } from './news-interactions';

export function NewsCard({ post, compact = false }: { post: NewsPost; compact?: boolean }) {
  const { t, i18n } = useTranslation();
  const href = `/actualites/${post.slug}`;

  if (compact) {
    return (
      <Link
        href={href}
        className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
      >
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-[#0A1020] to-[#0F1A2E] border border-white/6 flex items-center justify-center">
          {post.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <span className="text-xs font-bold text-gray-500">{post.title.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2 hover:text-green transition-colors">
            {post.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{timeAgo(post.published_at, i18n.language)}</p>
        </div>
      </Link>
    );
  }

  return (
    <article className="group rounded-lg border border-border bg-bg-card overflow-hidden flex flex-col transition-all duration-350 hover:-translate-y-0.5 hover:border-green/20 hover:shadow-[0_12px_36px_rgba(0,0,0,0.3)]">
      {/* Cover */}
      <Link href={href} className="relative block h-52 overflow-hidden bg-bg-elevated">
        {post.cover_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.cover_image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0A1020] to-[#0F1A2E]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {post.category && (
            <span
              className="rounded-full px-3 py-1 text-[0.65rem] font-bold text-white uppercase tracking-[0.05em] shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
              style={{ backgroundColor: post.category.color || '#22C55E' }}
            >
              {post.category.name}
            </span>
          )}
          {post.is_pinned && (
            <span className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur px-2.5 py-1 text-[0.65rem] font-bold text-white uppercase tracking-[0.05em]">
              <Pin className="h-3 w-3 text-green" />
              {t('news.pinBadge')}
            </span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>{timeAgo(post.published_at, i18n.language)}</span>
        </div>
        <Link href={href}>
          <h3 className="text-base font-bold text-white leading-snug mb-2 transition-colors group-hover:text-green line-clamp-2">
            {post.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-400 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-bg-primary px-2.5 py-0.5 text-[0.65rem] font-medium text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <LikeButton postId={post.id} initialCount={post.like_count ?? 0} initialLiked={post.is_liked} size="sm" />
          </span>
          <Link href={href} className="flex items-center gap-1.5 hover:text-white transition-colors">
            <MessageCircle className="h-3.5 w-3.5" />
            {post.comment_count ?? 0} {t('news.comments')}
          </Link>
          <ShareButton title={post.title} text={post.excerpt} url={`/actualites/${post.slug}`} size="sm" variant="card" />
        </div>
      </div>
    </article>
  );
}
