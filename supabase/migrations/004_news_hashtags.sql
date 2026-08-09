-- ──────────────────────────────────────────────
-- Viking Solar CMS – News Hashtags
-- Adds a tags TEXT[] column to news_posts for
-- hashtag search / filtering. Idempotent.
-- Execute in your Supabase SQL Editor (after 003).
-- ──────────────────────────────────────────────

-- 1. Add tags column (idempotent)
ALTER TABLE news_posts ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

-- 2. GIN index for fast contains() lookups
CREATE INDEX IF NOT EXISTS idx_news_posts_tags ON news_posts USING GIN (tags);

-- 3. Backfill hashtags for the existing seed posts
UPDATE news_posts SET tags = '{"solaires","promotion","kits"}'        WHERE slug = 'nouvelle-promotion-20-kits-solaires' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"salon","evenement","kin-2026"}'       WHERE slug = 'vicking-solar-au-salon-de-l-energie-2026' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"installation","record","50kw"}'       WHERE slug = 'installation-record-50kw-en-48h' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"partenariat","solartech","panneaux"}' WHERE slug = 'nouveau-partenariat-avec-solartech' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"kit","batterie","offre"}'             WHERE slug = 'offre-speciale-kit-solaire-batterie-offerts' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"temoignage","clients","familiale"}'   WHERE slug = 'temoinage-famille-mbemba-passe-au-solaire' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"formation","gratuit","savoir"}'       WHERE slug = 'formation-gratuite-tout-savoir-sur-le-solaire' AND (tags = '{}' OR tags IS NULL);
UPDATE news_posts SET tags = '{"maintenance","fidelite","premium"}'   WHERE slug = 'maintenance-gratuite-clients-fideles' AND (tags = '{}' OR tags IS NULL);
