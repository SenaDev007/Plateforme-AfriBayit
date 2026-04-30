# AfriBayit — Roadmap Phase 1

> État d'avancement global : **~65-70%**  
> Cible de lancement Phase 1 : **T2 2026**

---

## Priorité P0 — Critique pour le lancement

Ces modules sont indispensables pour le lancement officiel. Sans eux, la plateforme ne peut pas opérer conformément au CDC.

### 1. Système Notaires & États Transactionnels

**Statut :** ❌ 0%  
**Impact :** Légal et conformité — différenciation majeure vs concurrence

**Tâches :**

- [ ] Ajouter les états transactionnels dans `TransactionStatus` :
  - `NOTARY_ASSIGNED`, `NOTARY_IN_PROGRESS`, `DEED_SIGNED`, `ANDF_REGISTERED`
- [ ] Créer l'entité `Notary` avec champs : `chamberId`, `jurisdiction`, `availability`
- [ ] Créer l'entité `NotaryAssignment` (transactionId, notaryId, assignedAt, completedAt, deedHash)
- [ ] Implémenter l'espace notaire (dashboard `/dashboard/notaire`)
- [ ] Workflow d'affectation automatique (round-robin par juridiction)
- [ ] Signature électronique des actes (intégration API Chambre des Notaires)
- [ ] Génération de hash SHA-256 pour ancrage (préparation Polygon)
- [ ] Endpoint API : `POST /api/v1/notaires/assign`, `GET /api/v1/notaires/transactions`

**Fichiers à modifier :**

- `packages/db/prisma/schema.prisma`
- `apps/api/src/transactions/`
- `apps/web/src/app/dashboard/notaire/` (nouveau)

---

### 2. Boost Premium Agent (Monétisation)

**Statut :** ❌ 20%  
**Impact :** Revenus récurrents — 15K-75K FCFA/mois par agent

**Tâches :**

- [ ] Créer entités `AgentSubscription`, `BoostTier`
  - Tiers : STARTER (x1.5), PRO (x2.5), ELITE (x4.0), AGENCE (sur-mesure)
- [ ] Modifier algorithme de tri des annonces pour intégrer le boost
- [ ] Implémenter le système d'abonnement (facturation récurrente)
- [ ] Dashboard agent : souscrire/gérer son abonnement
- [ ] Badge "Premium" sur les annonces boostées
- [ ] InMail AfriBayit (messagerie agent → prospect)
- [ ] Analytics pour agents (vues, favoris, contacts)

**Fichiers à modifier :**

- `packages/db/prisma/schema.prisma`
- `apps/api/src/properties/` (algorithme de tri)
- `apps/api/src/payments/` (abonnement Stripe/FedaPay)
- `apps/web/src/app/dashboard/abonnement/` (nouveau)

---

### 3. Notifications LinkedIn-like

**Statut :** ⚠️ 40%  
**Impact :** Engagement utilisateur — rétention

**Tâches :**

- [ ] Créer entité `NotificationCategory` (SYSTEM, TRANSACTION, MARKETING, SOCIAL)
- [ ] Créer entité `NotificationPreference` (par utilisateur et par canal)
- [ ] Cloche de notifications dans le header (`/dashboard/notifications`)
- [ ] Flux temps réel via WebSocket (déjà partiellement implémenté)
- [ ] Gestion fine par canal : Email, SMS, WhatsApp, Push in-app
- [ ] Agrégation intelligente ("3 nouvelles vues cette semaine")
- [ ] API : `PATCH /api/v1/notifications/preferences`

**Fichiers à modifier :**

- `packages/db/prisma/schema.prisma`
- `apps/api/src/notifications/`
- `apps/web/src/components/NotificationBell` (nouveau)

---

### 4. Multi-tenancy par Pays (Complet)

**Statut :** ⚠️ 30%  
**Impact :** Expansion pan-africaine — conformité locale

**Tâches :**

- [ ] Schema par pays ou colonne `country` sur toutes les entités critiques
- [ ] Middleware de détection automatique par sous-domaine
  - `bj.afribayit.com` → 🇧🇯 Bénin
  - `ci.afribayit.com` → 🇨🇮 Côte d'Ivoire
  - `bf.afribayit.com` → 🇧🇫 Burkina Faso
  - `tg.afribayit.com` → 🇹🇬 Togo
- [ ] Devise et règles de paiement par tenant
- [ ] Taxe/tarif notaire par pays
- [ ] Fuseau horaire par pays
- [ ] SEO multi-tenant (sitemap, meta tags par pays)

**Fichiers à modifier :**

- `packages/db/prisma/schema.prisma`
- `apps/api/src/security/tenant.guard.ts`
- `apps/web/src/middleware.ts`
- `apps/web/src/lib/country-config.ts` (nouveau)

---

### 5. Rebecca IA (Chatbot)

**Statut :** ❌ 10%  
**Impact :** Expérience utilisateur — différenciation

**Tâches :**

- [ ] Intégrer un modèle de langage (OpenAI, Anthropic, ou local)
- [ ] Base de connaissances : FAQ, guides, processus
- [ ] Suggestions de propriétés conversationnelles
- [ ] Handoff vers agent humain si besoin
- [ ] Widget de chat flottant sur tout le site
- [ ] Historique des conversations par utilisateur
- [ ] Analytics : taux de résolution, satisfaction

**Fichiers à créer :**

- `apps/api/src/rebecca-ia/` (module complet)
- `apps/web/src/components/RebeccaChatWidget` (nouveau)

---

## Priorité P1 — Important (post-lancement)

Ces modules améliorent l'expérience mais ne bloquent pas le lancement.

