'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Save, Eye, Loader2, Plus, Trash2, GripVertical, CheckCircle2, Info,
} from 'lucide-react';
import Link from 'next/link';
import { SectionEditor } from '@/components/admin/section-editor';
import type { PageSection } from '@/types';
import { toast } from 'sonner';

const pageLabels: Record<string, string> = {
  home: 'Accueil', actualites: 'Actualités', about: 'À propos',
  services: 'Services', projects: 'Projets', contact: 'Contact',
};

const sectionTypeLabels: Record<string, string> = {
  hero: 'Hero', text: 'Texte', cards: 'Cartes', 'image-text': 'Image + Texte',
  cta: 'Appel à action', gallery: 'Galerie', faq: 'FAQ', team: 'Équipe',
  stats: 'Statistiques', benefits: 'Avantages',
  'services-grid': 'Services (grille)', 'services-process': 'Processus',
  testimonials: 'Témoignages', 'contact-form': 'Formulaire de contact',
};

// Sections whose content is shared with another page and must not be edited here.
const sharedSectionNotes: Record<string, string> = {
  'services/benefits': 'Section partagée avec l\'accueil : le titre et les éléments proviennent de la page Accueil (section « Pourquoi choisir Viking Solar ? »). Modifiez-les depuis Accueil.',
};

function toPayload(section: PageSection, publish: boolean): Partial<PageSection> {
  return {
    page_key: section.page_key,
    section_key: section.section_key,
    section_type: section.section_type,
    label: section.label,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    content: section.content,
    images: section.images,
    sort_order: section.sort_order,
    is_published: publish ? true : section.is_published,
    updated_by: 'admin',
  };
}

export default function AdminPageEditor() {
  const { t } = useTranslation();
  const params = useParams();
  const pageKey = params.pageKey as string;

  const [sections, setSections] = useState<PageSection[]>([]);
  const [drafts, setDrafts] = useState<Record<string, PageSection>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savingAll, setSavingAll] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/sections?pageKey=${pageKey}`);
      const json = await res.json();
      setSections(json.data ?? []);
      setDrafts({});
    } catch (err) {
      toast.error('Erreur lors du chargement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const handleChange = useCallback((id: string, next: PageSection) => {
    setDrafts((prev) => ({ ...prev, [id]: next }));
  }, []);

  const saveSection = useCallback(async (id: string, publish: boolean) => {
    const current = sections.find((s) => s.id === id);
    if (!current) return;
    const draft = drafts[id] ?? current;
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(draft, publish)),
      });
      if (!res.ok) throw new Error('Save failed');
      setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...toPayload(draft, publish) } : s)));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success(publish ? 'Section publiée' : 'Section enregistrée');
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSavingId(null);
    }
  }, [sections, drafts]);

  const handlePublishAll = useCallback(async () => {
    setSavingAll(true);
    try {
      for (const section of sections) {
        const draft = drafts[section.id] ?? section;
        const res = await fetch(`/api/admin/sections/${section.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toPayload(draft, true)),
        });
        if (!res.ok) throw new Error('Publish failed');
      }
      setSections((prev) => prev.map((s) => ({ ...s, ...(drafts[s.id] ?? s), is_published: true })));
      setDrafts({});
      toast.success('Toutes les sections sont publiées');
    } catch {
      toast.error('Erreur lors de la publication');
    } finally {
      setSavingAll(false);
    }
  }, [sections, drafts]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSections((prev) => prev.filter((s) => s.id !== id));
      setDrafts((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success('Section supprimée');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  }, []);

  const handleAddSection = useCallback(async () => {
    const newSection = {
      page_key: pageKey,
      section_key: `section-${Date.now()}`,
      section_type: 'text',
      label: 'Nouvelle section',
      title: '',
      subtitle: '',
      description: '',
      content: {},
      images: [],
      sort_order: sections.length * 10,
      is_published: true,
    };
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
      if (!res.ok) throw new Error('Create failed');
      toast.success('Section ajoutée — elle apparaît sur le site dès qu\'elle est publiée');
      fetchSections();
    } catch {
      toast.error('Erreur lors de la création');
    }
  }, [pageKey, sections.length, fetchSections]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{pageLabels[pageKey] ?? pageKey}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{sections.length} section{sections.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link href={`/${pageKey === 'home' ? '' : pageKey}`} target="_blank"
            className="h-10 px-4 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {t('admin.pages.preview')}
          </Link>
          <button onClick={handlePublishAll} disabled={savingAll}
            className="h-10 px-5 rounded-xl bg-green text-bg-primary text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50">
            {savingAll ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            Tout publier
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const draft = drafts[section.id];
          const current = draft ?? section;
          const hasDraft = Boolean(draft);
          const isSaving = savingId === section.id;
          const sharedNote = sharedSectionNotes[`${pageKey}/${section.section_key}`];
          return (
            <div key={section.id} className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-hidden">
              {/* Section header */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3 border-b border-white/6 bg-white/2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="cursor-grab opacity-40 hover:opacity-100 transition-opacity">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{section.label || 'Section sans titre'}</span>
                    <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                      {sectionTypeLabels[section.section_type] ?? section.section_type}
                    </span>
                    {hasDraft && (
                      <span className="text-[0.65rem] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber/10 text-amber">
                        Modifiée
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block w-2 h-2 rounded-full ${current.is_published ? 'bg-green' : 'bg-gray-500'}`} />
                  <span className="text-xs text-gray-500">{current.is_published ? 'Publiée' : 'Brouillon'}</span>
                  <span className="text-xs text-gray-600">| Ordre {section.sort_order / 10 + 1}</span>
                  <button onClick={() => handleDelete(section.id)}
                    className="ml-2 h-7 w-7 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Section editor */}
              {sharedNote ? (
                <div className="p-4 sm:p-5">
                  <div className="rounded-xl border border-green/20 bg-green/5 p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-green shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">Section partagée</p>
                      <p className="text-sm text-gray-400 mt-0.5">{sharedNote}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 sm:p-5">
                  <SectionEditor section={current} onChange={(next) => handleChange(section.id, next)} />
                </div>
              )}

              {/* Per-section actions */}
              {!sharedNote && (
                <div className="flex items-center justify-end gap-2 px-4 sm:px-5 py-3 border-t border-white/6 bg-white/2">
                  <button
                    onClick={() => saveSection(section.id, false)}
                    disabled={!hasDraft || isSaving}
                    className="h-9 px-4 rounded-xl border border-white/10 text-sm font-medium text-gray-300 hover:text-white hover:border-white/25 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Enregistrer
                  </button>
                  <button
                    onClick={() => saveSection(section.id, true)}
                    disabled={isSaving}
                    className="h-9 px-4 rounded-xl bg-green text-bg-primary text-sm font-semibold hover:bg-green-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Publier
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {sections.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <p className="text-sm text-gray-500">Aucune section. Ajoutez votre première section.</p>
          </div>
        )}
      </div>

      {/* Add section button */}
      <button onClick={handleAddSection}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-sm font-medium text-gray-500 hover:text-green hover:border-green/30 transition-all flex items-center justify-center gap-2">
        <Plus className="h-4 w-4" />
        Ajouter une section
      </button>
    </div>
  );
}
