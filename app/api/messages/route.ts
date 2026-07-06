import { NextResponse } from 'next/server';
import { getContactMessages } from '@/lib/supabase/queries';
import { serverT } from '@/lib/i18n/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '20', 10);

    const result = await getContactMessages({ page, limit });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: serverT('error.description') },
      { status: 500 }
    );
  }
}
