import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';

const statusSchema = z.object({
  status: z.enum(['published', 'hidden', 'pending', 'spam']),
});

export async function GET(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || null;
    const supabase = getAdminClient();

    let query = supabase
      .from('news_comments')
      .select('*, post:news_posts(id, title, slug)')
      .order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    const rows = (data ?? []).map((c) => {
      const r = c as Record<string, unknown> & { post?: { id: string; title: string; slug: string } | null };
      return {
        id: r.id,
        post_id: r.post_id,
        author_name: r.author_name,
        content: r.content,
        anonymous_visitor_id: r.anonymous_visitor_id,
        status: r.status,
        created_at: r.created_at,
        post: r.post ?? null,
      };
    });
    return NextResponse.json({ data: rows });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

    const body = await request.json();
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from('news_comments')
      .update({ status: parsed.data.status })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });

    const supabase = getAdminClient();
    const { error } = await supabase.from('news_comments').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
