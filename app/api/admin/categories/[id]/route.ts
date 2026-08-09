import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';

const updateSchema = z.object({
  name: z.string().trim().min(2, 'Le nom est obligatoire').max(80),
  color: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Couleur invalide'),
  sort_order: z.number().int(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Données invalides' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const slug = slugify(parsed.data.name);
    const { data, error } = await supabase
      .from('news_categories')
      .update({
        name: parsed.data.name,
        slug,
        color: parsed.data.color,
        sort_order: parsed.data.sort_order,
      })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;
    const supabase = getAdminClient();
    const { error } = await supabase.from('news_categories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
