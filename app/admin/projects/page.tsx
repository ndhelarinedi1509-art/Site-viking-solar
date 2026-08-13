'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Quote } from 'lucide-react';
import type { CmsProject, CmsTestimonial } from '@/types';
import { ImageUploader } from '@/components/admin/image-uploader';

const CATEGORIES = [
  { value: 'residentiel', label: 'Résidentiel' },
  { value: 'industriel', label: 'Industriel' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'institutionnel', label: 'Institutionnel' },
];

interface ProjectForm {
  title: string;
  description: string;
  category: string;
  power: string;
  location: string;
  tags: string;
  features: string;
  image: string;
  date: string;
  is_published: boolean;
}

const EMPTY_FORM: ProjectForm = {
  title: '',
  description: '',
  category: 'residentiel',
  power: '',
  location: '',
  tags: '',
  features: '',
  image: '',
  date: new Date().toISOString().slice(0, 10),
  is_published: true,
};

function toForm(p: CmsProject): ProjectForm {
  return {
    title: p.title,
    description: p.description ?? '',
    category: p.category || 'residentiel',
    power: p.power ?? '',
    location: p.location ?? '',
    tags: (p.tags ?? []).join(', '),
    features: (p.features ?? []).join('\n'),
    image: p.image ?? '',
    date: (p.date ?? new Date().toISOString().slice(0, 10)).slice(0, 10),
    is_published: p.is_published,
  };
}

interface TestimonialForm {
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
  sort_order: number;
  is_published: boolean;
}

const EMPTY_TESTIMONIAL: TestimonialForm = {
  name: '',
  role: '',
  location: '',
  quote: '',
  rating: 5,
  image: '',
  sort_order: 0,
  is_published: true,
};

type Tab = 'projects' | 'testimonials';

