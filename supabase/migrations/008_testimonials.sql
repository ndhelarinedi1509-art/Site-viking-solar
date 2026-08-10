-- ──────────────────────────────────────────────
-- Viking Solar CMS – Testimonials Table
-- Client testimonials shown in the "Ce que disent nos clients"
-- section of /projects. Managed from /admin/projects (Témoignages tab).
-- Idempotent: safe to run multiple times.
-- ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  image TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_sort ON testimonials(sort_order, is_published);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_testimonials_updated_at ON testimonials;
CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read (published only). Admin CRUD uses service_role (bypasses RLS).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Public can view published testimonials') THEN
    CREATE POLICY "Public can view published testimonials"
      ON testimonials FOR SELECT TO anon
      USING (is_published = true);
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Authenticated can view published testimonials') THEN
    CREATE POLICY "Authenticated can view published testimonials"
      ON testimonials FOR SELECT TO authenticated
      USING (is_published = true);
  END IF;
END$$;

-- ──────────────────────────────────────────────
-- SEED – matching the seeded projects
-- ──────────────────────────────────────────────

INSERT INTO testimonials (name, role, location, quote, rating, sort_order)
SELECT * FROM (VALUES
  (
    'Jean-Marc Kabeya',
    'Directeur, Complexe Logistique',
    'Limete, Kinshasa',
    'Viking Solar a installé notre système hybride de 250 kW. Nous fonctionnons désormais 24h/24 sans interruption, même pendant les coupures du réseau.',
    5,
    0
  ),
  (
    'Marie-Claire Banza',
    'Propriétaire de villa',
    'Gombe, Kinshasa',
    'Une installation propre, discrète et efficace. Notre facture d''électricité a chuté de plus de 80% dès le premier mois. Un travail vraiment professionnel.',
    5,
    1
  ),
  (
    'Paul Ngoy',
    'Gérant, Centre d''Affaires',
    'Ngaliema, Kinshasa',
    'L''équipe a respecté les délais et le budget. Le suivi de la production via l''application est un vrai plus pour la gestion de notre consommation.',
    5,
    2
  )
) AS s(name, role, location, quote, rating, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
