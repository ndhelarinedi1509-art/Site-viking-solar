-- ──────────────────────────────────────────────
-- Viking Solar CMS – About Page: contact form section + new order
-- New order on /about:
--   hero (0) → innovation (10) → pillars (20) → faq (30)
--   → contact form (40) → team (50) → cta (60)
-- The contact form becomes a DB-driven section so it can sit
-- between the FAQ and the team, and so /admin/pages/about mirrors
-- the public page order.
-- Idempotent: INSERTs missing rows, UPDATEs existing.
-- ──────────────────────────────────────────────

-- Renumber existing sections
UPDATE page_sections SET sort_order = 30 WHERE page_key = 'about' AND section_key = 'faq';
UPDATE page_sections SET sort_order = 50 WHERE page_key = 'about' AND section_key = 'team';
UPDATE page_sections SET sort_order = 60 WHERE page_key = 'about' AND section_key = 'cta';

-- Contact form : fixed block rendered by ContactFormBlock
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'contact', 'contact-form', 'Formulaire de contact', 'Contact', '', '',
  $JSON${}$JSON$::jsonb,
  $JSON$[]$JSON$::jsonb,
  40
)
ON CONFLICT (page_key, section_key) DO UPDATE
SET
  section_type = EXCLUDED.section_type,
  label = EXCLUDED.label,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  images = EXCLUDED.images,
  sort_order = EXCLUDED.sort_order;
