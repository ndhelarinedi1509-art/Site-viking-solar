import { NextResponse } from 'next/server';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Données invalides' },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    if (password !== 'password') {
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: 'Connexion réussie',
      user: { email, role: 'admin' },
    });
  } catch {
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 },
    );
  }
}
