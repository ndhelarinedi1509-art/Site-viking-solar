'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, GripVertical } from 'lucide-react';
import type { CmsService } from '@/types';

const COLORS = ['blue', 'green', 'orange', 'purple', 'teal', 'amber'];
const ICONS = ['sun', 'file-text', 'wrench', 'industrial', 'home', 'clipboard-list'];

interface ServiceForm {
  title: string;
  description: string;
  features: string;
  tag: string;
  color: string;
  featured: boolean;
  icon: string;
  is_published: boolean;
}

const EMPTY_FORM: ServiceForm = {
  title: '',
  description: '',
  features: '',
  tag: '',
  color: 'green',
  featured: false,
  icon: 'sun',
  is_published: true,
};

function toForm(s: CmsService): ServiceForm {
  return {
    title: s.title,
    description: s.description ?? '',
    features: (s.features ?? []).join('\n'),
    tag: s.tag ?? '',
    color: s.color,
    featured: s.featured,
    icon: s.icon,
    is_published: s.is_published,
  };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<CmsService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/services');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setServices(json.data ?? []);
    } catch {
      toast.error('Impossible de charger les services');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (s: CmsService) => {
    setEditingId(s.id);
    setForm(toForm(s));
    setFormOpen(true);
  };

  const save = async () => {
    if (!form.title.trim()) {
      toast.error('Le titre est obligatoire');
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(editingId ? `/api/admin/services/${editingId}` : '/api/admin/services', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Service mis à jour' : 'Service créé');
      setFormOpen(false);
      load();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (s: CmsService) => {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...toForm(s), is_published: !s.is_published }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const toggleFeatured = async (s: CmsService) => {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...toForm(s), featured: !s.featured }),
      });
      if (!res.ok) throw new Error();
      load();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer ce service ?')) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Service supprimé');
      load();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = services.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (target < 0 || target >= services.length) return;
    const next = [...services];
    [next[idx], next[target]] = [next[target], next[idx]];
    setServices(next);
    try {
      await Promise.all([
        fetch(`/api/admin/services/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...toForm(services[idx]), sort_order: target }),
        }),
        fetch(`/api/admin/services/${next[idx].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...toForm(services[target]), sort_order: idx }),
        }),
      ]);
    } catch {
      load();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Services</h1>
          <p className="text-sm text-gray-400 mt-1">Gérez les services affichés sur le site public.</p>
        </div>
        <button onClick={openCreate}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          Nouveau service
        </button>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl bg-bg-card border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] [@supports(height:100dvh)]:max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
              <h2 className="text-lg font-semibold text-white">{editingId ? 'Modifier le service' : 'Nouveau service'}</h2>
              <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <Field label="Titre">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Installation Solaire" className={inputCls} />
              </Field>
              <Field label="Description">
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3} className={inputCls} />
              </Field>
              <Field label="Caractéristiques (une par ligne)">
                <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                  rows={3} placeholder={'Garantie 25 ans\nPanneaux certifiés'} className={inputCls} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Tag">
                  <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    placeholder="Résidentiel & Commercial" className={inputCls} />
                </Field>
                <Field label="Couleur">
                  <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className={inputCls}>
                    {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Icône">
                  <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className={inputCls}>
                    {ICONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-green h-4 w-4" />
                  Service mis en avant
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                  <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                    className="accent-green h-4 w-4" />
                  Publié
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/6">
              <button onClick={() => setFormOpen(false)} className="h-10 px-4 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white transition-colors">
                Annuler
              </button>
              <button onClick={save} disabled={saving}
                className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark transition-all disabled:opacity-50 flex items-center gap-2">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.map((s, idx) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3 sm:gap-4 bg-bg-card border border-white/6 rounded-xl px-3 sm:px-4 py-3">
            <div className="flex flex-col gap-0.5">
              <button onClick={() => move(s.id, -1)} disabled={idx === 0}
                className="text-gray-600 hover:text-white disabled:opacity-30 text-xs">&uarr;</button>
              <button onClick={() => move(s.id, 1)} disabled={idx === services.length - 1}
                className="text-gray-600 hover:text-white disabled:opacity-30 text-xs">&darr;</button>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${colorBadge(s.color)} flex-shrink-0`}>
              {s.title.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {s.title}
                {s.featured && <span className="ml-2 text-[0.65rem] font-bold text-green bg-green/10 px-2 py-0.5 rounded-full">FEATURED</span>}
              </p>
              <p className="text-xs text-gray-500 truncate">{s.tag || s.description}</p>
            </div>
            <span className={`w-2 h-2 rounded-full ${s.is_published ? 'bg-green' : 'bg-gray-500'}`} />
            <div className="flex items-center gap-1 ml-auto sm:ml-0">
              <button onClick={() => togglePublished(s)} title={s.is_published ? 'Dépublier' : 'Publier'}
                className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                {s.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => toggleFeatured(s)} title="Mettre en avant"
                className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                <StarIcon active={s.featured} />
              </button>
              <button onClick={() => openEdit(s)}
                className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
              <button onClick={() => remove(s.id)}
                className="h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <p className="text-sm text-gray-500">Aucun service. Créez votre premier service.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls = 'w-full rounded-xl border border-white/10 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-green/50 focus:outline-none focus:ring-1 focus:ring-green/30 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {children}
    </div>
  );
}

function colorBadge(color: string): string {
  const map: Record<string, string> = {
    blue: 'bg-accent-blue/15 text-accent-blue',
    green: 'bg-green/15 text-green',
    orange: 'bg-accent-orange/15 text-accent-orange',
    purple: 'bg-accent-purple/15 text-accent-purple',
    teal: 'bg-accent-teal/15 text-accent-teal',
    amber: 'bg-accent-amber/15 text-accent-amber',
  };
  return map[color] ?? 'bg-green/15 text-green';
}

function StarIcon({ active }: { active: boolean }) {
  return (
    <svg className={`h-4 w-4 ${active ? 'text-amber' : ''}`} viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
