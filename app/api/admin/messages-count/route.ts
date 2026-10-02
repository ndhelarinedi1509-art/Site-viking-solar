import { NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Nombre de demandes de devis non lues.
 *
 * Endpoint dedie au badge de navigation et a la notification du tableau de bord :
 * il renvoie un entier seul, ce qui permet de le sonder souvent sans
 * transferer toute la boite de reception.
 */
export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');

    if (error) throw error;
    return NextResponse.json({ count: count ?? 0 });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
