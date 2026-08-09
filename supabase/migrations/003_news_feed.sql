-- ──────────────────────────────────────────────
-- Viking Solar CMS – News Feed Schema
-- Public news feed with anonymous likes & comments
-- Execute in your Supabase SQL Editor (run 001 & 002 first)
-- ──────────────────────────────────────────────

-- 1. Categories
CREATE TABLE IF NOT EXISTS news_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#22C55E',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Posts
CREATE TABLE IF NOT EXISTS news_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT DEFAULT '',
  content TEXT NOT NULL,
  cover_image TEXT DEFAULT '',
  category_id UUID REFERENCES news_categories(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] NOT NULL DEFAULT '{}',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Comments (anonymous, moderated)
CREATE TABLE IF NOT EXISTS news_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  anonymous_visitor_id TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published','hidden','pending','spam')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Likes (anonymous, one per visitor per post)
CREATE TABLE IF NOT EXISTS news_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES news_posts(id) ON DELETE CASCADE,
  anonymous_visitor_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (post_id, anonymous_visitor_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_news_posts_status_published ON news_posts(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_posts_category ON news_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_news_posts_slug ON news_posts(slug);
CREATE INDEX IF NOT EXISTS idx_news_posts_pinned ON news_posts(is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_news_posts_tags ON news_posts USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_news_comments_post ON news_comments(post_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_comments_status ON news_comments(status);
CREATE INDEX IF NOT EXISTS idx_news_comments_visitor ON news_comments(anonymous_visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_news_likes_post ON news_likes(post_id);

-- Updated_at trigger
DROP TRIGGER IF EXISTS update_news_posts_updated_at ON news_posts;
CREATE TRIGGER update_news_posts_updated_at
  BEFORE UPDATE ON news_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_likes ENABLE ROW LEVEL SECURITY;

-- Categories: public read
CREATE POLICY "Public can view news categories"
  ON news_categories FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can view news categories"
  ON news_categories FOR SELECT
  TO authenticated
  USING (true);

-- Posts: public read (published only). Admin CRUD uses service_role (bypasses RLS).
CREATE POLICY "Public can view published news"
  ON news_posts FOR SELECT
  TO anon
  USING (status = 'published');

CREATE POLICY "Authenticated can view published news"
  ON news_posts FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Comments: public read published only, anonymous insert
CREATE POLICY "Public can view published comments"
  ON news_comments FOR SELECT
  TO anon
  USING (status = 'published');

CREATE POLICY "Authenticated can view published comments"
  ON news_comments FOR SELECT
  TO authenticated
  USING (status = 'published');

CREATE POLICY "Anonymous can comment"
  ON news_comments FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated can comment"
  ON news_comments FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Likes: public read, anonymous insert + delete (toggle)
CREATE POLICY "Public can view likes"
  ON news_likes FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated can view likes"
  ON news_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anonymous can like"
  ON news_likes FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous can unlike"
  ON news_likes FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Authenticated can like"
  ON news_likes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can unlike"
  ON news_likes FOR DELETE
  TO authenticated
  USING (true);

-- ──────────────────────────────────────────────
-- SEED
-- ──────────────────────────────────────────────

-- Categories
INSERT INTO news_categories (name, slug, color, sort_order) VALUES
  ('Promotions', 'promotion', '#22C55E', 0),
  ('Événements', 'evenement', '#3B82F6', 1),
  ('Réalisations', 'realisation', '#8B5CF6', 2),
  ('Partenariats', 'partenariat', '#F59E0B', 3),
  ('Témoignages', 'temoinage', '#14B8A6', 4),
  ('Formation', 'formation', '#EF4444', 5)
ON CONFLICT (slug) DO NOTHING;

-- Posts (adapted from the original hardcoded articles)
INSERT INTO news_posts (title, slug, excerpt, content, category_id, status, is_pinned, tags, published_at) VALUES
  (
    'Nouvelle Promotion : -20% sur les Kits Solaires',
    'nouvelle-promotion-20-kits-solaires',
    'Profitez d''une réduction exceptionnelle de 20% sur tous nos kits solaires résidentiels jusqu''à la fin du mois.',
    'Vicking Solar lance une promotion exceptionnelle sur l''ensemble de sa gamme de kits solaires résidentiels. Que vous souhaitiez équiper votre maison d''un système de 3kW ou de 10kW, bénéficiez de 20% de réduction sur le prix total de l''installation. Offre valable jusqu''au 31 juillet 2026.',
    (SELECT id FROM news_categories WHERE slug = 'promotion'),
    'published', true, ARRAY['solaires','promotion','kits'],
    '2026-07-01T08:00:00Z'
  ),
  (
    'Vicking Solar au Salon de l''Énergie 2026',
    'vicking-solar-au-salon-de-l-energie-2026',
    'Venez nous rencontrer au Salon International de l''Énergie de Kinshasa du 15 au 18 juillet.',
    'Nous serons présents au Salon International de l''Énergie de Kinshasa pour vous présenter nos dernières innovations en matière d''énergie solaire. Découvrez nos nouveaux panneaux à haut rendement et nos solutions de stockage nouvelle génération. Entrée gratuite sur invitation.',
    (SELECT id FROM news_categories WHERE slug = 'evenement'),
    'published', true, ARRAY['salon','evenement','kin-2026'],
    '2026-06-28T08:00:00Z'
  ),
  (
    'Installation Record : 50kW en 48h',
    'installation-record-50kw-en-48h',
    'Nous avons réalisé l''installation d''un système hybride de 50kW pour un centre commercial à Gombe en un temps record.',
    'Notre équipe a relevé le défi d''installer un système hybride de 50kW avec batteries lithium pour un centre commercial du quartier Gombe à Kinshasa. L''installation complète, de la pose des panneaux à la mise en service, a été réalisée en seulement 48 heures. Une performance qui démontre notre expertise et notre efficacité.',
    (SELECT id FROM news_categories WHERE slug = 'realisation'),
    'published', false, ARRAY['installation','record','50kw'],
    '2026-06-20T08:00:00Z'
  ),
  (
    'Nouveau Partenariat avec SolarTech',
    'nouveau-partenariat-avec-solartech',
    'Vicking Solar signe un partenariat stratégique avec SolarTech pour distribuer exclusivement leurs panneaux nouvelle génération en RDC.',
    'Nous avons le plaisir d''annoncer notre partenariat exclusif avec SolarTech, fabricant mondial de panneaux solaires haut de gamme. Cette collaboration nous permet de vous offrir des panneaux monocristallins de dernière génération avec un rendement record de 24,5%. Disponibles dès maintenant dans notre showroom.',
    (SELECT id FROM news_categories WHERE slug = 'partenariat'),
    'published', false, ARRAY['partenariat','solartech','panneaux'],
    '2026-06-15T08:00:00Z'
  ),
  (
    'Offre Spéciale : Kit Solaire + Batterie Offerts',
    'offre-speciale-kit-solaire-batterie-offerts',
    'Pour toute installation solaire de plus de 5kW, recevez une batterie de stockage lithium offerte d''une valeur de 1500$.',
    'Dans le cadre de notre programme ''Soleil pour Tous'', nous offrons une batterie lithium de 5kWh pour toute installation solaire d''une puissance supérieure à 5kW. Une opportunité unique de bénéficier d''une autonomie énergétique totale à prix réduit. Offre limitée aux 50 premiers clients.',
    (SELECT id FROM news_categories WHERE slug = 'promotion'),
    'published', false, ARRAY['kit','batterie','offre'],
    '2026-06-10T08:00:00Z'
  ),
  (
    'Témoignage : La Famille Mbemba passe au Solaire',
    'temoinage-famille-mbemba-passe-au-solaire',
    'Découvrez comment la famille Mbemba a réduit sa facture d''électricité de 80% grâce à notre installation solaire.',
    'La famille Mbemba, résidant à Ngaliema, a fait le choix du solaire avec Vicking Solar. Installés depuis 6 mois, leurs panneaux solaires de 8kW couvrent désormais 80% de leurs besoins énergétiques. ''Nous économisons près de 300$ par mois et nous n''avons plus de coupures'', témoigne M. Mbemba.',
    (SELECT id FROM news_categories WHERE slug = 'temoinage'),
    'published', false, ARRAY['temoignage','clients','familiale'],
    '2026-06-05T08:00:00Z'
  ),
  (
    'Formation Gratuite : Tout savoir sur le Solaire',
    'formation-gratuite-tout-savoir-sur-le-solaire',
    'Inscrivez-vous à notre formation gratuite sur l''énergie solaire ouverte à tous les résidents de Kinshasa.',
    'Vicking Solar organise une formation gratuite d''une journée sur les bases de l''énergie solaire. Au programme : fonctionnement des panneaux, dimensionnement d''installation, entretien et maintenance. La formation aura lieu dans nos locaux à Kinshasa. Places limitées, inscription obligatoire.',
    (SELECT id FROM news_categories WHERE slug = 'formation'),
    'published', false, ARRAY['formation','gratuit','savoir'],
    '2026-06-01T08:00:00Z'
  ),
  (
    'Maintenance Gratuite pour nos Clients Fidèles',
    'maintenance-gratuite-clients-fideles',
    'Dans le cadre de notre programme de fidélité, offrons une maintenance complète gratuite à tous nos clients de plus d''un an.',
    'Nous lançons notre programme de fidélité ''Client Premium''. Tous nos clients ayant installé leur système solaire depuis plus d''un an bénéficient d''une visite de maintenance gratuite incluant le nettoyage des panneaux, la vérification des onduleurs et un rapport de performance détaillé.',
    (SELECT id FROM news_categories WHERE slug = 'promotion'),
    'published', false, ARRAY['maintenance','fidelite','premium'],
    '2026-05-25T08:00:00Z'
  )
ON CONFLICT (slug) DO NOTHING;

-- Sample comments (published by default)
INSERT INTO news_comments (post_id, author_name, content, anonymous_visitor_id, status) VALUES
  (
    (SELECT id FROM news_posts WHERE slug = 'nouvelle-promotion-20-kits-solaires'),
    'Jean Tshibangu',
    'Très bonne information, merci pour cette promotion ! Je pense enfin équiper ma maison.',
    'seed-visitor-0001',
    'published'
  ),
  (
    (SELECT id FROM news_posts WHERE slug = 'nouvelle-promotion-20-kits-solaires'),
    'Marie-Claire',
    'Est-ce que la promo s''applique aussi pour les entreprises ?',
    'seed-visitor-0002',
    'published'
  ),
  (
    (SELECT id FROM news_posts WHERE slug = 'installation-record-50kw-en-48h'),
    'Patrick Kalonji',
    'Félicitations, une belle performance pour Kinshasa !',
    'seed-visitor-0003',
    'published'
  );
