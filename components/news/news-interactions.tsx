'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Share2, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getVisitorId } from '@/lib/news-helpers';

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked?: boolean;
  size?: 'sm' | 'md';
}

export function LikeButton({ postId, initialCount, initialLiked = false, size = 'md' }: LikeButtonProps) {
  const { t } = useTranslation();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = useCallback(async () => {
    if (loading) return;
    const previousLiked = liked;
    const previousCount = count;
    // Optimistic update
    setLiked(!previousLiked);
    setCount(Math.max(0, previousCount + (previousLiked ? -1 : 1)));
    setLoading(true);
    try {
      const res = await fetch('/api/news/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, visitorId: getVisitorId() }),
      });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setLiked(json.liked);
      setCount(json.count);
    } catch {
      // Rollback
      setLiked(previousLiked);
      setCount(previousCount);
    } finally {
      setLoading(false);
    }
  }, [postId, liked, count, loading]);

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      aria-pressed={liked}
      aria-label={t('news.like')}
      className={cn(
        'flex items-center gap-1.5 font-semibold transition-colors disabled:opacity-60',
        size === 'sm' ? 'text-xs' : 'text-sm',
        liked ? 'text-accent-red' : 'text-gray-400 hover:text-accent-red',
      )}
    >
      {loading ? (
        <Loader2 className={cn('animate-spin', size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
      ) : (
        <Heart className={cn(size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4', liked && 'fill-current')} />
      )}
      <span>{count > 0 ? count : t('news.like')}</span>
    </button>
  );
}

interface ShareButtonProps {
  title: string;
  text?: string;
  url: string;
  size?: 'sm' | 'md';
  variant?: 'text' | 'card';
}

export function ShareButton({ title, text, url, size = 'md', variant = 'text' }: ShareButtonProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const shareData = { title, text, url };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user cancelled or share unavailable → fallback to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }, [title, text, url]);

  return (
    <button
      onClick={handleShare}
      aria-label={t('news.share')}
      className={cn(
        'flex items-center gap-1.5 font-semibold transition-colors',
        size === 'sm' ? 'text-xs' : 'text-sm',
        copied ? 'text-green' : 'text-gray-400 hover:text-green',
      )}
    >
      {copied ? (
        <Check className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      ) : (
        <Share2 className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      )}
      {copied ? t('news.copied') : variant === 'card' ? t('news.share') : ''}
    </button>
  );
}
