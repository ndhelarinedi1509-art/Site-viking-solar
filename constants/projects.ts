import type { Project } from '@/types';

export const PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Complexe Industriel et Logistique',
    description:
      'Installation hybride de 250 kW avec batteries au lithium de haute capacité pour garantir une autonomie de 24h et stabiliser la production.',
    category: 'industriel',
    power: '250 kW',
    location: 'Limete, Kinshasa',
    tags: ['Solaire', 'Hybride', '250 kW'],
    features: ['Hybride lithium', 'Autonomie 24h', 'Monitoring IoT'],
  },
  {
    id: 'proj-2',
    title: 'Villa Moderne Autonome',
    description:
      'Conception et installation d\'un système résidentiel esthétique de 15 kW. Intégration sur toiture et backup complet en cas de coupure réseau.',
    category: 'residentiel',
    power: '15 kW',
    location: 'Gombe, Kinshasa',
    tags: ['Solaire', 'Batterie', '15 kW'],
    features: ['Toiture intégrée', 'App suivi', 'Silencieux'],
  },
  {
    id: 'proj-3',
    title: 'Centre d\'Affaires Principal',
    description:
      'Alimentation solaire de 80 kW pour bureaux administratifs et commerces, permettant une réduction de 60% de la facture énergétique annuelle.',
    category: 'commercial',
    power: '80 kW',
    location: 'Ngaliema, Kinshasa',
    tags: ['Solaire', 'Toiture', '80 kW'],
    features: ['Toiture solaire', 'Réduction 60%', 'Nettoyage auto'],
  },
  {
    id: 'proj-4',
    title: 'Électrification École Publique',
    description:
      'Projet hybride solidaire de 35 kW fournissant une énergie stable aux salles de classe, laboratoires et espaces informatiques.',
    category: 'commercial',
    power: '35 kW',
    location: 'Matete, Kinshasa',
    tags: ['Commercial', 'Hybride', '35 kW'],
    features: ['35 kW hybride', 'Labo équipé', 'Soutien pédagogique'],
  },
  {
    id: 'proj-5',
    title: 'Résidence Familiale Haute Sécurité',
    description:
      'Installation hybride de 10 kW pour garantir la sécurité et l\'éclairage en continu pour une résidence sécurisée.',
    category: 'residentiel',
    power: '10 kW',
    location: 'Macampagne, Kinshasa',
    tags: ['Solaire', 'Hybride', '10 kW'],
    features: ['Éclairage continu', 'Sécurité', 'Batterie LiFePO4'],
  },
  {
    id: 'proj-6',
    title: 'Entrepôt Frigorifique Alimentaire',
    description:
      'Mise en place d\'une toiture solaire de 120 kW pour réduire la dépendance au réseau et alimenter les chambres froides.',
    category: 'industriel',
    power: '120 kW',
    location: 'Kingabwa, Kinshasa',
    tags: ['Toiture', 'Solaire', '120 kW'],
    features: ['120 kW toiture', 'Chambres froides', 'ROI < 5 ans'],
  },
];

export const PROJECT_FILTERS = [
  { label: 'Tous', value: 'all' },
  { label: 'Résidentiel', value: 'residentiel' },
  { label: 'Industriel', value: 'industriel' },
  { label: 'Commercial', value: 'commercial' },
  { label: 'Hybride', value: 'hybride' },
  { label: 'Solaire', value: 'solaire' },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  residentiel: 'Résidentiel',
  industriel: 'Industriel',
  commercial: 'Commercial',
  institutionnel: 'Institutionnel',
};
