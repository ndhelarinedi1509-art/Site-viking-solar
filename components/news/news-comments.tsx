'use client';

import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Loader2, MessageCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import type { NewsComment } from '@/types';
import { getVisitorId, timeAgo } from '@/lib/news-helpers';
import { cn } from '@/lib/utils';

export function NewsComments({
  postId,
  initialComments,
}: {
  postId: string;
  initialComments: NewsComment[];
}) {
  const { t, i18n } = useTranslation();
  const [comments, setComments] = useState<NewsComment[]>(initialComments);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim().replace(/\s+/g, ' ');
      const trimmedContent = content.trim();

      if (trimmedName.length < 2) {
        setError(t('news.nameRequired'));
        setSuccess(false);
        return;
      }
      if (trimmedContent.length < 3) {
        setError(t('news.commentRequired'));
        setSuccess(false);
        return;
      }

      setSubmitting(true);
      setError('');
      setSuccess(false);
      try {
        const res = await fetch('/api/news/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            postId,
            authorName: trimmedName,
            content: trimmedContent,
            visitorId: getVisitorId(),
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'error');
        const comment: NewsComment = json.data;
        setComments((prev) => [comment, ...prev]);
        setName('');
        setContent('');
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (err) {
        setError((err as Error).message || t('news.commentError'));
      } finally {
        setSubmitting(false);
      }
    },
    [name, content, postId, t],
  );

  return (
    <div className="rounded-lg border border-border bg-bg-card p-5 sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-white mb-4">
        <MessageCircle className="h-4 w-4 text-green" />
        {t('news.commentsTitle')}
        <span className="text-xs font-medium text-gray-500">({comments.length})</span>
      </h3>

      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="mb-6 space-y-3" noValidate>
        <div className="space-y-1.5">
          <label htmlFor="news-comment-name" className="block text-xs font-semibold text-gray-300">
            {t('news.yourName')} <span className="text-green">*</span>
          </label>
          <input
            id="news-comment-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('news.yourNamePlaceholder')}
            maxLength={60}
            className="w-full rounded-lg border border-white/10 bg-bg-elevated px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="news-comment-content" className="block text-xs font-semibold text-gray-300">
            {t('news.yourComment')} <span className="text-green">*</span>
          </label>
          <textarea
            id="news-comment-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('news.yourCommentPlaceholder')}
            rows={3}
            maxLength={2000}
            className="w-full rounded-lg border border-white/10 bg-bg-elevated px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors resize-y"
          />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-xs text-accent-red">
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </p>
        )}
        {success && (
          <p className="flex items-center gap-2 text-xs text-green">
            <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
            {t('news.commentSuccess')}
          </p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-green px-5 text-sm font-semibold text-bg-primary transition-all hover:bg-green-dark active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('news.publishing')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t('news.publish')}
              </>
            )}
          </button>
        </div>
      </form>

      {/* List */}
      {comments.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-gray-400">{t('news.noComments')}</p>
          <p className="text-xs text-gray-500 mt-1">{t('news.beFirst')}</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin pr-1">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 rounded-lg bg-bg-elevated/50 border border-white/6 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-green/20 bg-green/10 text-xs font-bold text-green mt-0.5">
                {c.author_name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-white">{c.author_name}</span>
                  <span className="text-[0.65rem] text-gray-500">{timeAgo(c.created_at, i18n.language)}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
