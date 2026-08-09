import { NextRequest, NextResponse } from 'next/server';
import { fetchPublishedNews } from '@/lib/news-queries';

const VALID_SORTS = ['latest', 'oldest', 'likes', 'comments'];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12', 10) || 12));
    const categorySlug = searchParams.get('category') || null;
    const visitorId = searchParams.get('visitorId') || null;
    const q = searchParams.get('q') || null;
    const tag = searchParams.get('tag') || null;
    const sortRaw = searchParams.get('sort') || 'latest';
    const sort = (VALID_SORTS.includes(sortRaw) ? sortRaw : 'latest') as 'latest' | 'oldest' | 'likes' | 'comments';

    const { posts, total } = await fetchPublishedNews({ page, limit, categorySlug, visitorId, q, tag, sort });
    return NextResponse.json({ data: posts, total, page, limit, sort });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
