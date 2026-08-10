-- ──────────────────────────────────────────────
-- Viking Solar CMS – Projects Page Sections
-- Makes the public /projects page fully section-driven:
-- the DB sections define the order & headers, matching
-- the admin "Modifier la page" editor.
-- The gallery cards come from the `projects` table and the
-- testimonials come from the `testimonials` table (managed in
-- /admin/projects). The old "Restons connectés" (social) section
-- is intentionally NOT part of the page anymore.
-- Idempotent: INSERTs missing rows, UPDATEs existing.
-- ──────────────────────────────────────────────

-- Hero : badge, title, highlight, description, buttons
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'projects', 'hero', 'hero', 'Hero - Projets', 'Nos', '',
  'Découvrez nos projets solaires réalisés à Kinshasa et à travers la RDC.',
  $JSON${
    "badge": "NOS INSTALLATIONS SOLAIRES",
    "titleHighlight": "Réalisations",
    "buttons": [
      {"label": "Voir tous les projets", "href": "#pj-projects", "variant": "primary"}
    ]
  }$JSON$::jsonb,
  $JSON$[]$JSON$::jsonb,
  0
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

-- Stats : numbers shown under the hero
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'projects', 'stats', 'stats', 'Statistiques', '', '', '',
  $JSON${
    "stats": [
      {"value": 800, "suffix": "+", "label": "Installations"},
      {"value": 1500, "suffix": "+", "label": "Clients satisfaits"},
      {"value": 2497, "suffix": " kW", "label": "Puissance installée"},
      {"value": 3200, "suffix": "+", "label": "Panneaux Installés"}
    ]
  }$JSON$::jsonb,
  $JSON$[]$JSON$::jsonb,
  10
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

-- Gallery : header only — cards come from the projects table
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'projects', 'gallery', 'gallery', 'Galerie des projets', 'Projets', '',
  'Explorez nos installations solaires à travers Kinshasa et la RDC. Chaque projet reflète notre engagement envers l''excellence.',
  $JSON${
    "badge": "Nos réalisations",
    "titleHighlight": "Récents"
  }$JSON$::jsonb,
  $JSON$[]$JSON$::jsonb,
  20
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

-- Testimonials : header only — cards come from the testimonials table
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'projects', 'testimonials', 'testimonials', 'Témoignages clients', 'Ce que disent', '',
  '',
  $JSON${
    "badge": "Témoignages",
    "titleHighlight": "nos clients"
  }$JSON$::jsonb,
  $JSON$[]$JSON$::jsonb,
  30
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

-- CTA : badge, title, description, button
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'projects', 'cta', 'cta', 'CTA - Devis', 'Vous avez un projet solaire ?', '',
  'Que vous soyez particulier, entreprise ou institution, notre équipe est prête à vous accompagner de A à Z.',
  $JSON${
    "badge": "Prêt à réaliser votre projet ?",
    "button": {"label": "Demander un devis", "href": "/contact", "variant": "primary"}
  }$JSON$::jsonb,
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
