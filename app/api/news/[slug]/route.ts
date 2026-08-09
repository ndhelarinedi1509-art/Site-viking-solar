import { NextRequest, NextResponse } from 'next/server';
import { fetchNewsBySlug, fetchPublishedComments } from '@/lib/news-queries';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get('visitorId') || null;

    const post = await fetchNewsBySlug(slug, visitorId);
    if (!post) {
      return NextResponse.json({ error: 'Actualité introuvable' }, { status: 404 });
    }
    const comments = await fetchPublishedComments(post.id);
    return NextResponse.json({ data: post, comments });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
