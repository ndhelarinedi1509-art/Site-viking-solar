import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Protect admin routes using session cookie
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const sessionCookie = request.cookies.get('viking-admin-session')?.value;

    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    try {
      const data = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
      if (!data.email || data.role !== 'admin') {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // For now, Supabase SSR middleware is bypassed.
  // In production, uncomment below and configure Supabase Auth.
  //
  // const supabase = createServerClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  //   { cookies: { getAll() { return request.cookies.getAll(); }, ... } }
  // );

  return supabaseResponse;
}
