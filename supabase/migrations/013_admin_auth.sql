-- Migration 013: Link admin_users to Supabase Auth
-- Admin authentication now uses Supabase Auth (auth.users) instead of
-- a local bcrypt password_hash in admin_users.
--
--  1. admin_users.id becomes the Supabase Auth user UUID.
--  2. password_hash is dropped (no longer used).
--  3. reset_code / reset_code_expires_at kept for the dev reset-code flow.

-- Drop the local password hash column (all admins will be recreated via Supabase Auth).
ALTER TABLE admin_users DROP COLUMN IF EXISTS password_hash;
