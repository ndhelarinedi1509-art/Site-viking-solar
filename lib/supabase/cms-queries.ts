'use server';

import { createClient } from '@/lib/supabase/server';
import type { PageSection, SiteMedia, PageInfo } from '@/types';

// ── Page Sections ──

export async function getPageSections(pageKey: string): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getAllPages(): Promise<PageInfo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('page_key, is_published');
  if (error) throw error;

  const pageMap = new Map<string, { sections: number; published: boolean }>();
  for (const row of data ?? []) {
    const existing = pageMap.get(row.page_key) ?? { sections: 0, published: true };
    existing.sections++;
    if (!row.is_published) existing.published = false;
    pageMap.set(row.page_key, existing);
  }

  const pageLabels: Record<string, string> = {
    home: 'Accueil',
    actualites: 'Actualités',
    about: 'À propos',
    services: 'Services',
    projects: 'Projets',
    contact: 'Contact',
  };

  const pageIcons: Record<string, string> = {
    home: 'Home',
    actualites: 'Newspaper',
    about: 'Info',
    services: 'Zap',
    projects: 'FolderOpen',
    contact: 'Mail',
  };

  return Array.from(pageMap.entries()).map(([key, val]) => ({
    key,
    label: pageLabels[key] ?? key,
    icon: pageIcons[key] ?? 'File',
    sections: val.sections,
    published: val.published,
  }));
}

export async function getSectionById(id: string): Promise<PageSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data;
}

export async function updateSection(id: string, updates: Partial<PageSection>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('page_sections')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
}

export async function createSection(data: Partial<PageSection>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('page_sections')
    .insert(data);
  if (error) throw error;
}

export async function deleteSection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('page_sections')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── Media ──

export async function getMedia(): Promise<SiteMedia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_media')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function deleteMedia(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('site_media')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// ── Settings ──

export async function getSettings(): Promise<Record<string, unknown>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_settings')
    .select('*');
  if (error) throw error;
  return (data ?? []).reduce<Record<string, unknown>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}

export async function updateSetting(key: string, value: unknown) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });
  if (error) throw error;
}
