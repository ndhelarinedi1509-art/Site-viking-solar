import { NextResponse } from 'next/server'

// The Super Admin setup flow is permanently disabled.
// Admins are managed only via Supabase Auth (Authentication > Users).

export async function GET() {
  return NextResponse.json({ setupRequired: false, setupDisabled: true })
}

export async function POST() {
  return NextResponse.json({ error: 'Setup is disabled' }, { status: 403 })
}