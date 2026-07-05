-- Viking Solar - Seed Data
-- ========================

-- 1. Insert admin user role (assumes an auth user with this UUID exists)
INSERT INTO users (id, full_name, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Admin Viking Solar',
  'admin'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert categories
INSERT INTO categories (name, slug, description, color) VALUES
  ('Industriel', 'industriel', 'Projets industriels et logistiques', 'purple'),
  ('Résidentiel', 'residentiel', 'Maisons, villas et résidences', 'blue'),
  ('Commercial', 'commercial', 'Bureaux et commerces', 'green'),
  ('Institutionnel', 'institutionnel', 'Écoles, hôpitaux et institutions', 'teal'),
  ('Hybride', 'hybride', 'Systèmes combinés solaire + batterie + groupe', 'orange'),
  ('Solaire', 'solaire', 'Installations photovoltaïques pures', 'amber')
ON CONFLICT (slug) DO NOTHING;

-- 3. Insert services
INSERT INTO services (title, slug, description, features, tag, color, featured, icon, "order") VALUES
(
  'Installation Solaire',
  'installation-solaire',
  'Conception, dimensionnement et installation complète de systèmes photovoltaïques. Du panneau à l''onduleur, nous garantissons une finition irréprochable.',
  '["Étude de faisabilité gratuite", "Panneaux certifiés haute efficacité", "Garantie 25 ans sur les modules"]'::jsonb,
  'Résidentiel & Commercial',
  'blue',
  false,
  'sun',
  1
),
(
  'Systèmes Hybrides',
  'systemes-hybrides',
  'Alliance intelligente entre solaire, batteries lithium et groupes électrogènes pour une alimentation 24h/24, même en cas de coupure de réseau.',
  '["Batteries lithium longue durée", "Basculement automatique", "Monitoring intelligent en temps réel"]'::jsonb,
  'Continuité garantie',
  'green',
  true,
  'file-text',
  2
),
(
  'Maintenance Électrique',
  'maintenance-electrique',
  'Surveillance continue, entretien préventif et dépannage rapide de vos installations. Nos techniciens interviennent sous 24h partout à Kinshasa.',
  '["Contrat de maintenance annuel", "Intervention sous 24h", "Rapport mensuel de performance"]'::jsonb,
  'Préventif & Curatif',
  'orange',
  false,
  'wrench',
  3
),
(
  'Énergie Industrielle',
  'energie-industrielle',
  'Infrastructure solaire sur mesure pour usines, entrepôts, mines et grands complexes industriels. Des solutions robustes pensées pour la RDC.',
  '["Systèmes de 50 kW à 10 MW", "Ingénierie complète on-site", "ROI optimisé < 4 ans"]'::jsonb,
  'Grande échelle',
  'purple',
  false,
  'industrial',
  4
),
(
  'Énergie Résidentielle',
  'energie-residentielle',
  'Solutions solaires élégantes pour maisons, villas et résidences modernes. Réduisez votre facture électrique jusqu''à 90% dès le premier mois.',
  '["Installation esthétique intégrée", "Autonomie totale possible", "App de suivi sur smartphone"]'::jsonb,
  'Maisons & Villas',
  'teal',
  false,
  'home',
  5
),
(
  'Études Techniques',
  'etudes-techniques',
  'Analyses de faisabilité solaire, dimensionnement précis et rapports techniques certifiés. Une base solide pour chaque projet, grand ou petit.',
  '["Étude d''ensoleillement local", "Rapport de rentabilité détaillé", "Schémas électriques certifiés"]'::jsonb,
  'Expertise technique',
  'amber',
  false,
  'clipboard-list',
  6
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert projects
INSERT INTO projects (title, slug, description, category_id, power, location, tags, features, featured, "order") VALUES
(
  'Complexe Industriel et Logistique',
  'complexe-industriel-et-logistique',
  'Installation hybride de 250 kW avec batteries au lithium de haute capacité pour garantir une autonomie de 24h et stabiliser la production.',
  (SELECT id FROM categories WHERE slug = 'industriel'),
  '250 kW',
  'Limete, Kinshasa',
  ARRAY['Solaire', 'Hybride', '250 kW'],
  ARRAY['Hybride lithium', 'Autonomie 24h', 'Monitoring IoT'],
  true,
  1
),
(
  'Villa Moderne Autonome',
  'villa-moderne-autonome',
  'Conception et installation d''un système résidentiel esthétique de 15 kW. Intégration sur toiture et backup complet en cas de coupure réseau.',
  (SELECT id FROM categories WHERE slug = 'residentiel'),
  '15 kW',
  'Gombe, Kinshasa',
  ARRAY['Solaire', 'Batterie', '15 kW'],
  ARRAY['Toiture intégrée', 'App suivi', 'Silencieux'],
  false,
  2
),
(
  'Centre d''Affaires Principal',
  'centre-d-affaires-principal',
  'Alimentation solaire de 80 kW pour bureaux administratifs et commerces, permettant une réduction de 60% de la facture énergétique annuelle.',
  (SELECT id FROM categories WHERE slug = 'commercial'),
  '80 kW',
  'Ngaliema, Kinshasa',
  ARRAY['Solaire', 'Toiture', '80 kW'],
  ARRAY['Toiture solaire', 'Réduction 60%', 'Nettoyage auto'],
  false,
  3
),
(
  'Électrification École Publique',
  'electrification-ecole-publique',
  'Projet hybride solidaire de 35 kW fournissant une énergie stable aux salles de classe, laboratoires et espaces informatiques.',
  (SELECT id FROM categories WHERE slug = 'institutionnel'),
  '35 kW',
  'Matete, Kinshasa',
  ARRAY['Institutionnel', 'Hybride', '35 kW'],
  ARRAY['35 kW hybride', 'Labo équipé', 'Soutien pédagogique'],
  false,
  4
),
(
  'Résidence Familiale Haute Sécurité',
  'residence-familiale-haute-securite',
  'Installation hybride de 10 kW pour garantir la sécurité et l''éclairage en continu pour une résidence sécurisée.',
  (SELECT id FROM categories WHERE slug = 'residentiel'),
  '10 kW',
  'Macampagne, Kinshasa',
  ARRAY['Solaire', 'Hybride', '10 kW'],
  ARRAY['Éclairage continu', 'Sécurité', 'Batterie LiFePO4'],
  false,
  5
),
(
  'Entrepôt Frigorifique Alimentaire',
  'entrepot-frigorifique-alimentaire',
  'Mise en place d''une toiture solaire de 120 kW pour réduire la dépendance au réseau et alimenter les chambres froides.',
  (SELECT id FROM categories WHERE slug = 'industriel'),
  '120 kW',
  'Kingabwa, Kinshasa',
  ARRAY['Toiture', 'Solaire', '120 kW'],
  ARRAY['120 kW toiture', 'Chambres froides', 'ROI < 5 ans'],
  false,
  6
)
ON CONFLICT (slug) DO NOTHING;

-- 5. Insert team members
INSERT INTO team_members (name, role, "order") VALUES
('Victor-Makole .', 'CEO / Fondateur', 1),
('Sarah K.', 'Directrice Technique', 2),
('Rinedi ndhela', 'Directeur / Informaticien', 3),
('Arlette B.', 'Resp. Commerciale', 4);

-- 6. Insert FAQ items
INSERT INTO faq_items (question, answer, "order") VALUES
(
  'Comment se déroule l''installation d''un système solaire ?',
  'Nous commençons par une visite sur site pour évaluer vos besoins énergétiques. Ensuite, nous vous proposons un devis détaillé. Une fois accepté, notre équipe d''experts procède à l''installation avec du matériel certifié, et nous effectuons des tests rigoureux avant la mise en service.',
  1
),
(
  'Proposez-vous des contrats de maintenance ?',
  'Oui, nous offrons des contrats de maintenance préventive et curative. Cela inclut le nettoyage des panneaux, la vérification des onduleurs et des batteries, afin de garantir la longévité et les performances de votre installation.',
  2
),
(
  'Les devis (quotations) sont-ils payants ?',
  'Non, nos premières études et devis sont totalement gratuits. Nous analysons votre facture d''électricité ou vos équipements pour vous proposer la solution la plus adaptée sans engagement.',
  3
),
(
  'Quelles sont les garanties sur vos équipements ?',
  'Nous travaillons avec les meilleures marques du marché. Nos panneaux solaires sont généralement garantis 25 ans sur la performance, et les onduleurs/batteries bénéficient d''une garantie constructeur de 5 à 10 ans selon les modèles.',
  4
),
(
  'Qu''est-ce qu''un système hybride ?',
  'Un système hybride combine l''énergie solaire, le réseau électrique public (SNEL) et/ou un groupe électrogène. Il permet de gérer intelligemment les coupures de courant et d''optimiser l''utilisation de l''énergie solaire pour réduire la facture tout en assurant une alimentation continue.',
  5
);

-- 7. Insert site settings
INSERT INTO site_settings (key, value) VALUES
('hero_title', '"Votre Partenaire en Énergie Solaire Durable"'),
('hero_subtitle', '"Solutions photovoltaïques modernes et fiables pour la RDC. Réduisez vos coûts énergétiques et gagnez en autonomie."'),
('hero_badge', '"Leader de l''énergie solaire en RDC"'),
('contact_phone', '"+243 820 128 315"'),
('contact_email', '"vikingsolar58@gmail.com"'),
('contact_address', '"Kinshasa, RDC"')
ON CONFLICT (key) DO NOTHING;
