'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import type { NewsCategory } from '@/types';

const inputCls = 'w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#22C55E');
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('#22C55E');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setCategories(json.data ?? []);
    } catch {
      toast.error('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async () => {
    if (newName.trim().length < 2) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), color: newColor }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur');
      setNewName('');
      setNewColor('#22C55E');
      toast.success('Catégorie créée');
      load();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const save = async (id: string) => {
    if (editName.trim().length < 2) return;
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim(), color: editColor, sort_order: 0 }),
    });
    if (res.ok) {
      toast.success('Catégorie mise à jour');
      setEditingId(null);
      load();
    } else {
      toast.error('Erreur');
    }
  };

  const remove = async (id: string, name: string) => {
    if (!window.confirm(`Supprimer la catégorie « ${name} » ?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Catégorie supprimée');
      load();
    } else {
      toast.error('Erreur');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-white">Catégories</h1>

      {/* Create */}
      <div className="bg-bg-card border border-white/6 rounded-2xl p-4 sm:p-5 shadow-card space-y-4">
        <h2 className="text-sm font-semibold text-white">Nouvelle catégorie</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-bg-elevated p-1"
            aria-label="Couleur"
          />
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && create()}
            placeholder="Nom de la catégorie"
            className={inputCls}
            maxLength={80}
          />
          <button
            onClick={create}
            disabled={creating || newName.trim().length < 2}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-green px-4 text-sm font-semibold text-bg-primary hover:bg-green-dark transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Ajouter
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="h-6 w-6 animate-spin text-green mx-auto" /></div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">Aucune catégorie.</div>
        ) : (
          <div className="divide-y divide-white/6">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-wrap items-center gap-3 p-3 sm:p-4 hover:bg-white/3 transition-colors">
                {editingId === cat.id ? (
                  <>
                    <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)}
                      className="h-9 w-11 cursor-pointer rounded-lg border border-white/10 bg-bg-elevated p-1" aria-label="Couleur" />
                    <input value={editName} onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && save(cat.id)}
                      className={inputCls} maxLength={80} />
                    <button onClick={() => save(cat.id)} className="h-9 w-9 rounded-lg border border-green/40 text-green hover:bg-green/10 transition-colors flex items-center justify-center">
                      <Check className="h-4 w-4" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center">
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <span className="flex-1 min-w-0 text-sm font-medium text-white truncate">{cat.name}</span>
                    <span className="text-[0.7rem] text-gray-500 font-mono">/{cat.slug}</span>
                    <button
                      onClick={() => { setEditingId(cat.id); setEditName(cat.name); setEditColor(cat.color); }}
                      className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(cat.id, cat.name)}
                      className="h-9 w-9 rounded-lg border border-white/10 text-gray-400 hover:text-accent-red transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
