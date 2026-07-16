import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromCookie, listAdminUsers, createAdminUser } from '@/lib/admin-auth'

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required'),
})

export async function GET() {
  const session = await getSessionFromCookie()
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  try {
    const users = await listAdminUsers()
    return NextResponse.json({ data: users.map((u: { id: string; email: string; name: string; role: string; is_active: boolean; created_at: string; created_by: string | null }) => ({
      id: u.id, email: u.email, name: u.name, role: u.role, isActive: u.is_active, createdAt: u.created_at, createdBy: u.created_by,
    })) })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed to fetch users' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSessionFromCookie()
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  try {
    const body = await request.json()
    const result = createSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
    }
    const { email, password, name } = result.data
    const user = await createAdminUser({ email, password, name, createdBy: session.userId })
    return NextResponse.json({ data: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.is_active, createdAt: user.created_at } })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Creation failed'
    if (message.includes('duplicate') || message.includes('unique')) {
      return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
