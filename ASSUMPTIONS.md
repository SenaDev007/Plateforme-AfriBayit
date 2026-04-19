# AfriBayit — Hypothèses techniques (ASSUMPTIONS.md)

Ce document liste les décisions architecturales prises en l'absence de précision dans le CDC.

## Paiements

- **FedaPay** est utilisé pour Mobile Money FCFA (Bénin, CI, BF, Togo) — sandbox disponible.
- **Stripe** est utilisé pour les paiements par carte internationaux — USD/EUR.
- Les montants sont stockés en `Decimal(15,2)` en FCFA par défaut.
- Le webhook FedaPay utilise une vérification par secret partagé (simplifié). En production : HMAC-SHA256.

## Multi-tenancy

- Approche par sous-domaine (`bj.afribayit.com`) détectée dans le middleware Next.js.
- Un seul schéma PostgreSQL est utilisé (pas de schéma par tenant) pour simplifier les migrations Prisma. La séparation se fait par le champ `country` sur les entités.
- En production, on pourrait migrer vers `pg_schema` par pays si les régulations l'exigent.

## Authentification

- `next-auth@5` (beta) est utilisé côté frontend. Le backend NestJS gère ses propres JWT.
- Le Magic Link email n'est pas implémenté dans cette phase — à ajouter avec Resend + NextAuth.
- La 2FA est TOTP (Google Authenticator) — pas SMS dans cette version.

## KYC

- KYC niveau 1 = CNI + selfie. Les documents sont uploadés directement vers Cloudflare R2 via URL pré-signée.
- La vérification est manuelle dans cette phase (équipe admin). L'intégration Smile Identity / Identix est prévue en Phase 1.

## Images et médias

- Upload via URL pré-signée Cloudflare R2 (accès direct depuis le navigateur, sans passer par l'API).
- Format accepté : JPG, PNG, WebP — max 5 Mo par image.
- Le CDN public est configuré sur `media.afribayit.com`.

## Géolocalisation

- PostGIS est activé sur PostgreSQL. Les coordonnées lat/lon sont stockées en Float pour la compatibilité Prisma.
- La recherche géospatiale avancée (rayon) est faite via Elasticsearch `geo_distance`.
- Mapbox est utilisé pour la carte interactive (token public requis).

## Hôtels

- Module hôtelier simplifié (pas de channel manager external dans cette phase).
- Les disponibilités ne sont pas gérées en temps réel — les conflits de réservation sont détectés à la création.

## Artisans

- Le module artisans est présent dans le schéma Prisma mais les endpoints REST sont à compléter en Phase 1.

## Notifications push

- VAPID keys pour Web Push sont générées avec `web-push` — à configurer dans `.env`.
- WhatsApp Business API est prévu mais non implémenté dans cette phase.

## Multilingue

- L'app est en français dans cette phase.
- L'architecture i18n (next-intl) est à ajouter en Phase 1 pour l'anglais et les langues locales.

## Sécurité

- `helmet` + CORS strict activés sur le backend.
- Rate limiting : 100 req/min global, 10 req/min pour login, 5 req/min pour register.
- Les secrets ne sont jamais hardcodés — tous dans `.env`.

## Base de données

- `createdAt` / `updatedAt` sont automatiquement gérés par Prisma.
- Les soft-deletes ne sont pas utilisés dans cette version (propriétés = `status: ARCHIVED`).
