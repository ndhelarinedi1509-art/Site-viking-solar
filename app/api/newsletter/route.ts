import { NextResponse } from 'next/server';
import { z } from 'zod';

const newsletterSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Données invalides' },
        { status: 400 },
      );
    }

    // TODO: Save to Supabase
    console.log('Newsletter subscription:', result.data.email);

    return NextResponse.json(
      { message: 'Inscription à la newsletter réussie' },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    );
  }
}
