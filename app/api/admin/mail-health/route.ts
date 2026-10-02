import { NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { checkMailConfig } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Etat de la chaine e-mail, affiche sous forme d'alarme dans le back-office.
 * Sans cela, une configuration SMTP cassee ne se remarque qu'au moment
 * ou un client signale que sa demande n'est jamais arrivee.
 */
export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const problems = checkMailConfig();
  return NextResponse.json({
    ok: problems.length === 0,
    problems,
    notifyTo: process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER || null,
  });
}
