import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serverT } from '@/lib/i18n/server';

const newsletterSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid data' },
        { status: 400 },
      );
    }

    // TODO: Save to Supabase
    console.log('Newsletter subscription:', result.data.email);

    return NextResponse.json(
      { message: serverT('footer.newsletter.success') },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: serverT('error.description') },
      { status: 500 },
    );
  }
}
