-- ──────────────────────────────────────────────
-- Viking Solar CMS – Home Sections Content Model
-- Enriches home page_sections seed so the dynamic
-- home components have content to render.
-- Idempotent: UPDATEs existing rows, INSERTs missing.
-- ──────────────────────────────────────────────

-- Hero : title, badge, description, buttons, stats, background image
UPDATE page_sections
SET
  subtitle = 'Viking Solar — Énergie solaire durable à Kinshasa',
  description = 'Des solutions solaires fiables pour les foyers, les entreprises et les industries. Ensemble, construisons un avenir énergétique durable pour la RDC.',
  content = $JSON${
    "badge": "Viking Solar — Énergie solaire durable à Kinshasa",
    "title": "L'énergie de demain, disponible",
    "titleHighlight": "aujourd'hui",
    "buttons": [
      {"label": "Demander un devis", "href": "/about#contact", "variant": "primary"},
      {"label": "Explorer nos projets", "href": "/projects", "variant": "outline"}
    ],
    "stats": [
      {"value": 150, "suffix": "+", "label": "Projets réalisés"},
      {"value": 5, "suffix": "", "label": "Années d'expérience"},
      {"value": 24, "suffix": "/7", "label": "Support client"}
    ]
  }$JSON$::jsonb,
  images = $JSON$[{"url": "/page%20d%27accuiel.jpg", "alt": "Installation solaire Viking Solar"}]$JSON$::jsonb
WHERE page_key = 'home' AND section_key = 'hero';

-- About preview (image-text) : badge, title, highlight, paragraphs, highlights, image
INSERT INTO page_sections (page_key, section_key, section_type, label, title, subtitle, description, content, images, sort_order)
VALUES (
  'home', 'about-preview', 'image-text', 'À propos - Aperçu', 'Viking Solar,', 'Votre partenaire énergie', 
  'Viking Solar est une entreprise congolaise spécialisée dans les solutions d''énergie solaire pour les foyers, les entreprises et les industries. Depuis notre création à Kinshasa, nous accompagnons chaque client de la conception à la mise en service.',
  $JSON${
    "badge": "À propos de nous",
    "titleHighlight": "votre partenaire énergie",
    "paragraph2": "Notre mission : rendre l'énergie solaire accessible, fiable et durable pour tous. Nous combinons expertise technique, matériaux certifiés et un accompagnement personnalisé pour garantir des installations performantes et pérennes.",
    "highlights": [
      "Expertise locale depuis 2015",
      "Matériaux certifiés haute qualité",
      "Garantie complète sur nos installations"
    ]
  }$JSON$::jsonb,
  $JSON$[{"url": "", "alt": "À propos de Viking Solar"}]$JSON$::jsonb,
  5
)
ON CONFLICT (page_key, section_key) DO UPDATE
SET
  section_type = 'image-text',
  label = 'À propos - Aperçu',
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  description = EXCLUDED.description,
  content = EXCLUDED.content,
  images = EXCLUDED.images,
  sort_order = 5;

-- Services preview (cards) : title, highlight, description, link button
UPDATE page_sections
SET
  title = 'Nos services',
  subtitle = '',
  description = 'Découvrez nos solutions solaires professionnelles adaptées à vos besoins, conçues pour durer.',
  content = $JSON${
    "titleHighlight": "solaires",
    "button": {"label": "Voir tous nos services", "href": "/services", "variant": "outline"}
  }$JSON$::jsonb
WHERE page_key = 'home' AND section_key = 'services-preview';

-- Projects preview (gallery) : title, highlight, description, link button
UPDATE page_sections
SET
  title = 'Nos réalisations',
  subtitle = '',
  description = 'Découvrez quelques-uns de nos projets solaires à Kinshasa et à travers la RDC.',
  content = $JSON${
    "titleHighlight": "récentes",
    "button": {"label": "Voir tous nos projets", "href": "/projects", "variant": "outline"}
  }$JSON$::jsonb
WHERE page_key = 'home' AND section_key = 'projects-preview';

-- Benefits (benefits) : title + items with iconColor
UPDATE page_sections
SET
  title = 'Pourquoi choisir Viking Solar ?',
  description = '',
  content = $JSON${
    "items": [
      {"title": "Énergie Propre & Durable", "description": "Zéro émission CO₂, 100% renouvelable. Contribuez à un Congo vert pour les générations futures.", "iconColor": "green"},
      {"title": "Réduction des Coûts", "description": "Économisez jusqu'à 90% sur votre facture d'électricité dès la première année d'exploitation.", "iconColor": "blue"},
      {"title": "Support Technique 24/7", "description": "Notre équipe est disponible à tout moment pour répondre à vos questions et résoudre les incidents rapidement.", "iconColor": "orange"},
      {"title": "Installation Rapide", "description": "De la validation du devis à la mise en service : 1 à 5 jours selon la taille du projet. Zéro attente inutile.", "iconColor": "teal"},
      {"title": "Performance Fiable", "description": "Équipements de marques certifiées IEC/ISO. Garantie fabricant jusqu'à 25 ans sur les modules photovoltaïques.", "iconColor": "purple"}
    ]
  }$JSON$::jsonb
WHERE page_key = 'home' AND section_key = 'benefits';

-- CTA (cta) : title, description, buttons
UPDATE page_sections
SET
  title = 'Prêt à passer à l''énergie solaire ?',
  description = 'Obtenez un devis gratuit et personnalisé pour votre installation solaire à Kinshasa. Contactez-nous dès aujourd''hui.',
  content = $JSON${
    "button": {"label": "Écrire sur WhatsApp", "href": "https://wa.me/243820128315", "variant": "whatsapp"}
  }$JSON$::jsonb
WHERE page_key = 'home' AND section_key = 'cta';
