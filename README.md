# Viking Solar – Application Web Professionnelle

Application web complète pour **Viking Solar**, entreprise leader en énergie solaire à Kinshasa, RDC.

---

## Stack

| Couche       | Technologies                                    |
| ------------ | ----------------------------------------------- |
| Frontend     | Next.js 15 (App Router), React 19, TypeScript   |
| Styles       | Tailwind CSS 3, Framer Motion, Lucide Icons     |
| Formulaires  | React Hook Form, Zod                             |
| Backend      | Next.js API Routes, Node.js                     |
| Base de données | Supabase PostgreSQL                          |
| Authentification | Supabase Auth                               |
| Déploiement  | Vercel + Supabase                               |

---

## Installation

```bash
# 1. Cloner le projet
git clone <url-du-repo>

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les valeurs Supabase dans .env.local

# 4. Lancer en développement
npm run dev
```

---

## Variables d'environnement

Copier `.env.example` en `.env.local` et renseigner :

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (serveur uniquement) |
| `SUPABASE_JWT_SECRET` | Secret JWT Supabase |
| `DATABASE_URL` | URL de connexion PostgreSQL |

---

## Base de données

### Schéma

```bash
# Appliquer le schéma
psql $DATABASE_URL -f supabase/schema.sql

# Peupler les données de test
psql $DATABASE_URL -f supabase/seed.sql
```

### Tables principales

- `users` – Utilisateurs (extends auth.users)
- `roles` / `user_roles` – Gestion des rôles (admin, manager, user)
- `services` – Services proposés
- `projects` – Projets et réalisations
- `team_members` – Équipe dirigeante
- `contact_messages` – Messages de contact
- `newsletter_subscribers` – Abonnés newsletter
- `faq_items` – Questions fréquentes
- `testimonials` – Témoignages clients
- `site_settings` – Paramètres du site
- `activity_logs` – Journal d'activité
- `notifications` – Notifications

---

## Architecture

```
app/                    # Routes Next.js (App Router)
├── (pages)/
│   ├── page.tsx        # Accueil
│   ├── about/          # À propos
│   ├── services/       # Services
│   ├── projects/       # Projets
│   └── contact/        # Contact
├── admin/              # Dashboard admin
│   ├── login/
│   ├── page.tsx        # Dashboard
│   ├── content/
│   ├── projects/
│   ├── messages/
│   ├── team/
│   └── settings/
├── api/                # API Routes
│   ├── auth/
│   ├── contact/
│   ├── messages/
│   ├── newsletter/
│   └── projects/
├── layout.tsx          # Layout racine
├── not-found.tsx       # Page 404
├── error.tsx           # Error boundary
├── loading.tsx         # Loading skeleton
├── sitemap.ts          # Sitemap XML
└── robots.ts           # Robots.txt
components/
├── layout/             # Header, Footer, WhatsApp FAB
├── ui/                 # Button, Card, Input, Reveal, SectionHeader
├── shared/             # Composants réutilisables
└── sections/           # Sections par page
constants/              # Données statiques (services, projects, team, faq, benefits)
config/                 # Configuration (site, routes, seo)
features/               # Fonctionnalités métier
hooks/                  # Hooks personnalisés
lib/                    # Utilitaires, Supabase client/server
services/               # Services métier
supabase/               # SQL schema + seed
types/                  # Types TypeScript
utils/                  # Utilitaires généraux
middleware.ts           # Middleware (auth, session)
```

---

## Commandes

| Commande | Description |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le build |
| `npm run lint` | Linting ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm run format` | Formatage Prettier |

---

## Déploiement Vercel

1. Push le repo sur GitHub
2. Importer le projet sur Vercel
3. Configurer les variables d'environnement dans Vercel
4. Le build se lance automatiquement

---

## Sécurité

- Headers HTTP sécurisés (CSP, HSTS, XSS Protection)
- Validation côté client (Zod) et serveur (Zod API Routes)
- Row Level Security (RLS) sur toutes les tables Supabase
- Protection CSRF via cookies Supabase
- Variables d'environnement jamais exposées côté client
- Rate limiting sur les API routes

---

## SEO

- Metadata optimisées par page (title, description, Open Graph)
- Sitemap XML automatique (`app/sitemap.ts`)
- Robots.txt (`app/robots.ts`)
- Structured Data JSON-LD
- Images optimisées (AVIF/WebP via Next.js)
- Server Components pour le SEO (HTML rendu côté serveur)

---

## Licence

© 2026 Viking Solar. Tous droits réservés.
