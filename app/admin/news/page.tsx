'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Plus, Pencil, Trash2, Pin, PinOff, Eye, EyeOff, Loader2, ExternalLink,
  ThumbsUp, MessageCircle, X,
} from 'lucide-react';
import type { NewsCategory, NewsPost, NewsPostStatus } from '@/types';
import { ImageUploader } from '@/components/admin/image-uploader';

interface AdminPost extends NewsPost {
  like_count: number;
  comment_count: number;
}

interface CategoryOption {
  id: string;
  name: string;
  color: string;
}

const EMPTY_FORM = {
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  category_id: '',
  status: 'draft' as NewsPostStatus,
  is_pinned: false,
  published_at: '',
  tags: '',
};

function StatusBadge({ status }: { status: NewsPostStatus }) {
  const map: Record<NewsPostStatus, string> = {
    published: 'bg-green/10 text-green border-green/30',
    draft: 'bg-accent-orange/10 text-accent-orange border-accent-orange/30',
    archived: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide ${map[status]}`}>
      {status}
    </span>
  );
}

export default function AdminNewsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, catRes] = await Promise.all([
        fetch('/api/admin/news'),
        fetch('/api/admin/categories'),
      ]);
      if (!postsRes.ok) throw new Error();
      const postsJson = await postsRes.json();
      const catJson = await catRes.json();
      setPosts(postsJson.data ?? []);
      setCategories((catJson.data ?? []).map((c: NewsCategory) => ({ id: c.id, name: c.name, color: c.color })));
    } catch {
      toast.error('Impossible de charger les actualités');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (post: AdminPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      category_id: post.category_id ?? '',
      status: post.status,
      is_pinned: post.is_pinned,
      published_at: post.published_at ? post.published_at.slice(0, 16) : '',
      tags: (post.tags ?? []).join(', '),
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Le titre et le contenu sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        cover_image: form.cover_image.trim(),
        category_id: form.category_id || null,
        status: form.status,
        is_pinned: form.is_pinned,
        published_at: form.published_at ? new Date(form.published_at).toISOString() : null,
        tags: form.tags
          .split(/[,;]/)
          .map((t) => t.trim())
          .filter(Boolean),
      };
      const res = await fetch(editingId ? `/api/admin/news/${editingId}` : '/api/admin/news', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur');
      toast.success(editingId ? 'Actualité mise à jour' : 'Actualité créée');
      setFormOpen(false);
      load();
    } catch (err) {
      toast.error((err as Error).message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: AdminPost) => {
    if (!window.confirm(`Supprimer « ${post.title} » ?`)) return;
    const res = await fetch(`/api/admin/news/${post.id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Actualité supprimée');
      load();
    } else {
      toast.error('Erreur lors de la suppression');
    }
  };

  const quickToggle = async (post: AdminPost, field: 'is_pinned' | 'status') => {
    const payload = {
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      cover_image: post.cover_image,
      category_id: post.category_id,
      status: field === 'status'
        ? post.status === 'published' ? 'draft' : 'published'
        : post.status,
      is_pinned: field === 'is_pinned' ? !post.is_pinned : post.is_pinned,
      published_at: post.published_at,
      tags: post.tags ?? [],
    };
    const res = await fetch(`/api/admin/news/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      toast.success(field === 'is_pinned' ? (payload.is_pinned ? 'Épinglée' : 'Désépinglée') : payload.status === 'published' ? 'Publiée' : 'Passée en brouillon');
      load();
    } else {
      toast.error('Erreur');
    }
  };

  const inputCls = 'w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Actualités</h1>
        <button
          onClick={openCreate}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-green px-4 text-sm font-semibold text-bg-primary hover:bg-green-dark hover:shadow-glow transition-all duration-300"
        >
          <Plus className="h-4 w-4" />
          Nouvelle actualité
        </button>
      </div>

      {/* List */}
      <div className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-green mx-auto" />
          </div>
        ) : posts.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">Aucune actualité. Créez votre première publication.</div>
        ) : (
          <div className="divide-y divide-white/6">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 hover:bg-white/3 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-white truncate">{post.title}</h3>
                    {post.is_pinned && <Pin className="h-3.5 w-3.5 text-green flex-shrink-0" />}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <StatusBadge status={post.status} />
                    {post.category && (
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[0.65rem] font-bold text-white"
                        style={{ backgroundColor: post.category.color }}
                      >
                        {post.category.name}
                      </span>
                    )}
                    <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" />{post.like_count ?? 0}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="h-3 w-3" />{post.comment_count ?? 0}</span>
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('fr-FR') : '—'}</span>
                    {post.tags && post.tags.length > 0 && (
                      <span className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 5).map((tag) => (
                          <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[0.65rem] text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => quickToggle(post, 'is_pinned')}
                    title={post.is_pinned ? 'Désépingler' : 'Épingler'}
                    className={`h-9 w-9 rounded-lg border transition-colors flex items-center justify-center ${post.is_pinned ? 'border-green/40 text-green' : 'border-white/10 text-gray-400 hover:text-white'}`}
                  >
                    {post.is_pinned ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => quickToggle(post, 'status')}
                    title={post.status === 'published' ? 'Mettre en brouillon' : 'Publier'}
                    className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                  >
                    {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/actualites/${post.slug}`}
                    target="_blank"
                    title="Voir"
                    className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => openEdit(post)}
                    title="Modifier"
                    className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    title="Supprimer"
                    className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-accent-red transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/6 bg-bg-card p-6 sm:p-8 shadow-card scrollbar-thin">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Modifier l’actualité' : 'Nouvelle actualité'}</h2>
              <button onClick={() => setFormOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Titre *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} maxLength={200} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Catégorie</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
                    <option value="">Sans catégorie</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Statut</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as NewsPostStatus })} className={inputCls}>
                    <option value="draft">Brouillon</option>
                    <option value="published">Publié</option>
                    <option value="archived">Archivé</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Résumé</label>
                <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className={inputCls} maxLength={500} />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Contenu *</label>
                <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className={inputCls} />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Image de couverture</label>
                <ImageUploader
                  value={form.cover_image}
                  onChange={(cover_image) => setForm({ ...form, cover_image })}
                  placeholder="https://... ou importez une image"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-300">Hashtags (séparés par virgule)</label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} placeholder="solaire, promotion, kit" />
                <p className="text-xs text-gray-500">Ex. : solaire, promotion, kit — affichés en #hashtag et filtrables par les visiteurs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-300">Date de publication</label>
                  <input type="datetime-local" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className={inputCls} />
                </div>
                <label className="flex items-center gap-2.5 text-sm font-medium text-gray-300 pb-2.5">
                  <input
                    type="checkbox"
                    checked={form.is_pinned}
                    onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white text-green focus:ring-green"
                  />
                  Épingler (À la une)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setFormOpen(false)} className="h-10 rounded-xl border border-white/10 px-5 text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-green px-5 text-sm font-semibold text-bg-primary hover:bg-green-dark hover:shadow-glow transition-all disabled:opacity-50 disabled:pointer-events-none"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? 'Enregistrer' : 'Créer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
