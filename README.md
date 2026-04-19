# AfriBayit — Super-App Immobilière Pan-Africaine

> Plateforme immobilière tout-en-un pour l'Afrique de l'Ouest — Bénin, Côte d'Ivoire, Burkina Faso, Togo.

## Stack technique

| Couche | Technologie |
|--------|------------|
| Frontend | Next.js 15 (App Router, TypeScript strict) |
| Backend | NestJS 11 + Passport + JWT |
| Base de données | PostgreSQL 16 + PostGIS + Prisma 6 |
| Cache | Redis 7 |
| Recherche | Elasticsearch 8 |
| Paiements | FedaPay (Mobile Money) + Stripe (cartes) |
| Stockage | Cloudflare R2 |
| Email | Resend |
| SMS | Africa's Talking |
| Maps | Mapbox GL JS |
| Monorepo | Turborepo 2 |
| CI/CD | GitHub Actions → Vercel + Fly.io |

---

## Structure du projet

```
afribayit/
├── apps/
│   ├── web/                    # Next.js 15 (frontend)
│   └── api/                    # NestJS 11 (backend)
├── packages/
│   ├── ui/                     # Design system partagé
│   ├── db/                     # Prisma schema + client
│   └── config/                 # ESLint, TypeScript, Tailwind configs
├── .github/workflows/          # CI/CD GitHub Actions
├── docker-compose.yml          # Infra locale (Postgres, Redis, Elastic)
├── ASSUMPTIONS.md              # Hypothèses architecturales
└── .env.example               # Variables d'environnement
```

---

## Démarrage rapide

### Prérequis

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Docker** + **Docker Compose**
- **Git**

### 1. Cloner et installer

```bash
git clone https://github.com/SenaDev007/Plateforme-AfriBayit.git
cd Plateforme-AfriBayit
npm install
```

### 2. Variables d'environnement

```bash
cp .env.example apps/web/.env.local
cp .env.example apps/api/.env
```

Remplissez les valeurs dans les deux fichiers `.env`.

### 3. Lancer l'infrastructure

```bash
docker compose up -d
```

Ce démarrage lance :
- PostgreSQL 16 + PostGIS sur le port **5432**
- Redis 7 sur le port **6379**
- Elasticsearch 8 sur le port **9200**

### 4. Initialiser la base de données

```bash
cd packages/db
npx prisma generate
npx prisma migrate dev --name init
npx ts-node src/seed.ts
cd ../..
```

### 5. Lancer en développement

```bash
npm run dev
```

- **Frontend** : [http://localhost:3000](http://localhost:3000)
- **API** : [http://localhost:4000](http://localhost:4000)
- **Swagger** : [http://localhost:4000/api/docs](http://localhost:4000/api/docs)

---

## Commandes utiles

```bash
# Build complet
npm run build

# Tests unitaires
npm run test

# Tests E2E (Playwright)
cd apps/web && npx playwright test

# Lint
npm run lint

# Type check
npm run typecheck

# Prisma Studio (UI base de données)
cd packages/db && npx prisma studio

# Générer un nouveau composant UI
cd packages/ui && npx hygen component new
```

---

## Modules fonctionnels

### Immobilier
- Annonces avec photos, plans 3D, géolocalisation
- Recherche full-text (Elasticsearch) + filtres géospatiaux
- Système de favoris
- KYC niveau 1 pour vendeurs

### Escrow (Transactions sécurisées)
State machine : `INITIATED → FUNDED → VALIDATED → RELEASED → COMPLETED`

```
Acheteur initie → FedaPay/Stripe capture → Fonds bloqués en escrow
→ Vendeur remet les clés → Acheteur confirme → Fonds libérés
```

### Authentification
- Email/mot de passe avec validation Zod
- OAuth Google + Facebook
- 2FA TOTP (Google Authenticator)
- RBAC : `BUYER | SELLER | INVESTOR | TOURIST | ARTISAN | ADMIN`

### Multi-tenancy
Détection automatique du pays par sous-domaine :

| URL | Pays |
|-----|------|
| `bj.afribayit.com` | 🇧🇯 Bénin |
| `ci.afribayit.com` | 🇨🇮 Côte d'Ivoire |
| `bf.afribayit.com` | 🇧🇫 Burkina Faso |
| `tg.afribayit.com` | 🇹🇬 Togo |

---

## Architecture API

```
GET  /api/v1/properties          # Recherche propriétés
GET  /api/v1/properties/:slug    # Détail propriété
POST /api/v1/properties          # Créer annonce (auth)
POST /api/v1/auth/register       # Inscription
POST /api/v1/auth/login          # Connexion
GET  /api/v1/auth/me             # Profil (auth)
POST /api/v1/transactions        # Initier transaction escrow (auth)
POST /api/v1/transactions/:id/release  # Libérer escrow (auth)
GET  /api/v1/notifications       # Mes notifications (auth)
GET  /api/v1/search              # Recherche Elasticsearch
```

---

## Design System

### Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `navy` | `#003087` | Couleur principale |
| `gold` | `#D4AF37` | Premium, CTA secondaire |
| `sky` | `#009CDE` | Informations |
| `emerald` | `#00A651` | Succès, vérifié |
| `danger` | `#D93025` | Erreurs |
| `charcoal` | `#2C2E2F` | Texte principal |

### Typographie
- **Titres** : Cormorant Garamond (serif)
- **Corps** : DM Sans (sans-serif)
- **Données/Code** : DM Mono (monospace)

---

## Déploiement

### Frontend (Vercel)
```bash
# Configurer le projet Vercel
npx vercel link

# Déployer
npx vercel deploy --prod
```

Variables à configurer sur Vercel :
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_MAPBOX_TOKEN`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`

### Backend (Fly.io)
```bash
cd apps/api

# Créer l'app
flyctl apps create afribayit-api

# Configurer les secrets
flyctl secrets set JWT_SECRET="..." DATABASE_URL="..."

# Déployer
flyctl deploy
```

---

## Variables d'environnement critiques

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Connexion PostgreSQL |
| `JWT_SECRET` | Clé JWT (≥ 32 chars) |
| `NEXTAUTH_SECRET` | Secret NextAuth (≥ 32 chars) |
| `FEDAPAY_SECRET_KEY` | FedaPay API key |
| `STRIPE_SECRET_KEY` | Stripe API key |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 credentials |
| `RESEND_API_KEY` | Resend email |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |

Voir `.env.example` pour la liste complète.

---

## Contribuer

1. `git checkout -b feature/ma-feature`
2. Faire les changements (TypeScript strict, mobile-first, WCAG 2.1 AA)
3. `npm run lint && npm run typecheck && npm run test`
4. Créer une PR vers `develop`

---

## Roadmap Phase 1

- [ ] Intégration Smile Identity (KYC automatisé)
- [ ] Module Hôtels complet + channel manager
- [ ] Module Artisans avec marketplace
- [ ] App mobile React Native
- [ ] Dashboard admin (metrics, modération)
- [ ] Internationalisation (next-intl)
- [ ] Intégration WhatsApp Business

---

*Développé par YEHI OR Tech — © 2026 AfriBayit*
