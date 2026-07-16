import { NextResponse } from 'next/server'
import { z } from 'zod'
import { findAdminByEmail, setResetCode } from '@/lib/admin-auth'

const schema = z.object({ email: z.string().email() })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = schema.parse(body)
    const user = await findAdminByEmail(email)
    if (!user) {
      return NextResponse.json({ success: true, message: 'If the email exists, a code has been sent' })
    }
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    await setResetCode(email, code)
    return NextResponse.json({ success: true, code, message: 'Reset code generated' })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