export default function AdminProjectsPage() {
  const [tab, setTab] = useState<Tab>('projects');
  const [projects, setProjects] = useState<CmsProject[]>([]);
  const [testimonials, setTestimonials] = useState<CmsTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState(EMPTY_TESTIMONIAL);
  const [saving, setSaving] = useState(false);

  const loadProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setProjects(json.data ?? []);
    } catch {
      toast.error('Impossible de charger les projets');
    }
  }, []);

  const loadTestimonials = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/testimonials');
      if (!res.ok) throw new Error();
      const json = await res.json();
      setTestimonials(json.data ?? []);
    } catch {
      toast.error('Impossible de charger les témoignages');
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadProjects(), loadTestimonials()]);
    setLoading(false);
  }, [loadProjects, loadTestimonials]);

  useEffect(() => { load(); }, [load]);

  // ── Projets ──
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (p: CmsProject) => {
    setEditingId(p.id);
    setForm(toForm(p));
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
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      features: form.features.split('\n').map((f) => f.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(editingId ? `/api/admin/projects/${editingId}` : '/api/admin/projects', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success(editingId ? 'Projet mis à jour' : 'Projet créé');
      setFormOpen(false);
      loadProjects();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (p: CmsProject) => {
    try {
      const res = await fetch(`/api/admin/projects/${p.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...toForm(p), is_published: !p.is_published }),
      });
      if (!res.ok) throw new Error();
      loadProjects();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Supprimer ce projet ?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Projet supprimé');
      loadProjects();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  // ── Témoignages ──
  const openCreateTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({ ...EMPTY_TESTIMONIAL, sort_order: testimonials.length });
    setTestimonialFormOpen(true);
  };

  const openEditTestimonial = (t: CmsTestimonial) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      name: t.name,
      role: t.role ?? '',
      location: t.location ?? '',
      quote: t.quote,
      rating: t.rating ?? 5,
      image: t.image ?? '',
      sort_order: t.sort_order ?? 0,
      is_published: t.is_published,
    });
    setTestimonialFormOpen(true);
  };

  const saveTestimonial = async () => {
    if (!testimonialForm.name.trim() || !testimonialForm.quote.trim()) {
      toast.error('Le nom et le témoignage sont obligatoires');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(editingTestimonialId ? `/api/admin/testimonials/${editingTestimonialId}` : '/api/admin/testimonials', {
        method: editingTestimonialId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm),
      });
      if (!res.ok) throw new Error();
      toast.success(editingTestimonialId ? 'Témoignage mis à jour' : 'Témoignage publié');
      setTestimonialFormOpen(false);
      loadTestimonials();
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const toggleTestimonialPublished = async (t: CmsTestimonial) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: t.name,
          role: t.role ?? '',
          location: t.location ?? '',
          quote: t.quote,
          rating: t.rating ?? 5,
          image: t.image ?? '',
          sort_order: t.sort_order ?? 0,
          is_published: !t.is_published,
        }),
      });
      if (!res.ok) throw new Error();
      loadTestimonials();
    } catch {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const removeTestimonial = async (id: string) => {
    if (!window.confirm('Supprimer ce témoignage ?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      toast.success('Témoignage supprimé');
      loadTestimonials();
    } catch {
      toast.error('Erreur lors de la suppression');
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Projets & Témoignages</h1>
          <p className="text-sm text-gray-400 mt-1">Gérez les réalisations et les témoignages clients affichés sur le site public.</p>
        </div>
        <button onClick={tab === 'projects' ? openCreate : openCreateTestimonial}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {tab === 'projects' ? 'Nouveau projet' : 'Nouveau témoignage'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-white/5 border border-white/6 p-1 w-fit overflow-x-auto max-w-full">
        <button onClick={() => setTab('projects')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === 'projects' ? 'bg-green text-bg-primary' : 'text-gray-400 hover:text-white'}`}>
          Projets ({projects.length})
        </button>
        <button onClick={() => setTab('testimonials')}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${tab === 'testimonials' ? 'bg-green text-bg-primary' : 'text-gray-400 hover:text-white'}`}>
          Témoignages ({testimonials.length})
        </button>
      </div>

      {/* Projets tab */}
      {tab === 'projects' && (
        <>
          {formOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl bg-bg-card border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] [@supports(height:100dvh)]:max-h-[90dvh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                  <h2 className="text-lg font-semibold text-white">{editingId ? 'Modifier le projet' : 'Nouveau projet'}</h2>
                  <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <Field label="Titre">
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="Villa Moderne Autonome" className={inputCls} />
                  </Field>
                  <Field label="Description">
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3} className={inputCls} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Catégorie">
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls}>
                        {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Puissance">
                      <input value={form.power} onChange={(e) => setForm({ ...form, power: e.target.value })}
                        placeholder="15 kW" className={inputCls} />
                    </Field>
                    <Field label="Localisation">
                      <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                        placeholder="Gombe, Kinshasa" className={inputCls} />
                    </Field>
                    <Field label="Date">
                      <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Tags (séparés par des virgules)">
                    <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
                      placeholder="Solaire, Batterie, 15 kW" className={inputCls} />
                  </Field>
                  <Field label="Points forts (un par ligne)">
                    <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })}
                      rows={2} placeholder={'Toiture intégrée\nApp suivi'} className={inputCls} />
                  </Field>
                  <Field label="Image">
                    <ImageUploader
                      value={form.image}
                      onChange={(image) => setForm({ ...form, image })}
                      placeholder="/images/projet.jpg"
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer pt-1">
                    <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                      className="accent-green h-4 w-4" />
                    Publié
                  </label>
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
            {projects.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 sm:gap-4 bg-bg-card border border-white/6 rounded-xl px-3 sm:px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {p.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{p.location}{p.power ? ` — ${p.power}` : ''}</p>
                </div>
                <span className="hidden sm:inline-block text-[0.65rem] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full bg-white/5 text-gray-400">
                  {CATEGORIES.find((c) => c.value === p.category)?.label ?? p.category}
                </span>
                <span className={`w-2 h-2 rounded-full ${p.is_published ? 'bg-green' : 'bg-gray-500'}`} />
                <div className="flex items-center gap-1 ml-auto sm:ml-0">
                  <button onClick={() => togglePublished(p)} title={p.is_published ? 'Dépublier' : 'Publier'}
                    className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                    {p.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => openEdit(p)}
                    className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => remove(p.id)}
                    className="h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <p className="text-sm text-gray-500">Aucun projet. Créez votre premier projet.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Témoignages tab */}
      {tab === 'testimonials' && (
        <>
          {testimonialFormOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-2xl bg-bg-card border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] [@supports(height:100dvh)]:max-h-[90dvh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                  <h2 className="text-lg font-semibold text-white">{editingTestimonialId ? 'Modifier le témoignage' : 'Nouveau témoignage'}</h2>
                  <button onClick={() => setTestimonialFormOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Nom *">
                      <input value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                        placeholder="Jean-Marc Kabeya" className={inputCls} />
                    </Field>
                    <Field label="Rôle">
                      <input value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                        placeholder="Directeur, Complexe Logistique" className={inputCls} />
                    </Field>
                    <Field label="Localisation">
                      <input value={testimonialForm.location} onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                        placeholder="Limete, Kinshasa" className={inputCls} />
                    </Field>
                    <Field label="Ordre">
                      <input type="number" value={testimonialForm.sort_order} onChange={(e) => setTestimonialForm({ ...testimonialForm, sort_order: Number(e.target.value) })}
                        className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Témoignage *">
                    <textarea value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                      rows={4} placeholder="Ce que le client dit de son expérience avec Viking Solar…" className={inputCls} />
                  </Field>
                  <Field label="Note (1 à 5 étoiles)">
                    <div className="flex items-center gap-3">
                      <input type="number" min={1} max={5} value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Math.min(5, Math.max(1, Number(e.target.value))) })}
                        className={inputCls} />
                      <span className="text-sm text-gray-400">{'★'.repeat(testimonialForm.rating)}{'☆'.repeat(5 - testimonialForm.rating)}</span>
                    </div>
                  </Field>
                  <Field label="Photo">
                    <ImageUploader
                      value={testimonialForm.image}
                      onChange={(image) => setTestimonialForm({ ...testimonialForm, image })}
                      placeholder="/images/client.jpg"
                    />
                  </Field>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer pt-1">
                    <input type="checkbox" checked={testimonialForm.is_published} onChange={(e) => setTestimonialForm({ ...testimonialForm, is_published: e.target.checked })}
                      className="accent-green h-4 w-4" />
                    Publié
                  </label>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/6">
                  <button onClick={() => setTestimonialFormOpen(false)} className="h-10 px-4 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white transition-colors">
                    Annuler
                  </button>
                  <button onClick={saveTestimonial} disabled={saving}
                    className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingTestimonialId ? 'Enregistrer' : 'Publier'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {testimonials.map((t) => (
              <div key={t.id} className="flex flex-wrap items-start gap-3 sm:gap-4 bg-bg-card border border-white/6 rounded-xl px-3 sm:px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green/12 text-green mt-0.5">
                  <Quote className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-gray-500 truncate">{t.role}{t.location ? ` — ${t.location}` : ''}</p>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{t.quote}</p>
                  <p className="text-xs text-amber mt-1">{'★'.repeat(t.rating ?? 5)}{'☆'.repeat(5 - (t.rating ?? 5))}</p>
                </div>
                <span className={`w-2 h-2 rounded-full mt-2 ${t.is_published ? 'bg-green' : 'bg-gray-500'}`} />
                <div className="flex items-center gap-1 mt-1 ml-auto sm:ml-0">
                  <button onClick={() => toggleTestimonialPublished(t)} title={t.is_published ? 'Dépublier' : 'Publier'}
                    className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                    {t.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button onClick={() => openEditTestimonial(t)}
                    className="h-8 w-8 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => removeTestimonial(t.id)}
                    className="h-8 w-8 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                <p className="text-sm text-gray-500">Aucun témoignage. Publiez le premier témoignage de vos clients.</p>
              </div>
            )}
          </div>
        </>
      )}
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
