'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Trash2, Ban, CheckCircle2, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NewsComment, NewsCommentStatus } from '@/types';

interface AdminComment extends NewsComment {
  post?: { id: string; title: string; slug: string } | null;
}

const STATUS_FILTERS: (NewsCommentStatus | 'all')[] = ['all', 'published', 'pending', 'hidden', 'spam'];

const STATUS_LABEL: Record<NewsCommentStatus, string> = {
  published: 'Publié',
  pending: 'En attente',
  hidden: 'Masqué',
  spam: 'Spam',
};

const STATUS_STYLE: Record<NewsCommentStatus, string> = {
  published: 'bg-green/10 text-green border-green/30',
  pending: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30',
  hidden: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  spam: 'bg-accent-red/10 text-accent-red border-accent-red/30',
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>('all');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/comments');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setComments(json.data ?? []);
    } catch {
      toast.error('Impossible de charger les commentaires');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: NewsCommentStatus) => {
    const res = await fetch(`/api/admin/comments?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      toast.success(`Commentaire : ${STATUS_LABEL[status]}`);
    } else {
      toast.error('Erreur');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer définitivement ce commentaire ?')) return;
    const res = await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      toast.success('Commentaire supprimé');
    } else {
      toast.error('Erreur');
    }
  };

  const filtered = filter === 'all' ? comments : comments.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Commentaires</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => {
          const count = s === 'all' ? comments.length : comments.filter((c) => c.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors',
                filter === s ? 'bg-green/10 border-green/40 text-green' : 'border-white/10 text-gray-400 hover:text-white',
              )}
            >
              {s === 'all' ? 'Tous' : STATUS_LABEL[s]} ({count})
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin text-green mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Inbox className="h-8 w-8 text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">Aucun commentaire</p>
          </div>
        ) : (
          <div className="divide-y divide-white/6">
            {filtered.map((c) => (
              <div key={c.id} className="p-4 hover:bg-white/3 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-green/20 bg-green/10 text-xs font-bold text-green">
                    {c.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{c.author_name}</span>
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide', STATUS_STYLE[c.status])}>
                        {STATUS_LABEL[c.status]}
                      </span>
                      <span className="text-[0.7rem] text-gray-500">
                        {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={cn('text-sm text-gray-400 leading-relaxed', c.status === 'spam' && 'line-through opacity-60')}>{c.content}</p>
                    {c.post && (
                      <Link href={`/actualites/${c.post.slug}`} target="_blank" className="mt-1 inline-block text-xs text-green hover:underline">
                        Sur : {c.post.title}
                      </Link>
                    )}
                    <div className="flex flex-wrap items-center gap-1 mt-3 sm:hidden">
                      {c.status !== 'published' && (
                        <button onClick={() => setStatus(c.id, 'published')} title="Publier"
                          className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-green transition-colors flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      {c.status !== 'hidden' && (
                        <button onClick={() => setStatus(c.id, 'hidden')} title="Masquer"
                          className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                          <EyeOff className="h-4 w-4" />
                        </button>
                      )}
                      {c.status !== 'pending' && (
                        <button onClick={() => setStatus(c.id, 'pending')} title="En attente"
                          className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {c.status !== 'spam' && (
                        <button onClick={() => setStatus(c.id, 'spam')} title="Marquer spam"
                          className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-accent-orange transition-colors flex items-center justify-center">
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => remove(c.id)} title="Supprimer"
                        className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-accent-red transition-colors flex items-center justify-center">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                    {c.status !== 'published' && (
                      <button onClick={() => setStatus(c.id, 'published')} title="Publier"
                        className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-green transition-colors flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                    )}
                    {c.status !== 'hidden' && (
                      <button onClick={() => setStatus(c.id, 'hidden')} title="Masquer"
                        className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                        <EyeOff className="h-4 w-4" />
                      </button>
                    )}
                    {c.status !== 'pending' && (
                      <button onClick={() => setStatus(c.id, 'pending')} title="En attente"
                        className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {c.status !== 'spam' && (
                      <button onClick={() => setStatus(c.id, 'spam')} title="Marquer spam"
                        className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-accent-orange transition-colors flex items-center justify-center">
                        <Ban className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => remove(c.id)} title="Supprimer"
                      className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-accent-red transition-colors flex items-center justify-center">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
