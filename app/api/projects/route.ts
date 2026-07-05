import { NextResponse } from 'next/server';
import { getProjects } from '@/lib/supabase/queries';

export async function GET() {
  try {
    const projects = await getProjects();

    return NextResponse.json({ data: projects });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    );
  }
}
