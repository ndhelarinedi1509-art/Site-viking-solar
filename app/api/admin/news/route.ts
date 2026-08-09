import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';

const postSchema = z.object({
  title: z.string().trim().min(3, 'Le titre est obligatoire').max(200),
  excerpt: z.string().trim().max(500).optional().default(''),
  content: z.string().trim().min(3, 'Le contenu est obligatoire'),
  cover_image: z.string().trim().max(1000).optional().default(''),
  category_id: z.string().uuid().nullable().optional().default(null),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  is_pinned: z.boolean().default(false),
  published_at: z.string().nullable().optional().default(null),
});

function toCamel(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    cover_image: row.cover_image,
    category_id: row.category_id,
    status: row.status,
    is_pinned: row.is_pinned,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('news_posts')
      .select('*, category:news_categories(name, slug, color), news_likes(count), news_comments(count)')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    const rows = (data ?? []).map((row) => {
      const r = row as Record<string, unknown> & {
        category?: { name: string; slug: string; color: string } | null;
        news_likes?: { count: number }[];
        news_comments?: { count: number }[];
      };
      return {
        ...toCamel(r),
        category: r.category ?? null,
        like_count: r.news_likes?.[0]?.count ?? 0,
        comment_count: r.news_comments?.[0]?.count ?? 0,
      };
    });
    return NextResponse.json({ data: rows });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Données invalides' }, { status: 400 });
    }

    const supabase = getAdminClient();
    let slug = slugify(parsed.data.title);
    const { data: existing } = await supabase
      .from('news_posts')
      .select('slug')
      .eq('slug', slug)
      .limit(1);
    if (existing && existing.length > 0) {
      slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    }

    const publishedAt =
      parsed.data.published_at ??
      (parsed.data.status === 'published' ? new Date().toISOString() : null);

    const { data, error } = await supabase
      .from('news_posts')
      .insert({
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
      .select('*, category:news_categories(name, slug, color)')
      .single();
    if (error) throw error;
    return NextResponse.json({ data: toCamel(data as Record<string, unknown>) }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
