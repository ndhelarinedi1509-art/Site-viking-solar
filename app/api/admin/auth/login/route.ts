import { NextResponse } from 'next/server'
import { z } from 'zod'
import { authenticate, createSession, setSessionCookie } from '@/lib/admin-auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
    }
    const { email, password } = result.data
    const user = await authenticate(email, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    const sessionId = await createSession(user.id)
    await setSessionCookie(sessionId)
    return NextResponse.json({
      message: 'Login successful',
      user: { email: user.email, name: user.name, role: user.role },
    })
  } catch {
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}
