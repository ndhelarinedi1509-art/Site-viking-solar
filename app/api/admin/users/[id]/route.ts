import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromCookie, updateAdminUser, deleteAdminUser } from '@/lib/admin-auth'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  is_active: z.boolean().optional(),
})

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie()
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  if (id === session.userId) {
    return NextResponse.json({ error: 'Cannot modify your own account from this endpoint' }, { status: 400 })
  }
  try {
    const body = await request.json()
    const result = updateSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid data' }, { status: 400 })
    }
    const user = await updateAdminUser(id, result.data)
    return NextResponse.json({ data: { id: user.id, email: user.email, name: user.name, role: user.role, isActive: user.is_active } })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Update failed' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookie()
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const { id } = await params
  if (id === session.userId) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 })
  }
  try {
    await deleteAdminUser(id)
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Delete failed' }, { status: 500 })
  }
}
