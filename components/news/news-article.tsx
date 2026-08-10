'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, MessageCircle, Pin } from 'lucide-react';
import type { NewsComment, NewsPost } from '@/types';
import { timeAgo } from '@/lib/news-helpers';
import { LikeButton, ShareButton } from './news-interactions';
import { NewsComments } from './news-comments';

export function NewsArticle({
  post,
  comments,
}: {
  post: NewsPost;
  comments: NewsComment[];
}) {
  const { t, i18n } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14">
      <Link
        href="/actualites"
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-gray-300 hover:border-green/40 hover:text-green transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('news.back')}
      </Link>

      <article className="rounded-lg border border-border bg-bg-card overflow-hidden">
        {/* Cover */}
        <div className="relative h-56 sm:h-72 bg-bg-elevated">
          {post.cover_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#0A1020] to-[#0F1A2E]">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="text-gray-600">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {post.category && (
              <span
                className="rounded-full px-3 py-1 text-[0.7rem] font-bold text-white uppercase tracking-[0.05em] shadow-[0_4px_10px_rgba(0,0,0,0.3)]"
                style={{ backgroundColor: post.category.color || '#22C55E' }}
              >
                {post.category.name}
              </span>
            )}
            {post.is_pinned && (
              <span className="flex items-center gap-1 rounded-full bg-white/10 backdrop-blur px-2.5 py-1 text-[0.7rem] font-bold text-white uppercase tracking-[0.05em]">
                <Pin className="h-3 w-3 text-green" />
                {t('news.pinBadge')}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 sm:p-8">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>{timeAgo(post.published_at, i18n.language)}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-[-0.02em] mb-4">
            {post.title}
          </h1>

          <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line mb-6">{post.content}</p>

          {/* Hashtags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/actualites?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-border bg-bg-primary px-3 py-1 text-xs font-medium text-gray-400 hover:text-green hover:border-green/30 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-6 pt-4 border-t border-border">
            <LikeButton postId={post.id} initialCount={post.like_count ?? 0} initialLiked={post.is_liked} />
            <span className="flex items-center gap-1.5 text-sm text-gray-400">
              <MessageCircle className="h-4 w-4" />
              {post.comment_count ?? 0} {t('news.comments')}
            </span>
            <ShareButton title={post.title} text={post.excerpt} url={`/actualites/${post.slug}`} />
          </div>
        </div>
      </article>

      {/* Comments */}
      <div className="mt-6">
        <NewsComments postId={post.id} initialComments={comments} />

        <Link
          href="/actualites"
          className="mt-5 inline-flex items-center gap-2 rounded-lg border border-border bg-bg-card px-4 py-2 text-sm font-semibold text-gray-300 hover:border-green/40 hover:text-green transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('news.back')}
        </Link>
      </div>
    </div>
  );
}
