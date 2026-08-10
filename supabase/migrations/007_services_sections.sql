-- ──────────────────────────────────────────────
-- Viking Solar CMS – Services Page Sections
-- Makes the public /services page fully section-driven:
-- the DB sections define the order & headers, matching
-- the admin "Modifier la page" editor.
-- The services list comes from the `services` table,
-- the "Pourquoi nous choisir" section is shared with the
-- home page (no separate content saved here), and the
-- "Nos réalisations" section comes from the `projects`
-- table (shared with /admin/projects).
-- Idempotent: INSERTs missing rows, UPDATEs existing.
-- ──────────────────────────────────────────────

-- Hero : badge, title, highlight, description, buttons
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'services', 'hero', 'hero', 'Hero - Services', 'Nos services', 'Solutions professionnelles',
  'Des solutions complètes pour tous vos besoins en énergie solaire à Kinshasa et en RDC.',
  $JSON${
    "badge": "VOTRE PARTENAIRE EN ÉNERGIE SOLAIRE DURABLE",
    "titleHighlight": "solaires",
    "buttons": [
      {"label": "Demander un devis", "href": "/contact", "variant": "primary"}
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

-- Grid (services list) : header only — cards come from the services table
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'services', 'grid', 'services-grid', 'Grille des services', 'Solutions', '',
  'Une gamme complète de services solaires pour particuliers, entreprises et industries en République Démocratique du Congo.',
  $JSON${
    "badge": "Ce que nous offrons",
    "titleHighlight": "Énergétiques"
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

-- Process : header + steps (items) — editable in admin
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'services', 'process', 'services-process', 'Processus', 'Notre', '',
  'De la première analyse à la mise en service, nous vous accompagnons à chaque étape avec rigueur et transparence.',
  $JSON${
    "badge": "Comment ça marche",
    "titleHighlight": "Processus",
    "items": [
      {
        "number": "01",
        "title": "Analyse des Besoins",
        "description": "Visite sur site gratuite et audit énergétique complet de votre installation existante. Identification de vos consommations et objectifs.",
        "duration": "Jour 1",
        "color": "blue"
      },
      {
        "number": "02",
        "title": "Étude Technique",
        "description": "Dimensionnement précis du système, sélection des équipements, plans d'installation et devis détaillé remis sous 48h.",
        "duration": "Jours 2-3",
        "color": "green"
      },
      {
        "number": "03",
        "title": "Installation",
        "description": "Déploiement par nos techniciens certifiés. Pose des panneaux, câblage, protection électrique et intégration des onduleurs selon les normes IEC.",
        "duration": "1–5 jours",
        "color": "orange"
      },
      {
        "number": "04",
        "title": "Mise en Service",
        "description": "Tests complets du système, configuration du monitoring, formation de l'utilisateur et remise du dossier de conformité avec certificats.",
        "duration": "Jour J",
        "color": "purple"
      },
      {
        "number": "05",
        "title": "Maintenance Continue",
        "description": "Suivi à distance via notre plateforme IoT, visites préventives programmées et assistance téléphonique 7j/7 pour garantir vos performances.",
        "duration": "En continu",
        "color": "teal"
      }
    ]
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

-- Benefits : shared marker — content is read from the HOME page
-- ("Pourquoi choisir Viking Solar ?"). No separate content is saved here.
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'services', 'benefits', 'benefits', 'Pourquoi nous choisir (partagé avec l''accueil)', 'Pourquoi nous choisir', '', '',
  $JSON${}$JSON$::jsonb,
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

-- Projects : header + "Voir tous nos projets" button — cards come from the projects table
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'services', 'projects', 'gallery', 'Projets récents', 'Projets', '',
  'Découvrez quelques-unes de nos installations réalisées à Kinshasa et dans toute la RDC.',
  $JSON${
    "badge": "Nos réalisations",
    "titleHighlight": "Récents",
    "button": {"label": "Voir tous nos projets", "href": "/projects", "variant": "outline"}
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

-- CTA : badge, title, description, button
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'services', 'cta', 'cta', 'CTA - Devis', 'Passez à l''énergie solaire dès aujourd''hui.', '',
  'Rejoignez les centaines de foyers et entreprises congolaises qui ont déjà choisi Vicking Solar. Obtenez votre étude gratuite sous 24h.',
  $JSON${
    "badge": "Passons à l'action",
    "button": {"label": "Demander un devis", "href": "/contact", "variant": "primary"}
  }$JSON$::jsonb,
  $JSON$[]$JSON$::jsonb,
  50
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
