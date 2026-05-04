'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Heart,
  CreditCard,
  Eye,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Clock,
  MapPin,
  Search,
  MessageSquare,
} from 'lucide-react';
import { Card, Badge, PropertyCard, Button } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { api } from '@/lib/api';
import { cn } from '@afribayit/ui/src/lib/cn';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Fév', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Avr', value: 800 },
  { name: 'Mai', value: 500 },
  { name: 'Juin', value: 900 },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
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

        const fundedTxs = txs.filter(
          (tx) => tx.buyerId === userId && ['FUNDED', 'VALIDATED'].includes(tx.status),
        );
        if (fundedTxs.length > 0) {
          const total = fundedTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
          setEscrow({ total, currency: fundedTxs[0]!.currency, count: fundedTxs.length });
        }

        const sorted = [...txs].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setRecentTxs(sorted.slice(0, 5));
        setRecentFavs(favs.slice(0, 3).map(toCardData));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, userId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="text-navy h-10 w-10 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      className="flex flex-col gap-10"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col justify-between gap-6 md:flex-row md:items-end"
      >
        <div>
          <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            Centre de Commandes
          </p>
          <h1 className="text-charcoal font-serif text-3xl font-bold leading-tight md:text-5xl">
            Ravi de vous revoir,
            <br />
            <span className="text-navy italic">{firstName || 'Propriétaire'}</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-charcoal-200 h-14 rounded-full px-8 text-xs font-bold uppercase tracking-widest"
          >
            GÉRER MON PROFIL
          </Button>
          {session?.user?.role === 'BUYER' && (
            <Button className="bg-gold shadow-gold/20 h-14 rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
              CALCULATEUR ROI
            </Button>
          )}
          {(session?.user?.role === 'SELLER' || session?.user?.role === 'GUESTHOUSE_OWNER') && (
            <Button className="bg-navy shadow-navy/20 h-14 rounded-full px-8 text-xs font-bold uppercase tracking-widest shadow-lg">
              NOUVELLE ANNONCE
            </Button>
          )}
          {session?.user?.role === 'ARTISAN' && (
            <Button className="bg-emerald shadow-emerald/20 h-14 rounded-full px-8 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
              PUBLIER RÉALISATION
            </Button>
          )}
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        variants={itemVariants}
      >
        {[
          { label: 'Annonces Actives', value: stats.annonces, icon: Eye, color: 'navy' },
          { label: 'Biens en Favoris', value: stats.favoris, icon: Heart, color: 'gold' },
          { label: 'Transactions', value: stats.transactions, icon: CreditCard, color: 'navy' },
          {
            label: 'Score de Confiance',
            value: stats.reputation.toFixed(1),
            icon: ShieldCheck,
            color: 'gold',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="border-charcoal-100 group rounded-[32px] border bg-white p-8 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
          >
            <div
              className={cn(
                'mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6',
                stat.color === 'navy' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold',
              )}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-charcoal mb-1 font-serif text-4xl font-bold">{stat.value}</p>
            <p className="text-charcoal-400 text-[11px] font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Analytics Section — Section 3.1.1 */}
      <motion.div
        variants={itemVariants}
        className="border-charcoal-100 rounded-[40px] border bg-white p-8 shadow-sm"
      >
        <h3 className="text-charcoal mb-8 font-serif text-2xl font-bold">Performance de l'Actif</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F4" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#666' }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#003087"
                strokeWidth={4}
                dot={{ r: 6, fill: '#003087', strokeWidth: 0 }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main Activity Feed (2/3) */}
        <motion.div className="space-y-8 lg:col-span-2" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h2 className="text-charcoal font-serif text-2xl font-bold">Activités Récentes</h2>
            <Link
              href="/dashboard/transactions"
              className="text-navy hover:text-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
            >
              VOIR L'HISTORIQUE COMPLET
            </Link>
          </div>

          <div className="border-charcoal-100 overflow-hidden rounded-[40px] border bg-white shadow-sm">
            {recentTxs.length > 0 ? (
              <div className="divide-charcoal-50 divide-y">
                {recentTxs.map((tx) => (
                  <div
                    key={tx.id}
                    className="hover:bg-charcoal-50/50 flex flex-col items-start justify-between gap-6 p-8 transition-colors md:flex-row md:items-center"
                  >
                    <div className="flex items-center gap-6">
                      <div className="bg-charcoal-50 text-navy flex h-16 w-16 items-center justify-center rounded-3xl shadow-inner">
                        {tx.property ? (
                          <Building2 className="h-7 w-7" />
                        ) : (
                          <CreditCard className="h-7 w-7" />
                        )}
                      </div>
                      <div>
                        <p className="text-charcoal mb-1 text-base font-bold leading-tight">
                          {tx.property?.title || `Transaction ${tx.reference}`}
                        </p>
                        <div className="text-charcoal-400 flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />{' '}
                            {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" />{' '}
                            {tx.property?.slug ? 'Immobilier' : 'Service'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex w-full flex-col items-end gap-3 md:w-auto">
                      <p className="text-navy font-serif text-xl font-bold">
                        {formatAmount(Number(tx.amount), tx.currency)}
                      </p>
                      <Badge
                        variant={STATUS_VARIANTS[tx.status] ?? 'default'}
                        className="px-4 py-1 text-[9px] font-bold uppercase tracking-widest"
                      >
                        {STATUS_LABELS[tx.status] ?? tx.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 p-20 text-center">
                <div className="bg-charcoal-50 text-charcoal-200 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
                  <CreditCard className="h-10 w-10" />
                </div>
                <p className="text-charcoal-400 font-medium">
                  Aucune activité transactionnelle récente.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar Stats (1/3) */}
        <motion.div className="space-y-8" variants={itemVariants}>
          {/* Escrow Card */}
          {escrow ? (
            <div className="bg-navy shadow-navy/20 relative overflow-hidden rounded-[40px] p-10 text-white shadow-2xl">
              <div className="bg-gold/10 absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
              <p className="text-gold mb-8 text-[10px] font-bold uppercase tracking-[0.3em]">
                Sécurisé par Escrow
              </p>
              <p className="mb-2 font-serif text-5xl font-bold tracking-tight">
                {formatAmount(escrow.total, escrow.currency).split(' ')[0]}
                <span className="ml-2 font-sans text-xl font-medium opacity-40">
                  {escrow.currency}
                </span>
              </p>
              <p className="mb-8 text-xs font-medium leading-relaxed text-white/40">
                Fonds sécurisés pour {escrow.count} transaction{escrow.count > 1 ? 's' : ''} en
                cours.
              </p>
              <Button
                variant="gold"
                className="h-14 w-full rounded-2xl text-xs font-bold uppercase tracking-widest"
              >
                GÉRER MES FONDS
              </Button>
            </div>
          ) : (
            <div className="border-charcoal-100 space-y-6 rounded-[40px] border bg-white p-10 text-center">
              <div className="bg-gold/10 text-gold mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-charcoal font-serif text-xl font-bold">
                Optimisez vos rendements
              </h3>
              <p className="text-charcoal-400 text-xs leading-relaxed">
                Commencez à investir ou louez vos biens pour voir vos statistiques évoluer ici.
              </p>
              <Button
                variant="outline"
                className="h-12 w-full rounded-2xl text-[10px] font-bold uppercase tracking-widest"
              >
                DÉCOUVRIR LES OPPORTUNITÉS
              </Button>
            </div>
          )}

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-charcoal px-4 font-serif text-xl font-bold">Actions Rapides</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Support', icon: MessageSquare, href: '/support' },
                { label: 'Recherche', icon: Search, href: '/recherche' },
              ].map((action, i) => (
                <Link
                  key={i}
                  href={action.href as Route}
                  className="border-charcoal-100 hover:border-navy group flex flex-col items-center gap-3 rounded-[24px] border bg-white p-6 transition-all hover:shadow-lg"
                >
                  <action.icon className="text-charcoal-400 group-hover:text-navy h-6 w-6 transition-colors" />
                  <span className="text-charcoal text-[10px] font-bold uppercase tracking-widest">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Favorites Preview */}
      {recentFavs.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-charcoal font-serif text-2xl font-bold">Coup de Cœur</h2>
            <Link
              href="/dashboard/favoris"
              className="text-navy text-[10px] font-bold uppercase tracking-widest"
            >
              VOIR TOUT
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentFavs.map((fav) => (
              <div key={fav.id} className="group relative">
                <PropertyCard property={fav} />
                <div className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl bg-white/90 shadow-lg backdrop-blur-md">
                    <ArrowUpRight className="text-navy h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

// Sub-component for Building2 which is not imported
function Building2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
