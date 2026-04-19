'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import { TrendingUp, Heart, CreditCard, Eye } from 'lucide-react';
import { Card, CardTitle, CardContent, Badge, PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';

const STATS = [
  { label: 'Mes annonces', value: '3', icon: Eye, color: 'text-navy', bg: 'bg-navy/10' },
  { label: 'Favoris', value: '12', icon: Heart, color: 'text-danger', bg: 'bg-danger/10' },
  { label: 'Transactions', value: '1', icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald/10' },
  { label: 'Score réputation', value: '4.8', icon: TrendingUp, color: 'text-gold-600', bg: 'bg-gold/10' },
];

const RECENT_TRANSACTIONS = [
  {
    id: 'tx1',
    reference: 'AFB-2024-001',
    title: 'Villa Les Cocotiers — Cotonou',
    amount: 85000000,
    currency: 'XOF',
    status: 'FUNDED' as const,
    date: '2024-12-20',
  },
];

const FAVORITE_PROPERTIES: PropertyCardData[] = [
  {
    id: '1',
    slug: 'villa-cocotiers-cotonou',
    title: 'Villa Les Cocotiers',
    city: 'Cotonou',
    country: 'Bénin',
    price: 85000000,
    currency: 'XOF',
    bedrooms: 4,
    bathrooms: 3,
    surface: 350,
    purpose: 'SALE',
    type: 'VILLA',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80',
    isVerified: true,
    isFeatured: true,
  },
];

const STATUS_LABELS: Record<string, string> = {
  INITIATED: 'Initié',
  FUNDED: 'Financé',
  VALIDATED: 'Validé',
  RELEASED: 'Libéré',
  COMPLETED: 'Terminé',
  DISPUTED: 'En litige',
  CANCELLED: 'Annulé',
};

const STATUS_VARIANTS: Record<string, 'default' | 'sky' | 'gold' | 'success' | 'danger'> = {
  INITIATED: 'default',
  FUNDED: 'sky',
  VALIDATED: 'gold',
  RELEASED: 'success',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  CANCELLED: 'danger',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function DashboardOverview(): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
          Bonjour, Aminata 👋
        </h1>
        <p className="text-charcoal-400 mt-1">Voici un aperçu de votre activité.</p>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card hoverable className="flex flex-col gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className="font-mono text-2xl font-bold text-charcoal">{stat.value}</p>
                <p className="text-xs text-charcoal-400">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Wallet card */}
      <motion.div
        className="rounded-xl bg-gradient-to-r from-navy to-navy-600 p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-sm text-white/70 mb-1">Solde escrow</p>
        <p className="font-mono text-3xl font-bold">85 000 000 FCFA</p>
        <p className="text-xs text-white/50 mt-1">En attente de validation — Transaction AFB-2024-001</p>
        <div className="flex gap-2 mt-4">
          <button className="rounded-pill bg-white/20 hover:bg-white/30 px-4 py-1.5 text-sm font-medium transition-colors">
            Voir détails
          </button>
          <button className="rounded-pill bg-gold text-navy px-4 py-1.5 text-sm font-medium hover:bg-gold-400 transition-colors">
            Libérer les fonds
          </button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Transactions récentes</CardTitle>
            <a href="/dashboard/transactions" className="text-xs text-navy hover:underline">Voir tout</a>
          </div>
          <div className="space-y-3">
            {RECENT_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-charcoal-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-charcoal truncate max-w-[180px]">{tx.title}</p>
                  <p className="text-xs text-charcoal-400 font-mono">{tx.reference}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <p className="font-mono text-sm font-semibold text-charcoal">
                    {(tx.amount / 1_000_000).toFixed(0)} M FCFA
                  </p>
                  <Badge variant={STATUS_VARIANTS[tx.status] ?? 'default'}>
                    {STATUS_LABELS[tx.status] ?? tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Favorites */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>Favoris récents</CardTitle>
            <a href="/dashboard/favoris" className="text-xs text-navy hover:underline">Voir tout</a>
          </div>
          <div className="space-y-3">
            {FAVORITE_PROPERTIES.map((property) => (
              <a key={property.id} href={`/proprietes/${property.slug}`} className="block">
                <PropertyCard property={property} compact />
              </a>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
