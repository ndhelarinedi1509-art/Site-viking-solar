import { NextResponse } from 'next/server'
import { getSessionFromCookie } from '@/lib/admin-auth'

export async function GET() {
  try {
    const session = await getSessionFromCookie()
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    return NextResponse.json({
      authenticated: true,
      user: { id: session.userId, email: session.email, name: session.name, role: session.role },
    })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
