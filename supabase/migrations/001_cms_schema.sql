-- ──────────────────────────────────────────────
-- Viking Solar CMS – Schema Migration
-- Execute this SQL in your Supabase SQL Editor
-- ──────────────────────────────────────────────

-- 1. Page Sections (stores all page content)
CREATE TABLE IF NOT EXISTS page_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,           -- 'home','actualites','about','services','projects','contact'
  section_key TEXT NOT NULL,        -- 'hero','features','benefits','grid','cta',etc.
  section_type TEXT NOT NULL,       -- 'hero','text','cards','image-text','cta','gallery','faq','team','stats','benefits'
  label TEXT NOT NULL DEFAULT '',   -- human-readable label for admin UI
  title TEXT DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  content JSONB DEFAULT '{}',       -- flexible data (buttons, features, items, links)
  images JSONB DEFAULT '[]',        -- array of { url, alt, caption }
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  updated_by TEXT DEFAULT '',
  UNIQUE(page_key, section_key)
);

-- 2. Site Media (uploaded images)
CREATE TABLE IF NOT EXISTS site_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  filename TEXT DEFAULT '',
  mime_type TEXT DEFAULT '',
  size_bytes INT DEFAULT 0,
  width INT DEFAULT 0,
  height INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by TEXT DEFAULT ''
);

-- 3. Site Settings (global configuration)
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_page_sections_updated_at ON page_sections;
CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON page_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Seed default page sections (so the admin has content to edit)
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order) VALUES
  ('home', 'hero', 'hero', 'Hero - Accueil', 'L''Énergie du Congo, Aujourd''hui', 'Viking Solar — Énergie solaire durable à Kinshasa', 'Des solutions solaires fiables pour les foyers, les entreprises et les industries. Ensemble, construisons un avenir énergétique durable pour la RDC.', '{"buttons":[{"label":"Découvrir nos solutions","href":"/services","variant":"primary"},{"label":"Contactez-nous","href":"/contact","variant":"outline"}]}', '[]', 0),
  ('home', 'services-preview', 'cards', 'Aperçu des services', 'Nos services', '', 'Découvrez nos solutions solaires professionnelles adaptés à vos besoins.', '{"items":[{"title":"Installation solaire","description":"Panneaux photovoltaïques pour particuliers, entreprises et industries.","icon":"Zap"},{"title":"Systèmes hybrides","description":"Solutions combinant solaire et réseau électrique pour une autonomie optimale.","icon":"Layers"},{"title":"Maintenance","description":"Entretien et dépannage de vos installations solaires.","icon":"Wrench"}]}', '[]', 10),
  ('home', 'benefits', 'benefits', 'Avantages', 'Pourquoi choisir Viking Solar ?', '', '', '{"items":[{"title":"Expertise locale","description":"Connaissance approfondie du marché congolais depuis 2015.","iconColor":"green"},{"title":"Qualité garantie","description":"Matériaux certifiés et garantie sur toutes nos installations.","iconColor":"blue"}]}', '[]', 20),
  ('home', 'projects-preview', 'gallery', 'Aperçu des projets', 'Nos réalisations récentes', '', 'Découvrez quelques-uns de nos projets solaires à Kinshasa et à travers la RDC.', '{"button":{"label":"Voir tous nos projets","href":"/projects"}}', '[]', 30),
  ('home', 'cta', 'cta', 'CTA - Devis gratuit', 'Prêt à passer à l''énergie solaire ?', '', 'Obtenez un devis gratuit et personnalisé pour votre installation solaire à Kinshasa.', '{"buttons":[{"label":"Demander un devis","href":"/contact","variant":"primary"}]}', '[]', 40),
  ('about', 'hero', 'hero', 'Hero - À propos', 'Qui sommes-nous ?', 'Viking Solar', 'Viking Solar est une entreprise congolaise spécialisée dans les solutions d''énergie solaire.', '{"buttons":[{"label":"Nos services","href":"/services","variant":"primary"},{"label":"Contactez-nous","href":"/contact","variant":"outline"}]}', '[]', 0),
  ('about', 'innovation', 'text', 'Innovation', 'Notre approche innovante', 'Technologie de pointe', 'Nous utilisons les technologies les plus avancées pour offrir des solutions solaires performantes.', '{}', '[]', 10),
  ('about', 'team', 'team', 'Équipe', 'Notre équipe', '', 'Des experts passionnés au service de votre énergie.', '{"items":[{"name":"Jean-Michel","role":"Fondateur & CEO"},{"name":"Marie","role":"Directrice Technique"}]}', '[]', 20),
  ('services', 'hero', 'hero', 'Hero - Services', 'Nos services solaires', 'Solutions professionnelles', 'Des solutions complètes pour tous vos besoins en énergie solaire à Kinshasa et en RDC.', '{"buttons":[{"label":"Demander un devis","href":"/contact","variant":"primary"}]}', '[]', 0),
  ('services', 'benefits', 'benefits', 'Avantages des services', 'Pourquoi nos services ?', '', '', '{"items":[{"title":"Installation rapide","description":"Délais d''installation réduits grâce à notre équipe expérimentée.","iconColor":"green"}]}', '[]', 20),
  ('projects', 'hero', 'hero', 'Hero - Projets', 'Nos réalisations', 'Projets solaires', 'Découvrez nos projets solaires réalisés à Kinshasa et à travers la RDC.', '{"buttons":[{"label":"Contactez-nous","href":"/contact","variant":"primary"}]}', '[]', 0),
  ('contact', 'hero', 'hero', 'Hero - Contact', 'Contactez-nous', 'Parlons de votre projet', 'Prêt à passer à l''énergie solaire ? Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.', '{"buttons":[]}', '[]', 0),
  ('contact', 'faq', 'faq', 'FAQ', 'Questions fréquentes', '', '', '{"items":[{"question":"Quel est le délai d''installation ?","answer":"Le délai varie selon la taille du projet, généralement entre 2 et 7 jours."},{"question":"Proposez-vous une garantie ?","answer":"Oui, tous nos produits sont garantis."}]}', '[]', 10),
  ('actualites', 'hero', 'hero', 'Hero - Actualités', 'Toute l''actualité', 'Actualités Viking Solar', 'Restez informé des dernières actualités, promotions et nouveautés.', '{"buttons":[]}', '[]', 0),
  ('actualites', 'grid', 'text', 'Grille articles', 'Nos dernières actualités', '', 'Découvrez nos articles sur l''énergie solaire.', '{}', '[]', 10)
ON CONFLICT (page_key, section_key) DO NOTHING;

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name', '"Viking Solar"'),
  ('site_description', '"Viking Solar – Votre partenaire en énergie solaire durable à Kinshasa, RDC."'),
  ('contact_phone', '"+243820128315"'),
  ('contact_email', '"vikingsolar58@gmail.com"'),
  ('contact_address', '"Kinshasa, RDC"'),
  ('social_facebook', '"https://www.facebook.com/share/1CiMtZAPkx/?mibextid=wwXIfr"'),
  ('social_instagram', '"https://www.instagram.com/vickingsolar58?igsh=MTY3YmIxNDN4NWpzaw=="'),
  ('social_twitter', '"https://x.com/vikingsolar?s=21"'),
  ('social_tiktok', '"https://www.tiktok.com/@vicking.solar?_r=1&_t=ZS-96lF8PPJJxc"')
ON CONFLICT (key) DO NOTHING;
