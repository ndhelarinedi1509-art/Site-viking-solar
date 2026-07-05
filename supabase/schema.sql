-- Viking Solar - Supabase PostgreSQL Schema
-- ===========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- ENUMS
-- ===========================================

-- User roles
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');

-- Contact message status
CREATE TYPE message_status AS ENUM ('new', 'read', 'replied');

-- ===========================================
-- TABLES
-- ===========================================

-- 1. users (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_sign_in TIMESTAMPTZ
);
COMMENT ON TABLE users IS 'User profiles extending Supabase auth.users';

-- 2. permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE permissions IS 'Permission definitions for RBAC';

-- 3. user_roles (junction table for many-to-many)
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, permission_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE user_roles IS 'Junction table linking users to their permissions';

-- 4. categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE categories IS 'Project categories for grouping';

-- 5. services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  tag TEXT,
  color TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE services IS 'Company services and offerings';

-- 6. projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  power TEXT,
  location TEXT,
  tags TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE projects IS 'Solar installation projects portfolio';

-- 7. team_members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT,
  photo_url TEXT,
  bio TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE team_members IS 'Company team members and leadership';

-- 8. contact_messages
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status message_status NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE contact_messages IS 'Messages received through the contact form';

-- 9. newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  active BOOLEAN NOT NULL DEFAULT true
);
COMMENT ON TABLE newsletter_subscribers IS 'Email newsletter subscription list';

-- 10. faq_items
CREATE TABLE faq_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE faq_items IS 'Frequently asked questions for the website';

-- 11. testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_role TEXT,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE testimonials IS 'Client testimonials and reviews';

-- 12. site_settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE site_settings IS 'Global site configuration key-value pairs';

-- 13. activity_logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE activity_logs IS 'Audit trail for admin actions';

-- 14. notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE notifications IS 'In-app notifications for users';

-- ===========================================
-- INDEXES
-- ===========================================

-- contacts
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- projects
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_featured ON projects(featured) WHERE featured = true;

-- services
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_featured ON services(featured) WHERE featured = true;
CREATE INDEX idx_services_order ON services("order");

-- team_members
CREATE INDEX idx_team_members_order ON team_members("order");

-- faq_items
CREATE INDEX idx_faq_items_order ON faq_items("order");

-- testimonials
CREATE INDEX idx_testimonials_approved ON testimonials(approved) WHERE approved = true;

-- newsletter
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_active ON newsletter_subscribers(active) WHERE active = true;

-- activity_logs
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

-- notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read) WHERE read = false;

-- site_settings
CREATE INDEX idx_site_settings_key ON site_settings(key);

-- ===========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ===========================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON faq_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- ROW LEVEL SECURITY (RLS)
-- ===========================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===========================================
-- PUBLIC READ POLICIES
-- ===========================================

-- Projects: public read
CREATE POLICY "Public can view projects"
  ON projects FOR SELECT
  USING (true);

-- Services: public read
CREATE POLICY "Public can view services"
  ON services FOR SELECT
  USING (true);

-- Team members: public read
CREATE POLICY "Public can view team members"
  ON team_members FOR SELECT
  USING (true);

-- Testimonials: public read (approved only)
CREATE POLICY "Public can view approved testimonials"
  ON testimonials FOR SELECT
  USING (approved = true);

-- FAQ items: public read
CREATE POLICY "Public can view FAQ items"
  ON faq_items FOR SELECT
  USING (true);

-- Site settings: public read
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  USING (true);

-- Categories: public read
CREATE POLICY "Public can view categories"
  ON categories FOR SELECT
  USING (true);

-- ===========================================
-- AUTHENTICATED USER POLICIES
-- ===========================================

-- Contact messages: auth-only read
CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Notifications: auth-only read (own notifications)
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Activity logs: auth-only read
CREATE POLICY "Authenticated users can view activity logs"
  ON activity_logs FOR SELECT
  TO authenticated
  USING (true);

-- Newsletter subscribers: auth-only read
CREATE POLICY "Authenticated users can view subscribers"
  ON newsletter_subscribers FOR SELECT
  TO authenticated
  USING (true);

-- ===========================================
-- ADMIN-ONLY WRITE POLICIES
-- ===========================================

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper: check if user is admin or manager
CREATE OR REPLACE FUNCTION is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role IN ('admin', 'manager')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users: admin-only writes
CREATE POLICY "Admin can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admin can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (is_admin());

-- Permissions: admin-only writes
CREATE POLICY "Admin can manage permissions"
  ON permissions FOR ALL
  TO authenticated
  USING (is_admin());

-- User roles: admin-only writes
CREATE POLICY "Admin can manage user roles"
  ON user_roles FOR ALL
  TO authenticated
  USING (is_admin());

-- Categories: admin-only writes
CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  TO authenticated
  USING (is_admin());

-- Services: admin-only writes
CREATE POLICY "Admin can manage services"
  ON services FOR ALL
  TO authenticated
  USING (is_admin());

-- Projects: admin-only writes
CREATE POLICY "Admin can manage projects"
  ON projects FOR ALL
  TO authenticated
  USING (is_admin());

-- Team members: admin-only writes
CREATE POLICY "Admin can manage team members"
  ON team_members FOR ALL
  TO authenticated
  USING (is_admin());

-- Contact messages: admin-only update/delete
CREATE POLICY "Admin can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admin can delete contact messages"
  ON contact_messages FOR DELETE
  TO authenticated
  USING (is_admin());

-- Newsletter subscribers: admin-only writes
CREATE POLICY "Admin can manage subscribers"
  ON newsletter_subscribers FOR ALL
  TO authenticated
  USING (is_admin());

-- FAQ items: admin-only writes
CREATE POLICY "Admin can manage FAQ items"
  ON faq_items FOR ALL
  TO authenticated
  USING (is_admin());

-- Testimonials: admin-only writes
CREATE POLICY "Admin can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (is_admin());

-- Site settings: admin-only writes
CREATE POLICY "Admin can manage site settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (is_admin());

-- Activity logs: admin-only writes
CREATE POLICY "Admin can insert activity logs"
  ON activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- Notifications: admin can manage all, users can update own
CREATE POLICY "Admin can manage all notifications"
  ON notifications FOR ALL
  TO authenticated
  USING (is_admin());

CREATE POLICY "Users can mark own notifications as read"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ===========================================
-- ANONYMOUS INSERT POLICIES (public forms)
-- ===========================================

-- Allow anonymous users to submit contact messages
CREATE POLICY "Anonymous can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to subscribe to newsletter
CREATE POLICY "Anonymous can subscribe to newsletter"
  ON newsletter_subscribers FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to submit testimonials
CREATE POLICY "Anonymous can submit testimonials"
  ON testimonials FOR INSERT
  TO anon
  WITH CHECK (true);
