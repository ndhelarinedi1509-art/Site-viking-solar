import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAndVerifyResetCode, changeUserPassword, clearResetCode } from '@/lib/admin-auth'

const schema = z.object({
  email: z.string().email(),
  code: z.string().min(4),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, code, password } = schema.parse(body)
    const verified = await getAndVerifyResetCode(email, code)
    if (!verified) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }
    await changeUserPassword(verified.userId, password)
    await clearResetCode(email)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
