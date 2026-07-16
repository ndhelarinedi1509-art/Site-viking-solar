import { NextResponse } from 'next/server'
import { z } from 'zod'
import { hasAnyAdmin, createFirstSuperAdmin, setSessionCookie, createSession } from '@/lib/admin-auth'

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
})

export async function GET() {
  const exists = await hasAnyAdmin()
  return NextResponse.json({ setupRequired: !exists })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = setupSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
    }
    const { email, password, name } = result.data
    const user = await createFirstSuperAdmin({ email, password, name })
    const sessionId = await createSession(user.id)
    await setSessionCookie(sessionId)
    return NextResponse.json({ message: 'Super Admin created successfully', user: { email: user.email, name: user.name, role: user.role } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Setup failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
