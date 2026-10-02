import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';
import { sendQuoteReply, MailNotConfiguredError } from '@/lib/mail';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const replySchema = z.object({
  body: z.string().trim().min(1, 'La reponse est obligatoire').max(8000),
});

/**
 * Repond a une demande de devis depuis le back-office.
 *
 * L'e-mail n'est envoye au client qu'apres validation du corps. La copie n'est
 * ecrite en base qu'une fois l'envoi confirme : en cas de panne SMTP on ne doit
 * pas faire passer une reponse non livree pour une reponse envoyee, et l'admi-
 * nistrateur doit pouvoir la renvoyer telle quelle.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { id } = await params;

    const body = await request.json().catch(() => null);
    const parsed = replySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }

    const supabase = getAdminClient();

    const { data: message, error: loadError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('id', id)
      .single();

    if (loadError) throw loadError;
    if (!message?.email) {
      return NextResponse.json({ error: 'Ce message n a pas d adresse e-mail' }, { status: 400 });
    }

    const reply = parsed.data.body;

    try {
      await sendQuoteReply({
        to: message.email,
        toName: message.name,
        originalSubject: message.subject ?? 'Demande de devis',
        originalMessage: message.message,
        service: message.service ?? '',
        body: reply,
      });
    } catch (err) {
      const reason =
        err instanceof MailNotConfiguredError ? err.problems.join(' ; ') : (err as Error).message;
      console.error(
        `[messages] reponse NON envoyee a ${message.email} (id=${id}) : ${reason}`,
      );
      return NextResponse.json({ error: reason, delivered: false }, { status: 502 });
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .update({
        status: 'replied',
        replied_at: new Date().toISOString(),
        replied_message: reply,
        replied_by: session.email,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json({ data, delivered: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
