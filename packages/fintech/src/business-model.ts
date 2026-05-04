/**
 * Section 11 — Business Model & Pricing Engine
 * Commission grid + Subscription plans + Phase pricing strategy.
 */

// ─── 11.2.1 Commission Grid ─────────────────────────────────────────────────
export interface CommissionRate {
  type: string;
  rate: number; // Percentage
  fixedAmount?: number; // If applicable (e.g., 1 month rent)
  mode: 'DEDUCTED_ESCROW' | 'ADDED_PRE' | 'PMS_AUTO';
  condition: string;
}

export const COMMISSION_GRID: CommissionRate[] = [
  { type: 'SALE_UNDER_50M', rate: 3, mode: 'DEDUCTED_ESCROW', condition: 'Escrow obligatoire' },
  {
    type: 'SALE_OVER_50M',
    rate: 2,
    mode: 'DEDUCTED_ESCROW',
    condition: 'Escrow + GeoTrust recommandé',
  },
  {
    type: 'RENT_LONG',
    rate: 0,
    fixedAmount: 1,
    mode: 'DEDUCTED_ESCROW',
    condition: '1 mois loyer partagé 50/50',
  },
  { type: 'LCD_HOST', rate: 3, mode: 'DEDUCTED_ESCROW', condition: 'Libération après check-in' },
  { type: 'LCD_GUEST', rate: 11, mode: 'ADDED_PRE', condition: 'Non négociable, 10-12%' },
  { type: 'GUESTHOUSE_HOST', rate: 3, mode: 'PMS_AUTO', condition: 'Guesthouse activé' },
  { type: 'GUESTHOUSE_GUEST', rate: 11.5, mode: 'ADDED_PRE', condition: 'Non négociable, 10-13%' },
];

// ─── 11.2.2 Subscription Plans ──────────────────────────────────────────────
export interface SubscriptionPlan {
  id: string;
  name: string;
  target: string;
  priceXOF: number;
  priceEUR: number;
  features: string[];
  billingCycle: 'MONTHLY' | 'ANNUAL';
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'HELM_SEED',
    name: 'HELM SEED Agent',
    target: 'Agent indépendant débutant',
    priceXOF: 15000,
    priceEUR: 23,
    features: ['10 annonces boost/mois', 'Statistiques basiques', 'Badge certifié'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'HELM_GROW',
    name: 'HELM GROW Agent',
    target: 'Agent établi 1-3 ans',
    priceXOF: 35000,
    priceEUR: 53,
    features: ['30 annonces boost', 'CRM basique', 'Rebecca Pro', 'Analytics avancés'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'HELM_LEAD',
    name: 'HELM LEAD Agent',
    target: "Top agent / chef d'agence",
    priceXOF: 75000,
    priceEUR: 114,
    features: ['Boost illimité', 'API annonces', 'CRM complet', 'Support dédié', 'Co-branding'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'HELM_NETWORK',
    name: 'HELM NETWORK Agence',
    target: 'Agence multi-agents',
    priceXOF: 150000,
    priceEUR: 229,
    features: ['Multi-utilisateurs', 'Tableau de bord agence', 'Intégration ERP'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'PMS_STARTER',
    name: 'PMS Hôtelier STARTER',
    target: 'Petits hôtels < 10 chambres',
    priceXOF: 9900,
    priceEUR: 15,
    features: ['PMS complet', '1 canal OTA', 'Support WhatsApp'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'PMS_PRO',
    name: 'PMS Hôtelier PRO',
    target: 'Hôtels 10-50 chambres',
    priceXOF: 24900,
    priceEUR: 38,
    features: ['PMS complet', '3 canaux OTA', 'Channel Manager', 'Analytics yield'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'PMS_ENTERPRISE',
    name: 'PMS Hôtelier ENTERPRISE',
    target: 'Groupes hôteliers',
    priceXOF: 0,
    priceEUR: 0, // Sur devis
    features: ['Multi-établissements', 'API', 'Manager dédié', 'SLA garanti'],
    billingCycle: 'MONTHLY',
  },
  {
    id: 'ARTISAN_PRO',
    name: 'Artisan Pro',
    target: 'Artisan certifié',
    priceXOF: 8900,
    priceEUR: 14,
    features: ['Profil premium', '5 devis boost/mois', 'Badge Pro', 'ProMatch prioritaire'],
    billingCycle: 'MONTHLY',
  },
];

// ─── 11.3 Financial Projections ──────────────────────────────────────────────
export const FINANCIAL_PROJECTIONS = [
  { year: 1, users: 12000, volume: '12M€', revenue: '950K€', ebitda: '−180K€' },
  { year: 2, users: 65000, volume: '55M€', revenue: '4.2M€', ebitda: '1.4M€' },
  { year: 3, users: 250000, volume: '180M€', revenue: '15M€', ebitda: '6.5M€' },
  { year: 4, users: 600000, volume: '400M€', revenue: '33M€', ebitda: '17M€' },
  { year: 5, users: 1400000, volume: '900M€', revenue: '72M€', ebitda: '40M€' },
  { year: 6, users: 2800000, volume: '1.6Md€', revenue: '130M€', ebitda: '75M€' },
  { year: 7, users: 5500000, volume: '3.2Md€', revenue: '215M€', ebitda: '128M€' },
];

// ─── 11.4 Pricing Strategy by Phase ─────────────────────────────────────────
export const PRICING_PHASES = [
  {
    phase: 0,
    name: 'Fondateurs',
    months: '1-3',
    saleRate: 0,
    lcdRate: 0,
    hotelRate: 0,
    subDiscount: 100,
    goal: 'Masse critique 500 agents + 50 hôtels',
  },
  {
    phase: 1,
    name: 'Acquisition',
    months: '3-9',
    saleRate: 1,
    lcdRate: 8,
    hotelRate: 10,
    subDiscount: 50,
    goal: '10K utilisateurs, 1K propriétés',
  },
  {
    phase: 2,
    name: 'Croissance',
    months: '9-18',
    saleRate: 2,
    lcdRate: 12,
    hotelRate: 12,
    subDiscount: 0,
    goal: '50K utilisateurs, 8 pays',
  },
  {
    phase: 3,
    name: 'Maturité',
    months: '18-36',
    saleRate: 3,
    lcdRate: 15,
    hotelRate: 15,
    subDiscount: 0,
    goal: '200K+ utilisateurs, leader régional',
  },
];
