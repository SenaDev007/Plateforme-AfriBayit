/**
 * Section 12 — Roadmap Détaillée — Plan de Développement par Sprints & Jalons
 * Configuration programmatique pour le dashboard admin et le suivi de progression.
 */

export type SprintStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PLANNED' | 'BLOCKED';

export interface Sprint {
  id: string;
  name: string;
  weeks: string;
  deliverables: string[];
  exitCriteria: string;
  status: SprintStatus;
}

export interface Phase {
  id: number;
  name: string;
  duration: string;
  sprints: Sprint[];
  goNoGoCriteria: string[];
}

// ─── Phase 0 — Fondations Techniques (Semaines 1-6) ─────────────────────────
const PHASE_0: Phase = {
  id: 0,
  name: 'Fondations Techniques',
  duration: 'Semaines 1-6',
  sprints: [
    {
      id: 'S0-1',
      name: 'Monorepo & CI/CD',
      weeks: '1-2',
      deliverables: [
        'Turborepo init',
        'Next.js 15 + NestJS 11',
        'Prisma DB',
        'GitHub Actions',
        'Vercel + Fly.io',
      ],
      exitCriteria: 'Pipeline vert — deploy auto sur push main',
      status: 'COMPLETED',
    },
    {
      id: 'S0-2',
      name: 'Auth & Multitenancy',
      weeks: '3-4',
      deliverables: [
        'NextAuth v5',
        'OAuth2 Google/Facebook/Apple',
        'Middleware tenant',
        'RLS schemas pays',
        'RBAC 6 rôles',
      ],
      exitCriteria: 'Login fonctionnel sur bj.afribayit.com et ci.afribayit.com',
      status: 'COMPLETED',
    },
    {
      id: 'S0-3',
      name: 'Design System & PAL',
      weeks: '5-6',
      deliverables: [
        'Tailwind design system',
        'PAL interfaces',
        'FedaPay + Stripe sandbox',
        'WebhookNormalizer',
        'Ledger schema',
      ],
      exitCriteria: 'Paiement test 100 FCFA bout en bout sandbox',
      status: 'COMPLETED',
    },
  ],
  goNoGoCriteria: [
    'Pipeline CI/CD vert',
    'Auth multi-tenant fonctionnel',
    'Paiement sandbox opérationnel',
  ],
};

// ─── Phase 1 — MVP+ (Semaines 7-24) ────────────────────────────────────────
const PHASE_1: Phase = {
  id: 1,
  name: 'MVP+',
  duration: 'Semaines 7-24 (Mois 2-6)',
  sprints: [
    {
      id: 'S1-1',
      name: 'Publication annonce',
      weeks: '7-8',
      deliverables: [
        'Formulaire multi-étapes',
        'Upload R2',
        'Géolocalisation Mapbox',
        'Catégorisation type',
      ],
      exitCriteria: 'Publication < 10 minutes',
      status: 'COMPLETED',
    },
    {
      id: 'S1-2',
      name: 'Recherche & filtres',
      weeks: '9-10',
      deliverables: [
        'Full-text Elasticsearch',
        'Filtres avancés',
        'Carte interactive',
        'Clustering markers',
      ],
      exitCriteria: 'Recherche < 1.5s P95',
      status: 'COMPLETED',
    },
    {
      id: 'S1-3',
      name: 'Fiche propriété',
      weeks: '11-12',
      deliverables: ['Fiche complète', 'Favoris', 'Messagerie basique', 'Partage social'],
      exitCriteria: 'NPS > 35',
      status: 'COMPLETED',
    },
    {
      id: 'S1-4',
      name: 'KYC & modération',
      weeks: '13-14',
      deliverables: [
        'KYC CNI + selfie IA',
        'Validation doc IA',
        'Workflow publication',
        'Dashboard propriétaire',
      ],
      exitCriteria: 'Faux positifs IA < 15%',
      status: 'COMPLETED',
    },
    {
      id: 'S1-5',
      name: 'Escrow & FedaPay',
      weeks: '15-16',
      deliverables: [
        'State machine escrow',
        'FedaPay Mobile Money prod',
        'Ledger interne',
        'Webhooks normalisés',
      ],
      exitCriteria: 'Transaction e2e 10K FCFA',
      status: 'COMPLETED',
    },
    {
      id: 'S1-6',
      name: 'Stripe & cross-provider',
      weeks: '17-18',
      deliverables: [
        'Stripe cartes intl',
        'Cross-provider EUR→XOF',
        '2FA libération',
        'Logs Ledger',
      ],
      exitCriteria: 'Test cross-provider EUR→XOF',
      status: 'COMPLETED',
    },
    {
      id: 'S1-7',
      name: 'Payout & litiges',
      weeks: '19-20',
      deliverables: ['Payout MoMo auto', 'Gestion litiges', 'Notifs multi-canal'],
      exitCriteria: 'Payout < 2h MTN/Orange',
      status: 'COMPLETED',
    },
    {
      id: 'S1-8',
      name: 'LCD module',
      weeks: '21-22',
      deliverables: ['LCD complet', 'Calendrier dispo', 'Check-in QR', 'Avis', 'Escrow LCD'],
      exitCriteria: '50 réservations test',
      status: 'COMPLETED',
    },
    {
      id: 'S1-9',
      name: 'App mobile',
      weeks: '23-24',
      deliverables: ['React Native iOS/Android', 'Expo EAS', 'Push notifs', 'Auth biométrique'],
      exitCriteria: 'Crash rate < 1%',
      status: 'PLANNED',
    },
  ],
  goNoGoCriteria: [
    '500 annonces actives minimum bj.afribayit.com',
    '50 transactions escrow complétées sans incident',
    'Crash rate app < 0.5%',
    'Délai payout < 4h sur 95%',
    'NPS ≥ 40',
    'Aucune donnée KYC compromise',
  ],
};

