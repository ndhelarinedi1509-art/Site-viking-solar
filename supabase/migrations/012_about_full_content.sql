-- ──────────────────────────────────────────────
-- Viking Solar CMS – 012
--  1. Supprime la page "Contact" de l'admin (/contact n'existe pas en public).
--  2. Remplit la section "innovation" de /about avec tout le contenu visible
--     sur la page publique (Notre Histoire / Mission / Vision / cartes).
--  3. Ajoute les photos de profil de l'équipe dirigeante.
-- Idempotent.
-- ──────────────────────────────────────────────

-- 1. Page contact : il n'existe aucune route publique /contact
DELETE FROM page_sections WHERE page_key = 'contact';

-- 2. Innovation : tout le contenu de la section (la description reste inchangée)
UPDATE page_sections
SET content = $JSON${
  "badge": "Notre histoire & notre mission",
  "titleHighlight": "au cœur du Congo",
  "story": {
    "badge": "NOTRE HISTOIRE",
    "title": "Qui Sommes-Nous",
    "titleHighlight": "Vraiment",
    "missionLabel": "Notre mission",
    "mission": "Notre mission est claire : rendre l’énergie solaire accessible, fiable et durable pour chaque foyer, entreprise et industrie congolais.",
    "visionLabel": "Notre vision",
    "vision": "Nous imaginons un Congo où l’énergie propre est la norme, pas un luxe."
  },
  "mission": {
    "badge": "Notre mission",
    "title": "Mission",
    "cards": [
      {
        "title": "Vision Solaire",
        "description": "Démocratiser l’accès à l’énergie propre et fiable pour chaque foyer et entreprise congolais grâce à des solutions solaires innovantes et accessibles."
      },
      {
        "title": "Engagement Durable",
        "description": "Nous nous engageons à réduire l’empreinte carbone de nos clients tout en contribuant au développement économique local et à la création d’emplois verts en RDC."
      }
    ]
  }
}$JSON$::jsonb
WHERE page_key = 'about' AND section_key = 'innovation';

-- 3. Équipe : photos de profil (Rinedi garde sa photo réelle, avatars pour les autres)
UPDATE page_sections
SET content = content || $JSON${
  "items": [
    { "name": "Victor-Makole", "role": "CEO / Fondateur", "photo": "/images/avatar-victor.svg" },
    { "name": "Sarah K.", "role": "Directrice Technique", "photo": "/images/avatar-sarah.svg" },
    { "name": "Rinedi Ndhela", "role": "Directeur / Informaticien", "photo": "/images/rey.jpg" },
    { "name": "Arlette B.", "role": "Resp. Commerciale", "photo": "/images/avatar-arlette.svg" }
  ]
}$JSON$::jsonb
WHERE page_key = 'about' AND section_key = 'team';
