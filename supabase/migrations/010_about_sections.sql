-- ──────────────────────────────────────────────
-- Viking Solar CMS – About Page Sections
-- Makes the public /about page fully section-driven.
-- Clean order: hero (0), innovation (10), pillars (20), team (30),
-- faq (40), cta (50).
-- "Notre Expertise Technique" is removed (AboutExpertise no longer
-- exists). The FAQ (previously only on the contact page) is now part
-- of /about too. The contact form stays as the fixed page footer block.
-- Idempotent: INSERTs missing rows, UPDATEs existing.
-- ──────────────────────────────────────────────

-- Hero : badge, title, highlight, description, buttons
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'hero', 'hero', 'Hero - À propos', 'Qui sommes-nous ?', 'Vicking Solar',
  'Viking Solar est une entreprise congolaise spécialisée dans les solutions d''énergie solaire : installation, systèmes hybrides et maintenance pour particuliers, entreprises et industries.',
  $JSON${
    "badge": "À propos",
    "titleHighlight": "Vicking Solar",
    "buttons": [
      {"label": "Nos services", "href": "/services", "variant": "primary"},
      {"label": "Contactez-nous", "href": "/contact", "variant": "outline"}
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

-- Innovation : "L'innovation au cœur du Congo" — Notre Histoire + Mission
-- (the story/mission blocks render from the component + locales)
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'innovation', 'text', 'Notre Histoire & Mission', 'L''innovation', '',
  'Depuis notre création, Vicking Solar s''est imposé comme un acteur incontournable de l''énergie solaire en RDC. Fondée à Kinshasa, notre entreprise est née d''une vision simple : offrir au Congo une énergie fiable, propre et accessible pour tous. Grâce à une équipe d''ingénieurs et de techniciens congolais passionnés, nous concevons, installons et entretenons des systèmes solaires résidentiels, commerciaux et industriels de haute qualité. Chaque projet est une promesse tenue : des équipements certifiés, une installation soignée et un accompagnement sur le long terme.',
  $JSON${
    "badge": "Notre histoire & notre mission",
    "titleHighlight": "au cœur du Congo"
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

-- Pillars : "Nos Piliers" — benefits-style items with icon colors
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'pillars', 'benefits', 'Nos Piliers', 'Nos Piliers', '',
  'Les valeurs qui guident notre action au quotidien.',
  $JSON${
    "badge": "Nos valeurs",
    "titleHighlight": "Nos Piliers",
    "items": [
      {"title": "Étendue Notre Réseau", "description": "Nous couvrons l'ensemble du territoire congolais avec nos équipes spécialisées et nos partenaires agréés en régions.", "iconColor": "blue"},
      {"title": "Proximité Locale", "description": "Ancrés dans le tissu congolais, nous collaborons avec les communautés locales pour proposer des solutions adaptées, accessibles et qui contribuent à la croissance locale.", "iconColor": "green"},
      {"title": "Innovation Solaire", "description": "Nous nous appuyons sur les dernières avancées technologiques pour offrir des solutions solaires de pointe qui répondent aux exigences élevées et permettent d'optimiser chaque installation.", "iconColor": "purple"}
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

-- Team : leadership cards (items editable in admin)
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'team', 'team', 'Équipe dirigeante', 'L''Équipe Dirigeante', '',
  'Des experts passionnés qui prennent soin de l''avenir du Congo avec intelligence.',
  $JSON${
    "badge": "Notre équipe",
    "items": [
      {"name": "Victor-Makole", "role": "CEO / Fondateur"},
      {"name": "Sarah K.", "role": "Directrice Technique"},
      {"name": "Rinedi Ndhela", "role": "Directeur / Informaticien", "photo": "/images/rey.jpg"},
      {"name": "Arlette B.", "role": "Resp. Commerciale"}
    ]
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

-- FAQ : questions fréquentes (items editable in admin)
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'faq', 'faq', 'FAQ - Questions fréquentes', 'Vous avez des questions ?', '',
  '',
  $JSON${
    "badge": "Questions fréquentes",
    "titleHighlight": "FAQ",
    "items": [
      {"question": "Comment se déroule l'installation d'un système solaire ?", "answer": "Nous commençons par une visite sur site pour évaluer vos besoins énergétiques. Ensuite, nous vous proposons un devis détaillé. Une fois accepté, notre équipe d'experts procède à l'installation avec du matériel certifié, et nous effectuons des tests rigoureux avant la mise en service."},
      {"question": "Proposez-vous des contrats de maintenance ?", "answer": "Oui, nous offrons des contrats de maintenance préventive et curative. Cela inclut le nettoyage des panneaux, la vérification des onduleurs et des batteries, afin de garantir la longévité et les performances de votre installation."},
      {"question": "Les devis (quotations) sont-ils payants ?", "answer": "Non, nos premières études et devis sont totalement gratuits. Nous analysons votre facture d'électricité ou vos équipements pour vous proposer la solution la plus adaptée sans engagement."},
      {"question": "Quelles sont les garanties sur vos équipements ?", "answer": "Nous travaillons avec les meilleures marques du marché. Nos panneaux solaires sont généralement garantis 25 ans sur la performance, et les onduleurs/batteries bénéficient d'une garantie constructeur de 5 à 10 ans selon les modèles."},
      {"question": "Qu'est-ce qu'un système hybride ?", "answer": "Un système hybride combine l'énergie solaire, le réseau électrique public (SNEL) et/ou un groupe électrogène. Il permet de gérer intelligemment les coupures de courant et d'optimiser l'utilisation de l'énergie solaire pour réduire la facture tout en assurant une alimentation continue."}
    ]
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

-- CTA : "Envie d'en savoir plus ?"
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'about', 'cta', 'cta', 'CTA - Devis', 'Envie d''en savoir plus ?', '',
  'Contactez-nous dès aujourd''hui pour discuter de votre projet solaire.',
  $JSON${
    "badge": "Prêt à discuter de votre projet ?",
    "button": {"label": "Demander un devis", "href": "/about#contact", "variant": "primary"}
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
