'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Heart, CreditCard, Eye, Loader2 } from 'lucide-react';
import { Card, CardTitle, Badge, PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { api } from '@/lib/api';

interface ApiMineProperty {
  id: string;
  status: string;
}

interface FavoriteRecord {
  id: string;
  property: {
    id: string;
    slug: string;
    title: string;
    city: string;
    country: string;
    price: unknown;
    currency: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    surface?: number | null;
    purpose: string;
    type: string;
    isVerified: boolean;
    isFeatured: boolean;
    images: Array<{ url: string; isPrimary?: boolean }>;
  };
}

interface ApiTransaction {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  status: string;
  buyerId: string;
  createdAt: string;
  property: { title: string; slug: string } | null;
  buyer: { firstName: string; lastName: string };
  seller: { firstName: string; lastName: string };
}

interface ApiUser {
  reputationScore: number;
}

function toCardData(fav: FavoriteRecord): PropertyCardData {
  const p = fav.property;
  const primaryImage = p.images.find((img) => img.isPrimary) ?? p.images[0];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    city: p.city,
    country: p.country,
    price: Number(p.price),
    currency: p.currency,
    ...(p.bedrooms ? { bedrooms: p.bedrooms } : {}),
    ...(p.bathrooms ? { bathrooms: p.bathrooms } : {}),
    ...(p.surface ? { surface: p.surface } : {}),
    purpose: p.purpose as PropertyCardData['purpose'],
    type: p.type,
    imageUrl: primaryImage?.url ?? '',
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
  };
}

