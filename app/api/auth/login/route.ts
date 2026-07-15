import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { serverT } from '@/lib/i18n/server';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid data' },
        { status: 400 },
      );
    }

    const { email, password } = result.data;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@vickingsolar.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: serverT('admin.login.error') },
        { status: 401 },
      );
    }

    // Create a simple session token
    const token = Buffer.from(
      JSON.stringify({ email, role: 'admin', ts: Date.now() })
    ).toString('base64');

    const cookieStore = await cookies();
    cookieStore.set('viking-admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({
      message: serverT('admin.login.submit'),
      user: { email, role: 'admin' },
    });
  } catch {
    return NextResponse.json(
      { error: serverT('error.description') },
      { status: 500 },
    );
  }
}
