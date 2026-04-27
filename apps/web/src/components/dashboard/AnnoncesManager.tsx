'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  MoreVertical,
  TrendingUp,
  Building2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Badge, Button, cn } from '@afribayit/ui';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface ApiProperty {
  id: string;
  slug: string;
  title: string;
  type: string;
  purpose: string;
  price: string | number;
  currency: string;
  city: string;
  country: string;
  status: string;
  viewCount: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  _count?: { favorites: number };
  updatedAt: string;
  createdAt: string;
}

interface Annonce {
  id: string;
  slug: string;
  title: string;
  type: string;
  purpose: string;
  price: number;
  currency: string;
  city: string;
  country: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_REVIEW';
  views: number;
  favorites: number;
  imageUrl?: string | undefined;
  createdAt: string;
  updatedAt: string;
}

function mapStatus(s: string): Annonce['status'] {
  if (s === 'ACTIVE') return 'PUBLISHED';
  if (s === 'ARCHIVED') return 'ARCHIVED';
  if (s === 'PENDING_REVIEW') return 'PENDING_REVIEW';
  return 'DRAFT';
}

function fromApi(p: ApiProperty): Annonce {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    type: p.type,
    purpose: p.purpose,
    price: Number(p.price),
    currency: p.currency,
    city: p.city,
    country: p.country,
    status: mapStatus(p.status),
    views: p.viewCount,
    favorites: p._count?.favorites ?? 0,
    imageUrl: p.images?.[0]?.url,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

function formatPrice(amount: number, currency: string): string {
  if (currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} M FCFA`;
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

const STATUS_CONFIG = {
  PUBLISHED: { label: 'Publié', variant: 'success' as const, Icon: CheckCircle2 },
  DRAFT: { label: 'Brouillon', variant: 'outline' as const, Icon: Clock },
  PENDING_REVIEW: { label: 'En révision', variant: 'gold' as const, Icon: AlertCircle },
  ARCHIVED: { label: 'Archivé', variant: 'default' as const, Icon: Archive },
};

const PURPOSE_LABEL: Record<string, string> = {
  SALE: 'Vente',
  RENT: 'Location',
  SHORT_TERM_RENT: 'Court séjour',
  INVESTMENT: 'Investissement',
};

interface AnnonceCardProps {
  annonce: Annonce;
  onPublish: (slug: string) => Promise<void>;
  onDelete: (slug: string) => Promise<void>;
}

function AnnonceCard({ annonce, onPublish, onDelete }: AnnonceCardProps): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const config = STATUS_CONFIG[annonce.status];

  const handlePublish = async () => {
    setPublishing(true);
    try {
      await onPublish(annonce.slug);
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Archiver "${annonce.title}" ? Cette action est réversible via le support.`))
      return;
    setDeleting(true);
    try {
      await onDelete(annonce.slug);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="border-charcoal-100 flex flex-col overflow-hidden rounded-xl border bg-white sm:flex-row"
    >
      {/* Thumbnail */}
      <div className="bg-charcoal-100 relative h-40 flex-shrink-0 sm:h-auto sm:w-40">
        {annonce.imageUrl ? (
          <img src={annonce.imageUrl} alt={annonce.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Building2 className="text-charcoal-300 h-8 w-8" aria-hidden="true" />
          </div>
        )}
        <Badge variant={config.variant} className="absolute left-2 top-2 text-xs">
          {config.label}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-charcoal line-clamp-1 font-semibold leading-tight">
              {annonce.title}
            </p>
            <p className="text-charcoal-400 mt-0.5 text-xs">
              {annonce.city}, {annonce.country} ·{' '}
              {PURPOSE_LABEL[annonce.purpose] ?? annonce.purpose}
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-charcoal-400 hover:bg-charcoal-50 rounded-lg p-1.5"
              aria-label="Options"
              aria-expanded={menuOpen}
            >
              <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="border-charcoal-100 absolute right-0 top-8 z-10 w-44 rounded-lg border bg-white py-1 shadow-lg"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {annonce.status === 'PUBLISHED' && (
                    <Link
                      href={`/proprietes/${annonce.slug}` as Route}
                      className="text-charcoal hover:bg-charcoal-50 flex items-center gap-2 px-3 py-2 text-sm"
                    >
                      <Eye className="h-4 w-4" /> Voir l'annonce
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/annonces/${annonce.slug}/modifier` as Route}
                    className="text-charcoal hover:bg-charcoal-50 flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <Pencil className="h-4 w-4" /> Modifier
                  </Link>
                  <button
                    onClick={() => {
                      void handleDelete();
                      setMenuOpen(false);
                    }}
                    disabled={deleting}
                    className="text-danger hover:bg-danger/5 flex w-full items-center gap-2 px-3 py-2 text-sm disabled:opacity-50"
                  >
                    {deleting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    Archiver
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-navy font-mono font-bold">
          {formatPrice(annonce.price, annonce.currency)}
        </p>

        {/* Stats */}
        <div className="text-charcoal-400 mt-auto flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {annonce.views} vues
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {annonce.favorites} favoris
          </span>
          <span className="ml-auto">
            Mis à jour le {new Date(annonce.updatedAt).toLocaleDateString('fr-FR')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link href={`/dashboard/annonces/${annonce.slug}/modifier` as Route}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Modifier
            </Button>
          </Link>
          {annonce.status === 'DRAFT' && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => void handlePublish()}
              disabled={publishing}
            >
              {publishing ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Publier
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AnnoncesManager(): React.ReactElement {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;

  const [annonces, setAnnonces] = useState<Annonce[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  const load = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.properties.findMine(token);
      setAnnonces((res.data as ApiProperty[]).map(fromApi));
    } catch {
      toast.error('Impossible de charger vos annonces.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const handlePublish = async (slug: string) => {
    if (!token) return;
    try {
      await api.properties.publish(slug, token);
      setAnnonces((prev) => prev.map((a) => (a.slug === slug ? { ...a, status: 'PUBLISHED' } : a)));
      toast.success('Annonce publiée avec succès !');
    } catch {
      toast.error('Impossible de publier. Réessayez.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!token) return;
    try {
      await api.properties.remove(slug, token);
      setAnnonces((prev) => prev.filter((a) => a.slug !== slug));
      toast.success('Annonce archivée.');
    } catch {
      toast.error("Impossible d'archiver. Réessayez.");
    }
  };

  const visible = annonces.filter((a) => a.status !== 'ARCHIVED');
  const filtered = filter === 'all' ? visible : visible.filter((a) => a.status === filter);

  const tabs = [
    { value: 'all', label: `Toutes (${visible.length})` },
    {
      value: 'PUBLISHED',
      label: `Publiées (${visible.filter((a) => a.status === 'PUBLISHED').length})`,
    },
    { value: 'DRAFT', label: `Brouillons (${visible.filter((a) => a.status === 'DRAFT').length})` },
    {
      value: 'PENDING_REVIEW',
      label: `En révision (${visible.filter((a) => a.status === 'PENDING_REVIEW').length})`,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-charcoal font-serif text-2xl font-bold">Mes annonces</h1>
          <p className="text-charcoal-400 mt-0.5 text-sm">
            Gérez vos propriétés publiées et brouillons
          </p>
        </div>
        <Link href={'/dashboard/annonces/nouvelle' as Route}>
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nouvelle annonce
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="text-navy h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total annonces', value: visible.length, color: 'text-navy' },
              {
                label: 'Publiées',
                value: visible.filter((a) => a.status === 'PUBLISHED').length,
                color: 'text-emerald',
              },
              {
                label: 'Vues totales',
                value: visible.reduce((s, a) => s + a.views, 0),
                color: 'text-sky',
              },
              {
                label: 'Favoris totaux',
                value: visible.reduce((s, a) => s + a.favorites, 0),
                color: 'text-gold',
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="border-charcoal-100 rounded-xl border bg-white p-4">
                <p className={cn('font-mono text-2xl font-bold', color)}>{value}</p>
                <p className="text-charcoal-400 mt-0.5 text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="border-charcoal-100 flex gap-1 overflow-x-auto border-b">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={cn(
                  'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                  filter === tab.value
                    ? 'border-navy text-navy'
                    : 'text-charcoal-400 hover:text-charcoal border-transparent',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* List */}
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filtered.map((annonce) => (
                  <AnnonceCard
                    key={annonce.id}
                    annonce={annonce}
                    onPublish={handlePublish}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center gap-4 py-20"
              >
                <Building2 className="text-charcoal-200 h-12 w-12" aria-hidden="true" />
                <p className="text-charcoal text-lg font-semibold">Aucune annonce</p>
                <p className="text-charcoal-400 text-sm">
                  Créez votre première annonce immobilière.
                </p>
                <Link href={'/dashboard/annonces/nouvelle' as Route}>
                  <Button className="mt-2 gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" /> Créer une annonce
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
