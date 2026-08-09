import { NextResponse } from 'next/server';
import { fetchNewsCategories } from '@/lib/news-queries';

export async function GET() {
  try {
    const categories = await fetchNewsCategories();
    return NextResponse.json({ data: categories });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
