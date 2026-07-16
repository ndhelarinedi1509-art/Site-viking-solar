-- Migration 002: Admin Users & Sessions
-- Creates tables for secure admin authentication with role-based access control

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  reset_code TEXT,
  reset_code_expires_at TIMESTAMPTZ
);

-- Admin sessions table (for token-based auth)
CREATE TABLE IF NOT EXISTS admin_sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(is_active, role);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_user ON admin_sessions(user_id);

-- Enable Row Level Security
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies: only allow service_role (backend) access
-- These tables should never be accessed directly from the client
CREATE POLICY "Service role only on admin_users"
  ON admin_users FOR ALL
  USING (current_setting('role') = 'service_role');

CREATE POLICY "Service role only on admin_sessions"
  ON admin_sessions FOR ALL
  USING (current_setting('role') = 'service_role');
