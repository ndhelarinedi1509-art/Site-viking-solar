import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageKey = searchParams.get('pageKey');
    const supabase = await createClient();

    if (pageKey) {
      const { data, error } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_key', pageKey)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return NextResponse.json({ data });
    }

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
      home: 'Accueil', actualites: 'Actualités', about: 'À propos',
      services: 'Services', projects: 'Projets', contact: 'Contact',
    };
    const pageIcons: Record<string, string> = {
      home: 'Home', actualites: 'Newspaper', about: 'Info',
      services: 'Zap', projects: 'FolderOpen', contact: 'Mail',
    };

    const pages = Array.from(pageMap.entries()).map(([key, val]) => ({
      key,
      label: pageLabels[key] ?? key,
      icon: pageIcons[key] ?? 'File',
      sections: val.sections,
      published: val.published,
    }));

    return NextResponse.json({ data: pages });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('page_sections')
      .insert(body)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
