import { createClient } from '@/lib/supabase/server';
import type { NewsPost, NewsComment } from '@/types';

type PostRow = NewsPost & {
  category: NewsCategoryRow | null;
  news_likes?: { count: number }[];
  news_comments?: { count: number }[];
};

type NewsCategoryRow = {
  id: string;
  name: string;
  slug: string;
  color: string;
  sort_order: number;
  created_at: string;
};

function isMissingTable(error: unknown): boolean {
  const message = (error as { message?: string })?.message ?? '';
  return (
    message.includes('does not exist') ||
    message.includes('relation ') ||
    message.includes('42P01') ||
    message.includes('Could not find the table') ||
    message.includes('schema cache')
  );
}

function normalizePost(row: PostRow, likedIds?: Set<string>): NewsPost {
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
    category: row.category,
    like_count: row.news_likes?.[0]?.count ?? 0,
    comment_count: row.news_comments?.[0]?.count ?? 0,
    is_liked: likedIds ? likedIds.has(row.id) : false,
  };
}

export async function fetchPublishedNews(params: {
  limit?: number;
  page?: number;
  categorySlug?: string | null;
  visitorId?: string | null;
}) {
  const { limit = 12, page = 1, categorySlug, visitorId } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = await createClient();
  let query = supabase
    .from('news_posts')
    .select('*, category:news_categories(*), news_likes(count), news_comments(count)', {
      count: 'exact',
    })
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false })
    .range(from, to);

  if (categorySlug) {
    query = query.eq('news_categories.slug', categorySlug);
  }

  const { data, error, count } = await query;
  if (error) {
    if (isMissingTable(error)) return { posts: [], total: 0 };
    throw error;
  }

  let likedIds: Set<string> | undefined;
  if (visitorId) {
    const { data: likes, error: likesError } = await supabase
      .from('news_likes')
      .select('post_id')
      .eq('anonymous_visitor_id', visitorId);
    if (!likesError || isMissingTable(likesError)) {
      likedIds = new Set((likes ?? []).map((l) => l.post_id as string));
    }
  }

  const posts = (data ?? []).map((row) => normalizePost(row as PostRow, likedIds));
  return { posts, total: count ?? 0 };
}

export async function fetchNewsBySlug(slug: string, visitorId?: string | null) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_posts')
    .select('*, category:news_categories(*), news_likes(count), news_comments(count)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) return null;

  let liked = false;
  if (visitorId) {
    const { data: likes } = await supabase
      .from('news_likes')
      .select('id')
      .eq('post_id', data.id)
      .eq('anonymous_visitor_id', visitorId)
      .limit(1);
    liked = (likes?.length ?? 0) > 0;
  }

  const row = data as PostRow;
  const post = normalizePost(row);
  post.is_liked = liked;
  return post;
}

export async function fetchPublishedComments(postId: string): Promise<NewsComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_comments')
    .select('*')
    .eq('post_id', postId)
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error) {
    if (isMissingTable(error)) return [];
    throw error;
  }
  return (data ?? []) as NewsComment[];
}

export async function fetchNewsCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('news_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    if (isMissingTable(error)) return [];
    throw error;
  }
  return (data ?? []) as NewsCategoryRow[];
}
