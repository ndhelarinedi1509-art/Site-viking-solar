import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    // Log for Vercel / server-side visibility
    // eslint-disable-next-line no-console
    console.log('Client error received:', JSON.stringify(data));
    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse client error payload', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
