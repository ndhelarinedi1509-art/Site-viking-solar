import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('viking-admin-session');

  if (!session?.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const data = JSON.parse(Buffer.from(session.value, 'base64').toString());
    return NextResponse.json({ authenticated: true, user: data });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
