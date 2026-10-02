import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Nombre de messages renvoyes au chargement de la boite de reception. */
const MAX_ROWS = 500;

/**
 * Boite de reception des demandes de devis.
 *
 * Renvoie la liste triee du plus recent au plus ancien, ainsi que le nombre de
 * messages non lus (badge de navigation + notification du tableau de bord).
 */
export async function GET(_request: NextRequest) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(MAX_ROWS);

    if (error) throw error;

    const unreadCount = (data ?? []).filter((m) => m.status === 'new').length;

    return NextResponse.json({ data: data ?? [], unreadCount });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
