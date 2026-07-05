import type { Service } from '@/types';

export const SERVICES: Service[] = [
  {
    id: 'installation-solaire',
    title: 'Installation Solaire',
    description:
      'Conception, dimensionnement et installation complète de systèmes photovoltaïques. Du panneau à l\'onduleur, nous garantissons une finition irréprochable.',
    features: [
      'Étude de faisabilité gratuite',
      'Panneaux certifiés haute efficacité',
      'Garantie 25 ans sur les modules',
    ],
    tag: 'Résidentiel & Commercial',
    color: 'blue',
    featured: false,
    icon: 'sun',
  },
  {
    id: 'systemes-hybrides',
    title: 'Systèmes Hybrides',
    description:
      'Alliance intelligente entre solaire, batteries lithium et groupes électrogènes pour une alimentation 24h/24, même en cas de coupure de réseau.',
    features: [
      'Batteries lithium longue durée',
      'Basculement automatique',
      'Monitoring intelligent en temps réel',
    ],
    tag: 'Continuité garantie',
    color: 'green',
    featured: true,
    icon: 'file-text',
  },
  {
    id: 'maintenance-electrique',
    title: 'Maintenance Électrique',
    description:
      'Surveillance continue, entretien préventif et dépannage rapide de vos installations. Nos techniciens interviennent sous 24h partout à Kinshasa.',
    features: [
      'Contrat de maintenance annuel',
      'Intervention sous 24h',
      'Rapport mensuel de performance',
    ],
    tag: 'Préventif & Curatif',
    color: 'orange',
    featured: false,
    icon: 'wrench',
  },
  {
    id: 'energie-industrielle',
    title: 'Énergie Industrielle',
    description:
      'Infrastructure solaire sur mesure pour usines, entrepôts, mines et grands complexes industriels. Des solutions robustes pensées pour la RDC.',
    features: [
      'Systèmes de 50 kW à 10 MW',
      'Ingénierie complète on-site',
      'ROI optimisé < 4 ans',
    ],
    tag: 'Grande échelle',
    color: 'purple',
    featured: false,
    icon: 'industrial',
  },
  {
    id: 'energie-residentielle',
    title: 'Énergie Résidentielle',
    description:
      'Solutions solaires élégantes pour maisons, villas et résidences modernes. Réduisez votre facture électrique jusqu\'à 90% dès le premier mois.',
    features: [
      'Installation esthétique intégrée',
      'Autonomie totale possible',
      'App de suivi sur smartphone',
    ],
    tag: 'Maisons & Villas',
    color: 'teal',
    featured: false,
    icon: 'home',
  },
  {
    id: 'etudes-techniques',
    title: 'Études Techniques',
    description:
      'Analyses de faisabilité solaire, dimensionnement précis et rapports techniques certifiés. Une base solide pour chaque projet, grand ou petit.',
    features: [
      'Étude d\'ensoleillement local',
      'Rapport de rentabilité détaillé',
      'Schémas électriques certifiés',
    ],
    tag: 'Expertise technique',
    color: 'amber',
    featured: false,
    icon: 'clipboard-list',
  },
];
