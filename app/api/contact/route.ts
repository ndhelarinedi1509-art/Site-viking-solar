import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serverT } from '@/lib/i18n/server';
import { createContactMessage } from '@/lib/supabase/queries';
import { sendContactEmails, MailNotConfiguredError } from '@/lib/mail';

export const runtime = 'nodejs';

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(1).max(40),
  service: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(5000),
});

/** Anti-spam basique : un meme client ne peut pas inonder la boite de reception. */
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX || 5);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 3_600_000);

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

function rateLimit(key: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();

  if (now - lastSweep > RATE_LIMIT_WINDOW_MS) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    lastSweep = now;
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX) {
    return {
      allowed: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for') ?? '';
    const ip = (forwarded.split(',')[0] || request.headers.get('x-real-ip') || 'local').trim();

    const limit = rateLimit(ip);
    if (!limit.allowed) {
      console.warn(`[contact] rate limit bloque pour ${ip}`);
      return NextResponse.json(
        { error: serverT('error.description') },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      );
    }

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || 'Invalid data' },
        { status: 400 },
      );
    }

    const data = result.data;

    // Canal 1 : base de donnees (back-office). Canal 2 : e-mail a l'admin.
    let saved = false;
    try {
      await createContactMessage(data);
      saved = true;
    } catch (err) {
      console.error('[contact] echec d’enregistrement en base :', err);
    }

    // Canal 2 : e-mail. Ne doit jamais echouer silencieusement.
    let emailed = false;
    try {
      await sendContactEmails(data);
      emailed = true;
    } catch (err) {
      const reason =
        err instanceof MailNotConfiguredError ? err.problems.join(' ; ') : String(err);
      console.error(
        `\n[contact] *** LA DEMANDE DE DEVIS N'A PAS ETE NOTIFIEE PAR E-MAIL ***\n` +
          `[contact] client=${data.email} service=${data.service} enregistre_en_base=${saved}\n` +
          `[contact] cause=${reason}\n`,
      );
      // Le devis reste consultable dans le back-office si `saved` est vrai ;
      // sinon le bloc ci-dessous renvoie un 503 pour ne pas perdre la demande.
    }

    // Aucun canal n'a fonctionne : on ne doit pas dire « merci » au visiteur.
    if (!saved && !emailed) {
      return NextResponse.json({ error: serverT('error.description') }, { status: 503 });
    }

    return NextResponse.json(
      { message: serverT('contact.form.success'), notifiedByEmail: emailed },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ error: serverT('error.description') }, { status: 500 });
  }
}