function formatAmount(amount: number, currency: string): string {
  if (currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} M FCFA`;
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

const STATUS_LABELS: Record<string, string> = {
  INITIATED: 'Initié',
  FUNDED: 'En escrow',
  VALIDATED: 'Validé',
  RELEASED: 'Libéré',
  COMPLETED: 'Terminé',
  DISPUTED: 'En litige',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
};

const STATUS_VARIANTS: Record<string, 'default' | 'sky' | 'gold' | 'success' | 'danger'> = {
  INITIATED: 'default',
  FUNDED: 'sky',
  VALIDATED: 'gold',
  RELEASED: 'success',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  CANCELLED: 'danger',
  REFUNDED: 'danger',
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
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const userId = (session?.user as { id?: string } | undefined)?.id ?? null;
  const firstName = session?.user?.name ?? '';

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ annonces: 0, favoris: 0, transactions: 0, reputation: 0 });
  const [recentTxs, setRecentTxs] = useState<ApiTransaction[]>([]);
  const [recentFavs, setRecentFavs] = useState<PropertyCardData[]>([]);
  const [escrow, setEscrow] = useState<{
    total: number;
    currency: string;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.all([
      api.properties.findMine(token),
      api.users.getFavorites(token),
      api.transactions.findAll(token),
      api.users.me(token),
    ])
      .then(([annoncesRes, favRes, txRes, userRes]) => {
        const annonces = annoncesRes.data as ApiMineProperty[];
        const favs = favRes.data as FavoriteRecord[];
        const txs = txRes.data as ApiTransaction[];
        const user = userRes.data as ApiUser;

        const activeAnnonces = annonces.filter((p) => p.status !== 'ARCHIVED');
        const activeTxs = txs.filter((tx) => !['CANCELLED', 'COMPLETED'].includes(tx.status));

        setStats({
          annonces: activeAnnonces.length,
          favoris: favs.length,
          transactions: activeTxs.length,
          reputation: user.reputationScore ?? 0,
        });

        // Escrow balance — buyer's funded/validated transactions
        const fundedTxs = txs.filter(
          (tx) => tx.buyerId === userId && ['FUNDED', 'VALIDATED'].includes(tx.status),
        );
        if (fundedTxs.length > 0) {
          const total = fundedTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
          setEscrow({ total, currency: fundedTxs[0]!.currency, count: fundedTxs.length });
        }

        // Recent transactions (last 3)
        const sorted = [...txs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRecentTxs(sorted.slice(0, 3));

        // Recent favorites (first 3)
        setRecentFavs(favs.slice(0, 3).map(toCardData));
      })
      .catch(() => {
        // keep zeroed defaults
      })
      .finally(() => setLoading(false));
  }, [token, userId]);

  const statsCards = [
    {
      label: 'Mes annonces',
      value: stats.annonces,
      icon: Eye,
      color: 'text-navy',
      bg: 'bg-navy/10',
    },
    {
      label: 'Favoris',
      value: stats.favoris,
      icon: Heart,
      color: 'text-danger',
      bg: 'bg-danger/10',
    },
    {
      label: 'Transactions',
      value: stats.transactions,
      icon: CreditCard,
      color: 'text-emerald-600',
      bg: 'bg-emerald/10',
    },
    {
      label: 'Score réputation',
      value: stats.reputation > 0 ? stats.reputation.toFixed(1) : '—',
      icon: TrendingUp,
      color: 'text-gold-600',
      bg: 'bg-gold/10',
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="text-navy h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h1 className="text-charcoal font-serif text-2xl font-bold sm:text-3xl">
          Bonjour{firstName ? `, ${firstName}` : ''} 👋
        </h1>
        <p className="text-charcoal-400 mt-1">Voici un aperçu de votre activité.</p>
      </div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Card hoverable className="flex flex-col gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} aria-hidden="true" />
                </div>
                <p className="text-charcoal font-mono text-2xl font-bold">{stat.value}</p>
                <p className="text-charcoal-400 text-xs">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Wallet / Escrow card — only shown when buyer has funded transactions */}
      {escrow && (
        <motion.div
          className="from-navy to-navy/80 rounded-xl bg-gradient-to-r p-6 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="mb-1 text-sm text-white/70">Solde en escrow</p>
          <p className="font-mono text-3xl font-bold">
            {formatAmount(escrow.total, escrow.currency)}
          </p>
          <p className="mt-1 text-xs text-white/50">
            {escrow.count} transaction{escrow.count > 1 ? 's' : ''} en attente de validation
          </p>
          <div className="mt-4 flex gap-2">
            <Link
              href={'/dashboard/transactions' as Route}
              className="rounded-pill bg-white/20 px-4 py-1.5 text-sm font-medium transition-colors hover:bg-white/30"
            >
              Voir détails
            </Link>
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent transactions */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Transactions récentes</CardTitle>
            <Link
              href={'/dashboard/transactions' as Route}
              className="text-navy text-xs hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {recentTxs.length > 0 ? (
            <div className="space-y-3">
              {recentTxs.map((tx) => (
                <div
                  key={tx.id}
                  className="border-charcoal-50 flex items-center justify-between border-b py-2 last:border-0"
                >
                  <div>
                    <p className="text-charcoal max-w-[180px] truncate text-sm font-medium">
                      {tx.property?.title ?? `${tx.buyer.firstName} → ${tx.seller.firstName}`}
                    </p>
                    <p className="text-charcoal-400 font-mono text-xs">{tx.reference}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-charcoal font-mono text-sm font-semibold">
                      {formatAmount(Number(tx.amount), tx.currency)}
                    </p>
                    <Badge variant={STATUS_VARIANTS[tx.status] ?? 'default'}>
                      {STATUS_LABELS[tx.status] ?? tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-charcoal-400 py-6 text-center text-sm">Aucune transaction.</p>
          )}
        </Card>

        {/* Recent favorites */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <CardTitle>Favoris récents</CardTitle>
            <Link
              href={'/dashboard/favoris' as Route}
              className="text-navy text-xs hover:underline"
            >
              Voir tout
            </Link>
          </div>
          {recentFavs.length > 0 ? (
            <div className="space-y-3">
              {recentFavs.map((property) => (
                <Link
                  key={property.id}
                  href={`/proprietes/${property.slug}` as Route}
                  className="block"
                >
                  <PropertyCard property={property} compact />
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <p className="text-charcoal-400 text-sm">Aucun favori pour l&apos;instant.</p>
              <Link href={'/recherche' as Route} className="text-navy text-xs hover:underline">
                Explorer les propriétés →
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
