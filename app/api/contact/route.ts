import { NextResponse } from 'next/server';
import { z } from 'zod';
import { serverT } from '@/lib/i18n/server';
import { createContactMessage } from '@/lib/supabase/queries';
import { sendContactEmails } from '@/lib/mail';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z.string().min(1, 'Phone is required'),
  service: z.string().min(1, 'Service is required'),
  message: z.string().min(1, 'Message is required'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const firstError = result.error.issues[0];
      return NextResponse.json(
        { error: firstError?.message || 'Invalid data' },
        { status: 400 },
      );
    }

    const data = result.data;

    // Save to Supabase (best effort — never block the form on storage failure)
    try {
      await createContactMessage(data);
    } catch (err) {
      console.error('Failed to save contact message:', err);
    }

    // Notify admin + send acknowledgment email
    await sendContactEmails(data);

    return NextResponse.json(
      { message: serverT('contact.form.success') },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: serverT('error.description') },
      { status: 500 },
    );
  }
}