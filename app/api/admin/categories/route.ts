import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Le nom est obligatoire').max(80),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Couleur invalide').optional().default('#22C55E'),
  sort_order: z.number().int().optional().default(0),
});

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('news_categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = categorySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Données invalides' }, { status: 400 });
    }

    const supabase = getAdminClient();
    let slug = slugify(parsed.data.name);
    const { data: existing } = await supabase
      .from('news_categories')
      .select('slug')
      .eq('slug', slug)
      .limit(1);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const { data, error } = await supabase
      .from('news_categories')
      .insert({
        name: parsed.data.name,
        slug,
        color: parsed.data.color,
        sort_order: parsed.data.sort_order,
      })
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
