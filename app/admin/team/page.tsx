'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Loader2, User } from 'lucide-react';
import type { PageSection } from '@/types';
import { ImageUploader } from '@/components/admin/image-uploader';

const ACCENT_RINGS = ['ring-green/30', 'ring-accent-amber/35', 'ring-accent-purple/35', 'ring-accent-teal/35'];

interface MemberForm {
  name: string;
  role: string;
  photo: string;
}

const EMPTY_FORM: MemberForm = { name: '', role: '', photo: '' };

function accentColor(i: number) {
  return ACCENT_RINGS[i % ACCENT_RINGS.length];
}

export default function AdminTeamPage() {
  const [section, setSection] = useState<PageSection | null>(null);
  const [members, setMembers] = useState<Array<Record<string, string>>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<MemberForm>(EMPTY_FORM);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/sections?pageKey=about');
      if (!res.ok) throw new Error();
      const json = await res.json();
      const team = (json.data ?? []).find((s: PageSection) => s.section_key === 'team');
      setSection(team ?? null);
      const items = (team?.content?.items as Array<Record<string, string>>) ?? [];
      setMembers(items);
    } catch {
      toast.error('Impossible de charger l\'équipe');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const saveItems = async (next: Array<Record<string, string>>) => {
    if (!section) {
      toast.error('Section équipe introuvable');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/sections/${section.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...section,
          content: { ...section.content, items: next },
          updated_by: 'admin',
        }),
      });
      if (!res.ok) throw new Error();
      setMembers(next);
      toast.success('Équipe mise à jour — visible sur la page À propos');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setEditingIndex(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (i: number) => {
    setEditingIndex(i);
    setForm({ name: members[i].name ?? '', role: members[i].role ?? '', photo: members[i].photo ?? '' });
    setFormOpen(true);
  };

  const save = async () => {
    if (!form.name.trim()) {
      toast.error('Le nom est obligatoire');
      return;
    }
    const next = [...members];
    if (editingIndex === null) {
      next.push({ name: form.name.trim(), role: form.role.trim(), photo: form.photo });
    } else {
      next[editingIndex] = { name: form.name.trim(), role: form.role.trim(), photo: form.photo };
    }
    await saveItems(next);
    setFormOpen(false);
  };

  const remove = async (i: number) => {
    if (!window.confirm(`Supprimer ${members[i].name ?? 'ce membre'} ?`)) return;
    await saveItems(members.filter((_, idx) => idx !== i));
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion de l'Équipe</h1>
          <p className="text-sm text-gray-400 mt-1">Les membres affichés sur la page À propos. Modifications visibles immédiatement.</p>
        </div>
        <button onClick={openCreate}
          className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all duration-300 active:scale-[0.98] flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </button>
      </div>

      {!section && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
          <p className="text-sm text-gray-500">Section équipe introuvable sur la page À propos.</p>
        </div>
      )}

      {section && (
        <>
          {formOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="w-full max-w-md bg-bg-card border border-white/10 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
                  <h2 className="text-lg font-semibold text-white">{editingIndex === null ? 'Nouveau membre' : 'Modifier le membre'}</h2>
                  <button onClick={() => setFormOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <Field label="Nom *">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jean-Marc Kabeya" className={inputCls} />
                  </Field>
                  <Field label="Rôle">
                    <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="Directeur Technique" className={inputCls} />
                  </Field>
                  <Field label="Photo de profil">
                    <ImageUploader
                      value={form.photo}
                      onChange={(photo) => setForm({ ...form, photo })}
                      placeholder="/images/… ou https://…"
                    />
                  </Field>
                </div>
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/6">
                  <button onClick={() => setFormOpen(false)} className="h-10 px-4 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white transition-colors">
                    Annuler
                  </button>
                  <button onClick={save} disabled={saving}
                    className="h-10 px-5 rounded-xl bg-green text-white text-sm font-semibold hover:bg-green-dark transition-all disabled:opacity-50 flex items-center gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {editingIndex === null ? 'Ajouter' : 'Enregistrer'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-3.5 grid-cols-2 lg:grid-cols-4">
            {members.map((member, i) => (
              <div key={i} className="group relative rounded-lg border border-border bg-bg-card p-3.5 text-center transition-all duration-[0.45s] ease-premium will-change-transform hover:-translate-y-1 hover:border-green/25 hover:shadow-[0_16px_40px_rgba(0,0,0,0.35),0_0_20px_rgba(34,197,94,0.12)]">
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(i)}
                    className="h-7 w-7 rounded-lg bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => remove(i)}
                    className="h-7 w-7 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className={`mx-auto mb-2.5 flex h-14 w-14 items-center justify-center rounded-full ring-2 overflow-hidden ${member.photo ? 'ring-green/30' : accentColor(i)}`}>
                  {member.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.photo} alt={member.name ?? ''} className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <h4 className="text-[0.85rem] font-bold text-white mb-0.5">{member.name}</h4>
                <p className="text-xs font-medium text-green">{member.role}</p>
              </div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
              <p className="text-sm text-gray-500">Aucun membre. Ajoutez votre premier membre.</p>
            </div>
          )}
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
