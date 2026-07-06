import { NextResponse } from 'next/server';
import { z } from 'zod';
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

    if (password !== 'password') {
      return NextResponse.json(
        { error: serverT('admin.login.error') },
        { status: 401 },
      );
    }

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
