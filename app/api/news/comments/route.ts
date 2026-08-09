import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const MAX_COMMENTS_PER_WINDOW = 3;
const RATE_WINDOW_MS = 2 * 60 * 1000; // 2 minutes
const MAX_CONTENT_LENGTH = 2000;

const commentSchema = z.object({
  postId: z.string().uuid('postId invalide'),
  authorName: z
    .string()
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(60, 'Le nom est trop long')
    .refine((v) => v.replace(/\s/g, '').length >= 2, 'Le nom est obligatoire'),
  content: z
    .string()
    .trim()
    .min(3, 'Le commentaire est trop court')
    .max(MAX_CONTENT_LENGTH, 'Le commentaire est trop long'),
  visitorId: z.string().trim().min(8).max(120).optional().default(''),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = commentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Données invalides' },
        { status: 400 },
      );
    }

    const { postId, authorName, content, visitorId } = parsed.data;
    const supabase = await createClient();

    // Post must exist and be published
    const { data: post } = await supabase
      .from('news_posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'published')
      .single();
    if (!post) {
      return NextResponse.json({ error: 'Actualité introuvable' }, { status: 404 });
    }

    // Basic anti-spam: rate limit per visitor
    if (visitorId) {
      const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
      const { count } = await supabase
        .from('news_comments')
        .select('*', { count: 'exact', head: true })
        .eq('anonymous_visitor_id', visitorId)
        .gte('created_at', since);
      if ((count ?? 0) >= MAX_COMMENTS_PER_WINDOW) {
        return NextResponse.json(
          { error: 'Trop de commentaires. Réessayez dans quelques minutes.' },
          { status: 429 },
        );
      }
    }

    const { data, error } = await supabase
      .from('news_comments')
      .insert({
        post_id: postId,
        author_name: authorName,
        content,
        anonymous_visitor_id: visitorId,
        status: 'published',
      })
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
