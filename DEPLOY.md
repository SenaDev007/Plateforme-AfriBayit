# AfriBayit — Guide de déploiement

## Frontend (Vercel)

### 1. Importer le projet

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Importer le repo GitHub `SenaDev007/Plateforme-AfriBayit`
3. **Root Directory** : laisser vide (le `vercel.json` racine gère tout)
4. **Framework** : Next.js (auto-détecté)
5. Cliquer **Deploy**

### 2. Variables d'environnement Vercel

Dans **Settings → Environment Variables**, ajouter :

| Variable | Valeur | Env |
|---|---|---|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` | Production, Preview |
| `NEXTAUTH_URL` | `https://afribayit.com` | Production |
| `NEXTAUTH_URL` | `https://*.vercel.app` | Preview |
| `NEXT_PUBLIC_API_URL` | `https://afribayit-api.fly.dev` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://afribayit.com` | Production |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | `pk.eyJ1...` | All |
| `GOOGLE_CLIENT_ID` | `...apps.googleusercontent.com` | All |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | All |
| `FACEBOOK_CLIENT_ID` | `123456789` | All |
| `FACEBOOK_CLIENT_SECRET` | `abc123...` | All |

### 3. Turbo Remote Cache (optionnel, accélère les builds CI)

```bash
npx turbo login
npx turbo link
```

Puis dans Vercel → Settings → Environment Variables :
- `TURBO_TOKEN` : token généré par `turbo login`
- `TURBO_TEAM` : votre équipe Turbo

### 4. Domaine personnalisé

Dans **Settings → Domains** :
- `afribayit.com` → Production
- `www.afribayit.com` → Redirect vers `afribayit.com`

Sous-domaines pays (optionnel) :
- `bj.afribayit.com` → Bénin
- `ci.afribayit.com` → Côte d'Ivoire
- `bf.afribayit.com` → Burkina Faso
- `tg.afribayit.com` → Togo

---

## Backend (Fly.io)

### Prérequis

```bash
curl -L https://fly.io/install.sh | sh
fly auth login
```

### Premier déploiement

```bash
cd apps/api
fly launch --name afribayit-api --region cdg
fly secrets set \
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="$(openssl rand -base64 64)" \
  FEDAPAY_SECRET_KEY="sk_live_..." \
  STRIPE_SECRET_KEY="sk_live_..." \
  RESEND_API_KEY="re_..." \
  CLOUDFLARE_R2_ACCESS_KEY="..." \
  CLOUDFLARE_R2_SECRET_KEY="..." \
  CLOUDFLARE_R2_BUCKET="afribayit-media" \
  CLOUDFLARE_R2_ENDPOINT="https://<account>.r2.cloudflarestorage.com" \
  AFRICASTALKING_API_KEY="..."
fly deploy
```

### Mise à jour

```bash
cd apps/api && fly deploy
```

---

## Base de données (PostgreSQL + PostGIS)

### Option recommandée : Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Activer l'extension PostGIS : **Database → Extensions → postgis**
3. Copier la `DATABASE_URL` (mode `Transaction pooler` pour Fly.io)

### Migrations

```bash
# Depuis la racine du monorepo
cd packages/db
npx prisma migrate deploy
npx prisma db seed
```

---

## CI/CD (GitHub Actions)

Le workflow `.github/workflows/ci.yml` :
- **Quality** : lint + typecheck sur chaque PR
- **Test** : tests unitaires avec PostgreSQL de service
- **Deploy web** : push sur `main` → Vercel (via Vercel CLI)
- **Deploy API** : push sur `main` → Fly.io

### Secrets GitHub à configurer

Dans **Settings → Secrets → Actions** :

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Token API Vercel (Settings → Tokens) |
| `VERCEL_ORG_ID` | Visible dans `.vercel/project.json` après `vercel link` |
| `VERCEL_PROJECT_ID` | Visible dans `.vercel/project.json` |
| `FLY_API_TOKEN` | `fly tokens create deploy -x 999999h` |
| `DATABASE_URL` | URL PostgreSQL pour les tests |

---

## Checklist de mise en production

- [ ] Variables d'environnement configurées dans Vercel
- [ ] Variables d'environnement configurées dans Fly.io (`fly secrets`)
- [ ] Domaine vérifié dans Vercel
- [ ] DNS configuré (A/CNAME vers Vercel, MX pour emails)
- [ ] Migrations Prisma exécutées (`prisma migrate deploy`)
- [ ] Seed de données initiales (`prisma db seed`)
- [ ] OAuth apps Google + Facebook configurées avec callback URLs de production
- [ ] FedaPay mode live activé
- [ ] Stripe webhooks configurés
- [ ] Clé VAPID générée pour les push notifications
- [ ] Monitoring (Sentry DSN configuré)
- [ ] Backup PostgreSQL activé (quotidien)
