'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft, Save, Eye, Loader2, Plus, Trash2, GripVertical,
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
};

export default function AdminPageEditor() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const pageKey = params.pageKey as string;

  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/sections?pageKey=${pageKey}`);
      const json = await res.json();
      setSections(json.data ?? []);
    } catch (err) {
      toast.error('Erreur lors du chargement');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pageKey]);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const handleUpdate = useCallback(async (id: string, updates: Partial<PageSection>) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    try {
      const res = await fetch(`/api/admin/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Update failed');
    } catch {
      toast.error('Erreur lors de la sauvegarde');
      fetchSections();
    }
  }, [fetchSections]);

  const handleReorder = useCallback(async (id: string, newOrder: number) => {
    await handleUpdate(id, { sort_order: newOrder } as Partial<PageSection>);
  }, [handleUpdate]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setSections((prev) => prev.filter((s) => s.id !== id));
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
      toast.success('Section ajoutée');
      fetchSections();
    } catch {
      toast.error('Erreur lors de la création');
    }
  }, [pageKey, sections.length, fetchSections]);

  const handlePublishAll = useCallback(async () => {
    setSaving(true);
    try {
      for (const section of sections) {
        const res = await fetch(`/api/admin/sections/${section.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_published: true }),
        });
        if (!res.ok) throw new Error('Publish failed');
      }
      setSections((prev) => prev.map((s) => ({ ...s, is_published: true })));
      toast.success('Toutes les sections sont publiées');
    } catch {
      toast.error('Erreur lors de la publication');
    } finally {
      setSaving(false);
    }
  }, [sections]);

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/pages" className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">{pageLabels[pageKey] ?? pageKey}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{sections.length} section{sections.length > 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${pageKey === 'home' ? '' : pageKey}`} target="_blank"
            className="h-10 px-4 rounded-xl border border-white/10 text-sm font-medium text-gray-400 hover:text-white hover:border-white/20 transition-all flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {t('admin.pages.preview')}
          </Link>
          <button onClick={handlePublishAll} disabled={saving}
            className="h-10 px-5 rounded-xl bg-green text-bg-primary text-sm font-semibold hover:bg-green-dark hover:shadow-glow transition-all flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {t('admin.pages.publishAll')}
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={section.id} className="bg-bg-card border border-white/6 rounded-2xl shadow-card overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/6 bg-white/2">
              <div className="flex items-center gap-3">
                <div className="cursor-grab opacity-40 hover:opacity-100 transition-opacity">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">{section.label || 'Section sans titre'}</span>
                  <span className="ml-2 text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                    {sectionTypeLabels[section.section_type] ?? section.section_type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block w-2 h-2 rounded-full ${section.is_published ? 'bg-green' : 'bg-gray-500'}`} />
                <span className="text-xs text-gray-500">{section.is_published ? 'Publié' : 'Brouillon'}</span>
                <span className="text-xs text-gray-600">| Ordre {idx + 1}</span>
                <button onClick={() => handleDelete(section.id)}
                  className="ml-2 h-7 w-7 rounded-lg bg-accent-red/10 text-accent-red hover:bg-accent-red/20 flex items-center justify-center transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Section editor */}
            <div className="p-5">
              <SectionEditor section={section} onUpdate={handleUpdate} />
            </div>
          </div>
        ))}
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