// ─── Phase 2 — Écosystème Complet (Mois 7-18) ──────────────────────────────
const PHASE_2: Phase = {
  id: 2,
  name: 'Écosystème Complet',
  duration: 'Mois 7-18',
  sprints: [
    {
      id: 'S2-ARTISAN',
      name: 'Artisans ProMatch',
      weeks: 'M7-8',
      deliverables: [
        'Annuaire artisans',
        'Matching IA',
        'Devis en ligne',
        'Escrow artisan',
        'Avis vérifiés',
      ],
      exitCriteria: '100 artisans — 50 missions/mois',
      status: 'COMPLETED',
    },
    {
      id: 'S2-REBECCA',
      name: 'Rebecca V1',
      weeks: 'M8-9',
      deliverables: ['Agent IA RAG', 'Function calling', 'Mémoire session', 'WhatsApp Business'],
      exitCriteria: 'Résolution sans escalade > 60%',
      status: 'COMPLETED',
    },
    {
      id: 'S2-ACADEMY',
      name: 'Academy',
      weeks: 'M9-10',
      deliverables: ['LMS', 'Upload vidéo', 'Quiz', 'Certificat PDF', '20 cours pilotes'],
      exitCriteria: '50 cours — 500 apprenants',
      status: 'COMPLETED',
    },
    {
      id: 'S2-GEOTRUST',
      name: 'GeoTrust V1',
      weeks: 'M10-11',
      deliverables: [
        'Profils géomètres',
        'Workflow mission',
        'Rapport structuré',
        'Badge terrain vérifié',
      ],
      exitCriteria: '30 géomètres — 100 missions/mois',
      status: 'COMPLETED',
    },
    {
      id: 'S2-COMMUNITY',
      name: 'Communauté',
      weeks: 'M11-12',
      deliverables: ['Forums par pays', 'Groupes investisseurs', 'Réputation', 'Modération IA'],
      exitCriteria: '5K posts/mois — 0 incident majeur',
      status: 'COMPLETED',
    },
    {
      id: 'S2-HOSPITALITY',
      name: 'Hospitality V1',
      weeks: 'M12-14',
      deliverables: [
        'PMS hôtelier',
        'Onboarding hôtels',
        'Réservation directe',
        'Channel Manager Booking',
      ],
      exitCriteria: '200 hôtels — 1K réservations/mois',
      status: 'COMPLETED',
    },
    {
      id: 'S2-OTA',
      name: 'OTA API Booking.com',
      weeks: 'M13-15',
      deliverables: [
        'Certification Demand API',
        'Agrégation inventaire',
        'Déduplication',
        'Workflow réservation OTA',
      ],
      exitCriteria: 'Go-live Booking — 50 réservations/mois',
      status: 'PLANNED',
    },
    {
      id: 'S2-EXPANSION',
      name: 'Expansion CI+BF+TG',
      weeks: 'M14-18',
      deliverables: ['Tenants CI/BF/TG', 'Adaptation réglementaire', 'Équipes pays'],
      exitCriteria: '200K utilisateurs — 4 pays actifs',
      status: 'PLANNED',
    },
  ],
  goNoGoCriteria: [
    '200K utilisateurs actifs mensuels',
    '5 000 propriétés actives',
    '1 000 artisans certifiés',
    '500 hôtels actifs',
    'Rebecca NPS > 55',
    'Volume escrow > 5M€/mois',
    'Certification sécurité obtenue',
  ],
};

