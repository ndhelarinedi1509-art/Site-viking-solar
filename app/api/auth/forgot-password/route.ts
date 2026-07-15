import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vickingsolar.com';

    if (email !== adminEmail) {
      // Don't reveal whether email exists — always return success
      return NextResponse.json({ success: true });
    }

    // Generate a 6-digit reset code and store it
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const resetData = { code, expiresAt: Date.now() + 15 * 60 * 1000 };

    if (typeof process !== 'undefined') {
      // In production, this would send an email
      // For dev, we store in a global variable (or localStorage on client side)
      const globalThis_ = globalThis as unknown as Record<string, unknown>;
      globalThis_['__admin_reset_code'] = resetData;
    }

    return NextResponse.json({ success: true, code });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
