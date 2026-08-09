import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const likeSchema = z.object({
  postId: z.string().uuid('postId invalide'),
  visitorId: z.string().trim().min(8).max(120),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = likeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Données invalides' },
        { status: 400 },
      );
    }

    const { postId, visitorId } = parsed.data;
    const supabase = await createClient();

    const { data: post } = await supabase
      .from('news_posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'published')
      .single();
    if (!post) {
      return NextResponse.json({ error: 'Actualité introuvable' }, { status: 404 });
    }

    // Check existing like
    const { data: existing } = await supabase
      .from('news_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('anonymous_visitor_id', visitorId)
      .limit(1);

    let liked: boolean;
    if (existing && existing.length > 0) {
      await supabase
        .from('news_likes')
        .delete()
        .eq('post_id', postId)
        .eq('anonymous_visitor_id', visitorId);
      liked = false;
    } else {
      const { error: insertError } = await supabase
        .from('news_likes')
        .insert({ post_id: postId, anonymous_visitor_id: visitorId });
      if (insertError) {
        // Unique constraint race → treat as already liked
        const { count } = await supabase
          .from('news_likes')
          .select('*', { count: 'exact', head: true })
          .eq('post_id', postId)
          .eq('anonymous_visitor_id', visitorId);
        if ((count ?? 0) > 0) liked = true;
        else throw insertError;
      } else {
        liked = true;
      }
    }

    const { count } = await supabase
      .from('news_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId);

    return NextResponse.json({ liked, count: count ?? 0 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
