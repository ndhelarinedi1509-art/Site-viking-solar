import { NextResponse } from 'next/server';
import { getSessionFromCookie } from '@/lib/admin-auth';
import { getAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Chiffres reels du tableau de bord.
 *
 * Chaque valeur provient d'un comptage en base : aucune donnee ne doit etre
 * inventee, un faux total de projets ou de devis est pire qu'un champ vide.
 */
export async function GET() {
  const session = await getSessionFromCookie();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const supabase = getAdminClient();

    /** Nombre de lignes d'une table, avec le total renvoye par PostgREST. */
    const total = async (table: string) => {
      const { count, error } = await supabase
        .from(table)
        .select('id', { count: 'exact', head: true });
      if (error) throw error;
      return count ?? 0;
    };

    const [projects, quoteRequests, posts, subscribers, media] = await Promise.all([
      total('projects'),
      total('contact_messages'),
      total('news_posts'),
      total('newsletter_subscribers'),
      total('site_media'),
    ]);

    const { count: unreadQuotes, error: unreadError } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');

    if (unreadError) throw unreadError;

    const { data: latest, error: latestError } = await supabase
      .from('contact_messages')
      .select('id, name, email, phone, service, subject, message, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (latestError) throw latestError;

    return NextResponse.json({
      projects,
      quoteRequests,
      unreadQuotes,
      posts,
      subscribers,
      media,
      latestQuotes: latest ?? [],
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
