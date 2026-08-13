-- Migration 014: Clean orphaned admin accounts + link to Supabase Auth
--  - Removes admin_users rows whose id is not a real Supabase Auth user.
--  - Adds a FK so deleting the auth user (dashboard) also removes the admin row.

-- Delete orphaned admin rows (legacy accounts created with a local UUID, no Auth user)
DELETE FROM admin_users a
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = a.id
);

-- Link admin_users.id to auth.users.id (cascade delete keeps the two in sync)
ALTER TABLE admin_users
  ADD CONSTRAINT admin_users_id_auth_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;