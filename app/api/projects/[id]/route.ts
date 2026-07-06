import { NextResponse } from 'next/server';
import { getProjectById } from '@/lib/supabase/queries';
import { serverT } from '@/lib/i18n/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json(
        { error: serverT('error.notFoundTitle') },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    return NextResponse.json(
      { error: serverT('error.description') },
      { status: 500 }
    );
  }
}
