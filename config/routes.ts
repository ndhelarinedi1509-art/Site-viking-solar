export const ROUTES = {
  home: '/',
  actualites: '/actualites',
  about: '/about',
  services: '/services',
  projects: '/projects',
  contact: '/about#contact',
  admin: '/admin',
  deployGratuit: '/about#contact',
} as const;

export const NAV_ITEMS = [
  { label: 'Accueil', href: ROUTES.home },
  { label: 'Actualités', href: ROUTES.actualites },
  { label: 'Services', href: ROUTES.services },
  { label: 'Projets', href: ROUTES.projects },
  { label: 'À propos', href: ROUTES.about },
] as const;

export const FOOTER_QUICK_LINKS = [
  { label: 'Accueil', href: ROUTES.home },
  { label: 'Actualités', href: ROUTES.actualites },
  { label: 'Services', href: ROUTES.services },
  { label: 'Projets', href: ROUTES.projects },
  { label: 'À propos', href: ROUTES.about },
] as const;

export const FOOTER_SERVICE_LINKS = [
  { label: 'Installation Solaire', href: '/services#installation-solaire' },
  { label: 'Systèmes Hybrides', href: '/services#systemes-hybrides' },
  { label: 'Maintenance', href: '/services#maintenance-electrique' },
  { label: 'Solutions Industrielles', href: '/services#energie-industrielle' },
  { label: 'Études Techniques', href: '/services#etudes-techniques' },
] as const;
