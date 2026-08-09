-- ──────────────────────────────────────────────
-- Viking Solar CMS – Services & Projects Tables
-- Moves services and projects from hardcoded constants
-- into the database so the public site stays in sync.
-- Execute in your Supabase SQL Editor (after 003 & 004).
-- ──────────────────────────────────────────────

-- 1. Services
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,             -- 'installation-solaire', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  tag TEXT DEFAULT '',
  color TEXT NOT NULL DEFAULT 'green',   -- 'blue','green','orange','purple','teal','amber'
  featured BOOLEAN NOT NULL DEFAULT false,
  icon TEXT NOT NULL DEFAULT 'sun',      -- 'sun','file-text','wrench','industrial','home','clipboard-list'
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,             -- 'proj-1', etc.
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT '',     -- 'residentiel','industriel','commercial','institutionnel'
  power TEXT DEFAULT '',
  location TEXT DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  features TEXT[] NOT NULL DEFAULT '{}',
  image TEXT DEFAULT '',
  date DATE DEFAULT now(),
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_services_sort ON services(sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order, is_published);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Updated_at triggers
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read (published only). Admin CRUD uses service_role (bypasses RLS).
CREATE POLICY "Public can view published services"
  ON services FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated can view published services"
  ON services FOR SELECT TO authenticated
  USING (is_published = true);

CREATE POLICY "Public can view published projects"
  ON projects FOR SELECT TO anon
  USING (is_published = true);

CREATE POLICY "Authenticated can view published projects"
  ON projects FOR SELECT TO authenticated
  USING (is_published = true);

-- ──────────────────────────────────────────────
-- SEED from the original constants
-- ──────────────────────────────────────────────

INSERT INTO services (slug, title, description, features, tag, color, featured, icon, sort_order) VALUES
  (
    'installation-solaire',
    'Installation Solaire',
    'Conception, dimensionnement et installation complète de systèmes photovoltaïques. Du panneau à l''onduleur, nous garantissons une finition irréprochable.',
    ARRAY['Étude de faisabilité gratuite','Panneaux certifiés haute efficacité','Garantie 25 ans sur les modules'],
    'Résidentiel & Commercial',
    'blue',
    false,
    'sun',
    0
  ),
  (
    'systemes-hybrides',
    'Systèmes Hybrides',
    'Alliance intelligente entre solaire, batteries lithium et groupes électrogènes pour une alimentation 24h/24, même en cas de coupure de réseau.',
    ARRAY['Batteries lithium longue durée','Basculement automatique','Monitoring intelligent en temps réel'],
    'Continuité garantie',
    'green',
    true,
    'file-text',
    1
  ),
  (
    'maintenance-electrique',
    'Maintenance Électrique',
    'Surveillance continue, entretien préventif et dépannage rapide de vos installations. Nos techniciens interviennent sous 24h partout à Kinshasa.',
    ARRAY['Contrat de maintenance annuel','Intervention sous 24h','Rapport mensuel de performance'],
    'Préventif & Curatif',
    'orange',
    false,
    'wrench',
    2
  ),
  (
    'energie-industrielle',
    'Énergie Industrielle',
    'Infrastructure solaire sur mesure pour usines, entrepôts, mines et grands complexes industriels. Des solutions robustes pensées pour la RDC.',
    ARRAY['Systèmes de 50 kW à 10 MW','Ingénierie complète on-site','ROI optimisé < 4 ans'],
    'Grande échelle',
    'purple',
    false,
    'industrial',
    3
  ),
  (
    'energie-residentielle',
    'Énergie Résidentielle',
    'Solutions solaires élégantes pour maisons, villas et résidences modernes. Réduisez votre facture électrique jusqu''à 90% dès le premier mois.',
    ARRAY['Installation esthétique intégrée','Autonomie totale possible','App de suivi sur smartphone'],
    'Maisons & Villas',
    'teal',
    false,
    'home',
    4
  ),
  (
    'etudes-techniques',
    'Études Techniques',
    'Analyses de faisabilité solaire, dimensionnement précis et rapports techniques certifiés. Une base solide pour chaque projet, grand ou petit.',
    ARRAY['Étude d''ensoleillement local','Rapport de rentabilité détaillé','Schémas électriques certifiés'],
    'Expertise technique',
    'amber',
    false,
    'clipboard-list',
    5
  )
ON CONFLICT (slug) DO NOTHING;

INSERT INTO projects (slug, title, description, category, power, location, tags, features, image, date, sort_order) VALUES
  (
    'proj-1',
    'Complexe Industriel et Logistique',
    'Installation hybride de 250 kW avec batteries au lithium de haute capacité pour garantir une autonomie de 24h et stabiliser la production.',
    'industriel',
    '250 kW',
    'Limete, Kinshasa',
    ARRAY['Solaire','Hybride','250 kW'],
    ARRAY['Hybride lithium','Autonomie 24h','Monitoring IoT'],
    '',
    '2026-07-15',
    0
  ),
  (
    'proj-2',
    'Villa Moderne Autonome',
    'Conception et installation d''un système résidentiel esthétique de 15 kW. Intégration sur toiture et backup complet en cas de coupure réseau.',
    'residentiel',
    '15 kW',
    'Gombe, Kinshasa',
    ARRAY['Solaire','Batterie','15 kW'],
    ARRAY['Toiture intégrée','App suivi','Silencieux'],
    '',
    '2026-06-20',
    1
  ),
  (
    'proj-3',
    'Centre d''Affaires Principal',
    'Alimentation solaire de 80 kW pour bureaux administratifs et commerces, permettant une réduction de 60% de la facture énergétique annuelle.',
    'commercial',
    '80 kW',
    'Ngaliema, Kinshasa',
    ARRAY['Solaire','Toiture','80 kW'],
    ARRAY['Toiture solaire','Réduction 60%','Nettoyage auto'],
    '',
    '2026-05-10',
    2
  ),
  (
    'proj-4',
    'Électrification École Publique',
    'Projet hybride solidaire de 35 kW fournissant une énergie stable aux salles de classe, laboratoires et espaces informatiques.',
    'commercial',
    '35 kW',
    'Matete, Kinshasa',
    ARRAY['Commercial','Hybride','35 kW'],
    ARRAY['35 kW hybride','Labo équipé','Soutien pédagogique'],
    '',
    '2026-03-25',
    3
  ),
  (
    'proj-5',
    'Résidence Familiale Haute Sécurité',
    'Installation hybride de 10 kW pour garantir la sécurité et l''éclairage en continu pour une résidence sécurisée.',
    'residentiel',
    '10 kW',
    'Macampagne, Kinshasa',
    ARRAY['Solaire','Hybride','10 kW'],
    ARRAY['Éclairage continu','Sécurité','Batterie LiFePO4'],
    '',
    '2026-02-14',
    4
  ),
  (
    'proj-6',
    'Entrepôt Frigorifique Alimentaire',
    'Mise en place d''une toiture solaire de 120 kW pour réduire la dépendance au réseau et alimenter les chambres froides.',
    'industriel',
    '120 kW',
    'Kingabwa, Kinshasa',
    ARRAY['Toiture','Solaire','120 kW'],
    ARRAY['120 kW toiture','Chambres froides','ROI < 5 ans'],
    '',
    '2026-01-08',
    5
  )
ON CONFLICT (slug) DO NOTHING;
