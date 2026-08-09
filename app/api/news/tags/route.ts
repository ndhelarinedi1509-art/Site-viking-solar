import { NextResponse } from 'next/server';
import { fetchTrendingTags } from '@/lib/news-queries';

export async function GET() {
  try {
    const tags = await fetchTrendingTags(20);
    return NextResponse.json({ data: tags });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
