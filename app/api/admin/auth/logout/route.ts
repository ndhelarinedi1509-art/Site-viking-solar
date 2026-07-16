import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { destroySession } from '@/lib/admin-auth'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('viking-admin-session')?.value
    if (sessionId) {
      await destroySession(sessionId)
    }
  } catch { /* ignore */ }
  const response = NextResponse.json({ success: true })
  response.cookies.set('viking-admin-session', '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
  return response
}
