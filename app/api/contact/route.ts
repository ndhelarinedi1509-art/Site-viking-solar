import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(1, 'Le nom complet est requis'),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  phone: z.string().min(1, 'Le téléphone est requis'),
  service: z.string().min(1, 'Le service est requis'),
  message: z.string().min(1, 'Le message est requis'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Données invalides' },
        { status: 400 },
      );
    }

    // TODO: Save to Supabase
    console.log('Contact form submission:', result.data);

    return NextResponse.json(
      { message: 'Message envoyé avec succès' },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    );
  }
}
