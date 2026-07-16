import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { nanoid } from 'nanoid'

const SALT_ROUNDS = 12
const COOKIE_NAME = 'viking-admin-session'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase credentials not configured')
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hasAnyAdmin(): Promise<boolean> {
  try {
    const supabase = getAdminClient()
    const { count } = await supabase
      .from('admin_users')
      .select('*', { count: 'exact', head: true })
    return (count ?? 0) > 0
  } catch { return false }
}

export async function createFirstSuperAdmin(data: { email: string; password: string; name: string }) {
  const exists = await hasAnyAdmin()
  if (exists) throw new Error('An admin user already exists')
  const supabase = getAdminClient()
  const passwordHash = await hashPassword(data.password)
  const { data: user, error } = await supabase
    .from('admin_users')
    .insert({
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      name: data.name,
      role: 'super_admin',
      is_active: true,
    })
    .select('id, email, name, role')
    .single()
  if (error) throw new Error(error.message)
  return user
}

export async function authenticate(email: string, password: string) {
  const supabase = getAdminClient()
  const { data: user } = await supabase
    .from('admin_users')
    .select('id, email, name, role, password_hash, is_active')
    .eq('email', email.toLowerCase())
    .single()
  if (!user || !user.is_active) return null
  const valid = await verifyPassword(password, user.password_hash)
  if (!valid) return null
  return { id: user.id, email: user.email, name: user.name, role: user.role as 'super_admin' | 'admin' }
}

export async function createSession(userId: string) {
  const supabase = getAdminClient()
  const sessionId = nanoid(32)
  const now = new Date()
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS)
  const { error } = await supabase
    .from('admin_sessions')
    .insert({ id: sessionId, user_id: userId, created_at: now.toISOString(), expires_at: expiresAt.toISOString() })
  if (error) throw new Error(error.message)
  return sessionId
}

export async function validateSession(sessionId: string) {
  const supabase = getAdminClient()
  const { data: session } = await supabase
    .from('admin_sessions')
    .select('id, user_id, expires_at, admin_users!inner(id, email, name, role, is_active)')
    .eq('id', sessionId)
    .single()
  if (!session) return null
  const now = new Date()
  if (new Date(session.expires_at) <= now) return null
  const user = session.admin_users as unknown as { id: string; email: string; name: string; role: 'super_admin' | 'admin'; is_active: boolean }
  if (!user.is_active) return null
  return { sessionId: session.id, userId: user.id, email: user.email, name: user.name, role: user.role }
}

export async function destroySession(sessionId: string) {
  const supabase = getAdminClient()
  await supabase.from('admin_sessions').delete().eq('id', sessionId)
}

export async function setSessionCookie(sessionId: string) {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function getSessionFromCookie() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(COOKIE_NAME)?.value
  if (!sessionId) return null
  return validateSession(sessionId)
}

export async function listAdminUsers() {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active, created_at, created_by')
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return data
}

export async function createAdminUser(data: { email: string; password: string; name: string; createdBy: string }) {
  const supabase = getAdminClient()
  const passwordHash = await hashPassword(data.password)
  const { data: user, error } = await supabase
    .from('admin_users')
    .insert({
      email: data.email.toLowerCase(),
      password_hash: passwordHash,
      name: data.name,
      role: 'admin',
      is_active: true,
      created_by: data.createdBy,
    })
    .select('id, email, name, role, is_active, created_at')
    .single()
  if (error) throw new Error(error.message)
  return user
}

export async function updateAdminUser(id: string, updates: { name?: string; is_active?: boolean }) {
  const supabase = getAdminClient()
  const { data: user, error } = await supabase
    .from('admin_users')
    .update(updates)
    .eq('id', id)
    .select('id, email, name, role, is_active, created_at')
    .single()
  if (error) throw new Error(error.message)
  return user
}

export async function changeUserPassword(id: string, newPassword: string) {
  const supabase = getAdminClient()
  const passwordHash = await hashPassword(newPassword)
  const { error } = await supabase
    .from('admin_users')
    .update({ password_hash: passwordHash })
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function deleteAdminUser(id: string) {
  const supabase = getAdminClient()
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function findAdminByEmail(email: string) {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('admin_users')
    .select('id, email, name, role, is_active')
    .eq('email', email.toLowerCase())
    .single()
  return data || null
}

export async function setResetCode(email: string, code: string) {
  const supabase = getAdminClient()
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString()
  const { error } = await supabase
    .from('admin_users')
    .update({ reset_code: code, reset_code_expires_at: expiresAt })
    .eq('email', email.toLowerCase())
  if (error) throw new Error(error.message)
}

export async function getAndVerifyResetCode(email: string, code: string) {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('admin_users')
    .select('id, reset_code, reset_code_expires_at')
    .eq('email', email.toLowerCase())
    .single()
  if (!data || !data.reset_code || !data.reset_code_expires_at) return null
  if (data.reset_code !== code) return null
  if (new Date(data.reset_code_expires_at) <= new Date()) return null
  return { userId: data.id }
}

export async function clearResetCode(email: string) {
  const supabase = getAdminClient()
  await supabase
    .from('admin_users')
    .update({ reset_code: null, reset_code_expires_at: null })
    .eq('email', email.toLowerCase())
}
