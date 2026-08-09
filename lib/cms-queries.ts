import { createClient } from '@/lib/supabase/server';
import type { PageSection, CmsService, CmsProject } from '@/types';

export async function fetchPublishedSections(pageKey: string): Promise<PageSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('page_sections')
    .select('*')
    .eq('page_key', pageKey)
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as PageSection[];
}

export async function fetchServices(): Promise<CmsService[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data ?? []) as CmsService[];
}

export async function fetchProjects(): Promise<CmsProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('date', { ascending: false });
  if (error) throw error;
  return (data ?? []) as CmsProject[];
}

export function getSection(sections: PageSection[], sectionKey: string): PageSection | undefined {
  return sections.find((s) => s.section_key === sectionKey);
}
