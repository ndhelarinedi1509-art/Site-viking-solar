import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';

const updateSchema = z.object({
  title: z.string().trim().min(3, 'Le titre est obligatoire').max(200),
  excerpt: z.string().trim().max(500).optional().default(''),
  content: z.string().trim().min(3, 'Le contenu est obligatoire'),
  cover_image: z.string().trim().max(1000).optional().default(''),
  category_id: z.string().uuid().nullable().optional().default(null),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_pinned: z.boolean().default(false),
  published_at: z.string().nullable().optional().default(null),
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
    let slug = slugify(parsed.data.title);
    const { data: existing } = await supabase
      .from('news_posts')
      .select('slug')
      .eq('slug', slug)
      .neq('id', id)
      .limit(1);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const publishedAt =
      parsed.data.published_at ??
      (parsed.data.status === 'published' ? new Date().toISOString() : null);

    const { data, error } = await supabase
      .from('news_posts')
      .update({
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        cover_image: parsed.data.cover_image,
        category_id: parsed.data.category_id,
        status: parsed.data.status,
        is_pinned: parsed.data.is_pinned,
        published_at: publishedAt,
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
    const { error } = await supabase.from('news_posts').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
