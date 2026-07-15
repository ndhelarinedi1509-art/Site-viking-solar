import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4),
  password: z.string().min(4),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code, password } = schema.parse(body);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vickingsolar.com';

    if (email !== adminEmail) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const globalThis_ = globalThis as unknown as Record<string, unknown>;
    const resetData = globalThis_['__admin_reset_code'] as { code: string; expiresAt: number } | undefined;

    if (!resetData || resetData.code !== code || Date.now() > resetData.expiresAt) {
      return NextResponse.json({ error: 'Code invalide ou expiré' }, { status: 400 });
    }

    // Update password in memory (in production, update DB)
    const envKey = 'ADMIN_PASSWORD';
    // For this dev session, store in a global
    globalThis_['__admin_password'] = password;

    // Clear the reset code
    delete globalThis_['__admin_reset_code'];

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
