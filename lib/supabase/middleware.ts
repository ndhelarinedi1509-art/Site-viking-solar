import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const COOKIE_NAME = 'viking-admin-session'
const PUBLIC_ADMIN_ROUTES = ['/admin/login', '/admin/setup']

async function validateSession(sessionId: string) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } },
    )
    const { data: session } = await supabase
      .from('admin_sessions')
      .select('id, user_id, expires_at, admin_users!inner(id, email, name, role, is_active)')
      .eq('id', sessionId)
      .single()
    if (!session) return null
    const now = new Date()
    if (new Date(session.expires_at) <= now) return null
    const user = session.admin_users as unknown as { id: string; email: string; name: string; role: string; is_active: boolean }
    if (!user.is_active) return null
    return { userId: user.id, role: user.role }
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const pathname = request.nextUrl.pathname

  if (!pathname.startsWith('/admin')) {
    return supabaseResponse
  }

  if (PUBLIC_ADMIN_ROUTES.includes(pathname)) {
    return supabaseResponse
  }

  const sessionCookie = request.cookies.get(COOKIE_NAME)?.value

  if (!sessionCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  const session = await validateSession(sessionCookie)

  if (!session) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  if (pathname.startsWith('/admin/users') && session.role !== 'super_admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
