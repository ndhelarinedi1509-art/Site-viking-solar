import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';

const projectSchema = z.object({
  title: z.string().trim().min(2, 'Le titre est obligatoire').max(200),
  description: z.string().trim().max(2000).optional().default(''),
  category: z.string().trim().max(100).optional().default(''),
  power: z.string().trim().max(50).optional().default(''),
  location: z.string().trim().max(200).optional().default(''),
  tags: z.array(z.string()).optional().default([]),
  features: z.array(z.string()).optional().default([]),
  image: z.string().trim().max(1000).optional().default(''),
  date: z.string().optional().default(() => new Date().toISOString().slice(0, 10)),
  sort_order: z.number().int().optional().default(0),
  is_published: z.boolean().default(true),
});

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Données invalides' }, { status: 400 });
    }

    const supabase = getAdminClient();
    let slug = slugify(parsed.data.title);
    const { data: existing } = await supabase
      .from('projects')
      .select('slug')
      .eq('slug', slug)
      .limit(1);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const { data, error } = await supabase
      .from('projects')
      .insert({ ...parsed.data, slug })
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
