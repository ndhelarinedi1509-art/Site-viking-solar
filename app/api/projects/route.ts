import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/supabase/queries';
import { serverT } from '@/lib/i18n/server';

export async function GET() {
  try {
    const projects = await getProjects();

    return NextResponse.json({ data: projects });
  } catch (error) {
    return NextResponse.json(
      { error: serverT('error.description') },
      { status: 500 }
    );
  }
}