### 6. Guesthouses (Réservation chambre par chambre)

**Statut :** ⚠️ 40%  
**Tâches :**

- [ ] Entités `Guesthouse`, `GuesthouseRoom`, `GuesthouseBooking`
- [ ] Système de disponibilité par chambre (pas par unité entière)
- [ ] Pricing par chambre, par nuit
- [ ] Dashboard propriétaire de guesthouse

---

### 7. Channel Manager Hôtels (OTA)

**Statut :** ❌ 0%  
**Tâches :**

- [ ] Intégration Booking.com API
- [ ] Intégration Expedia Partner Solutions
- [ ] Synchronisation bi-directionnelle (dispo, prix, réservations)
- [ ] Gestion des conflits de réservation
- [ ] Yield management (prix dynamique)

---

### 8. Matching IA Artisans (ProMatch)

**Statut :** ❌ 0%  
**Tâches :**

- [ ] Algorithme de scoring (compétences, localisation, reviews, dispo)
- [ ] Module d'urgences 24/7
- [ ] Devis collaboratifs (plusieurs artisans sur un chantier)
- [ ] Suivi de chantier (photos, avancement, paiements jalonnés)

---

### 9. KYC AI (Validation automatique)

**Statut :** ⚠️ 30%  
**Tâches :**

- [ ] OCR automatique des documents (CNI, passeport, factures)
- [ ] Validation de cohérence (nom, adresse, date)
- [ ] Détection de falsification (analyse d'image)
- [ ] Intégration Smile Identity (biométrie + listes sanctions)

---

### 10. Certificats PDF (Academy)

**Statut :** ⚠️ 40%  
**Tâches :**

- [ ] Génération de PDF avec QR code de vérification
- [ ] Template de certificat (design AfriBayit)
- [ ] Endpoint de vérification publique (`/verify/:certificateId`)
- [ ] Partage LinkedIn automatique

---

## Priorité P2 — Secondaire (Phase 2)

### 11. Programme Ambassadeurs

- [ ] Niveaux Bronze/Silver/Gold
- [ ] Système de parrainage avec codes uniques
- [ ] Commissions sur transactions (5%/3%/1%)
- [ ] Dashboard ambassadeur (suivi gains, filleuls)

---

### 12. Visites VR 360°

- [ ] Intégration Matterport SDK
- [ ] Support WebXR (casques VR)
- [ ] Upload et traitement des scans 360°
- [ ] Navigation fluide dans les propriétés

---

### 13. Prédiction de Prix (ML)

- [ ] Collecte de données historiques
- [ ] Entraînement modèle AVM (Automated Valuation Model)
- [ ] API de prédiction (`POST /api/v1/properties/estimate`)
- [ ] Affichage "Prix estimé" sur les fiches propriétés

---

### 14. App Mobile React Native

- [ ] Setup du projet (Expo ou CLI)
- [ ] Navigation, auth, profil
- [ ] Recherche de propriétés
- [ ] Notifications push
- [ ] Géolocalisation et maps

---

### 15. Ancrage On-Chain (Polygon)

- [ ] Smart contract pour ancrage de hash
- [ ] Service d'écriture sur Polygon (après signature notaire)
- [ ] Endpoint de vérification (`GET /api/v1/verify/:deedHash`)
- [ ] Certificat d'ancrage (PDF avec txHash)

---

## Jalons de Développement

### Sprint 0 — Fondation (1 semaine)

- [ ] Setup environnement de dev
- [ ] Docker Compose opérationnel
- [ ] CI/CD GitHub Actions → Vercel + Fly.io

### Sprint 1 — Notaires (2 semaines)

- [ ] Schema Prisma mis à jour
- [ ] API notaires implémentée
- [ ] Dashboard notaire (frontend)

### Sprint 2 — Premium Agent (2 semaines)

- [ ] Système d'abonnement
- [ ] Algorithme de boost
- [ ] Dashboard agent premium

### Sprint 3 — Notifications (1 semaine)

- [ ] Cloche de notifications
- [ ] Préférences par canal
- [ ] Flux WebSocket temps réel

### Sprint 4 — Multi-tenancy (2 semaines)

- [ ] Middleware de détection de pays
- [ ] Règles métier par tenant
- [ ] SEO multi-tenant

### Sprint 5 — Rebecca IA (2 semaines)

- [ ] Intégration modèle de langage
- [ ] Base de connaissances
- [ ] Widget de chat

---

## Suivi de Progress

| Module          | Priorité | Début | Fin | Statut |
| --------------- | -------- | ----- | --- | ------ |
| Notaires        | P0       | —     | —   | ❌     |
| Premium Agent   | P0       | —     | —   | ❌     |
| Notifications   | P0       | —     | —   | ⚠️     |
| Multi-tenancy   | P0       | —     | —   | ⚠️     |
| Rebecca IA      | P0       | —     | —   | ❌     |
| Guesthouses     | P1       | —     | —   | ⚠️     |
| Channel Manager | P1       | —     | —   | ❌     |
| Matching IA     | P1       | —     | —   | ❌     |
| KYC AI          | P1       | —     | —   | ⚠️     |
| Certificats PDF | P1       | —     | —   | ⚠️     |

---

## Métriques de Succès (Phase 1)

- [ ] 100% des tâches P0 complétées
- [ ] Temps de réponse API < 200ms (p95)
- [ ] Score Lighthouse > 90 (Performance, SEO, Accessibility)
- [ ] 0 bug critique en production
- [ ] Couverture de tests > 80%

---

_Dernière mise à jour : 2026-04-27_
