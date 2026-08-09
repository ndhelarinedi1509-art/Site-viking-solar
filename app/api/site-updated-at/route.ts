import { NextResponse } from 'next/server';
import { getAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const TABLES = ['page_sections', 'services', 'projects'] as const;

export async function GET() {
  try {
    const supabase = getAdminClient();
    let updatedAt: string | null = null;

    for (const table of TABLES) {
      const { data, error } = await supabase
        .from(table)
        .select('updated_at')
        .order('updated_at', { ascending: false })
        .limit(1);
      if (error) continue;
      const ts = data?.[0]?.updated_at as string | undefined;
      if (ts && (!updatedAt || ts > updatedAt)) updatedAt = ts;
    }

    return NextResponse.json({ updatedAt });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