// ─── Phase 3 — Leadership & Innovation (Mois 19-36) ────────────────────────
const PHASE_3: Phase = {
  id: 3,
  name: 'Leadership & Innovation',
  duration: 'Mois 19-36',
  sprints: [
    {
      id: 'S3-EXPANSION8',
      name: 'Expansion 8 pays',
      weeks: 'M19-24',
      deliverables: ['Ghana, Nigeria, Sénégal, Mali, Niger, Cameroun, Kenya, Rwanda'],
      exitCriteria: '500K utilisateurs',
      status: 'PLANNED',
    },
    {
      id: 'S3-API',
      name: 'API publiques',
      weeks: 'M20-24',
      deliverables: [
        'API PAL public',
        'API GeoSpatiale',
        'API Hospitality',
        'Portail développeurs',
        'SDK JS/Python',
      ],
      exitCriteria: '50 partenaires intégrés',
      status: 'PLANNED',
    },
    {
      id: 'S3-REBECCA2',
      name: 'Rebecca V2 Multilingue',
      weeks: 'M22-26',
      deliverables: [
        'Fine-tuning AfriBayit',
        '8 langues africaines',
        'Mémoire long terme',
        'VA proactif relance',
      ],
      exitCriteria: 'Taux conversion +15%',
      status: 'PLANNED',
    },
    {
      id: 'S3-SMART',
      name: 'Smart contracts (Polygon)',
      weeks: 'M24-30',
      deliverables: ['GeoTrust on-chain', 'Escrow smart contract partiel', 'Audit sécurité SC'],
      exitCriteria: 'Libération escrow < 30s',
      status: 'PLANNED',
    },
    {
      id: 'S3-TOKEN',
      name: 'Tokenisation (si agrément)',
      weeks: 'M28-36',
      deliverables: ['Dossier CREPMF', 'Investissement fractionné', 'Tickets 100K FCFA'],
      exitCriteria: 'Agrément CREPMF obtenu',
      status: 'PLANNED',
    },
    {
      id: 'S3-IPO',
      name: 'Préparation Series A / IPO',
      weeks: 'M30-36',
      deliverables: ['Audit financier', 'Data room', 'Métriques IPO-ready', 'Roadshow'],
      exitCriteria: 'Valorisation > 500M€',
      status: 'PLANNED',
    },
  ],
  goNoGoCriteria: [
    '1M+ utilisateurs',
    '12+ pays actifs',
    'Profitabilité confirmée',
    'Audit sécurité clean',
  ],
};

// ─── Section 12.5 — Critical Dependencies ───────────────────────────────────
export const CRITICAL_DEPENDENCIES = [
  {
    risk: 'Certification Booking.com',
    action: 'Initier candidature semaine 4',
    owner: 'CTO + CMO',
    deadline: '4-6 mois',
  },
  {
    risk: 'Agrément BCEAO / EME',
    action: 'Signature partenaire EME (Ecobank, Orange, Wave)',
    owner: 'CEO + Legal',
    deadline: '2-4 mois',
  },
  {
    risk: 'Recrutement géomètres',
    action: 'Protocole ONGE par pays',
    owner: 'COO pays',
    deadline: 'Phase 1',
  },
  {
    risk: 'Infrastructure Elasticsearch',
    action: 'Provisioning + indexation 10K annonces',
    owner: 'DevOps',
    deadline: '2 semaines',
  },
  {
    risk: 'App Store / Play Store',
    action: 'Comptes dev Apple ($99) + Google ($25)',
    owner: 'CTO Mobile',
    deadline: 'Phase 0',
  },
  {
    risk: 'Agrément CREPMF tokenisation',
    action: 'Dossier 12-24 mois traitement',
    owner: 'Legal Officer',
    deadline: 'Phase 2 début',
  },
];

/** Full roadmap export */
export const AFRIBAYIT_ROADMAP = {
  phases: [PHASE_0, PHASE_1, PHASE_2, PHASE_3],
  dependencies: CRITICAL_DEPENDENCIES,
  totalSprints:
    PHASE_0.sprints.length +
    PHASE_1.sprints.length +
    PHASE_2.sprints.length +
    PHASE_3.sprints.length,
};
