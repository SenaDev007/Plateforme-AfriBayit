'use client';
import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Eye, Pencil, Trash2, CheckCircle2, Clock, Archive,
  MoreVertical, TrendingUp, Building2, AlertCircle
} from 'lucide-react';
import { Badge, Button, cn } from '@afribayit/ui';

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
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const MOCK_ANNONCES: Annonce[] = [
  {
    id: '1',
    slug: 'villa-prestige-cotonou',
    title: 'Villa Prestige 4 chambres',
    type: 'VILLA',
    purpose: 'SALE',
    price: 85000000,
    currency: 'XOF',
    city: 'Cotonou',
    country: 'Bénin',
    status: 'PUBLISHED',
    views: 342,
    favorites: 18,
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=70',
    createdAt: '2026-01-15',
    updatedAt: '2026-04-01',
  },
  {
    id: '2',
    slug: 'appartement-t3-port-bouet',
    title: 'Appartement T3 meublé',
    type: 'APARTMENT',
    purpose: 'RENT',
    price: 280000,
    currency: 'XOF',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    status: 'DRAFT',
    views: 0,
    favorites: 0,
    createdAt: '2026-04-10',
    updatedAt: '2026-04-18',
  },
  {
    id: '3',
    slug: 'terrain-500m2-ouagadougou',
    title: 'Terrain 500m² viabilisé',
    type: 'LAND',
    purpose: 'SALE',
    price: 12000000,
    currency: 'XOF',
    city: 'Ouagadougou',
    country: 'Burkina Faso',
    status: 'PENDING_REVIEW',
    views: 89,
    favorites: 5,
    createdAt: '2026-03-20',
    updatedAt: '2026-04-05',
  },
];

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

function AnnonceCard({ annonce, onDelete }: { annonce: Annonce; onDelete: (id: string) => void }): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);
  const config = STATUS_CONFIG[annonce.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-xl border border-charcoal-100 overflow-hidden flex flex-col sm:flex-row"
    >
      {/* Thumbnail */}
      <div className="relative h-40 sm:h-auto sm:w-40 flex-shrink-0 bg-charcoal-100">
        {annonce.imageUrl ? (
          <img src={annonce.imageUrl} alt={annonce.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <Building2 className="h-8 w-8 text-charcoal-300" aria-hidden="true" />
          </div>
        )}
        <Badge variant={config.variant} className="absolute top-2 left-2 text-xs">
          {config.label}
        </Badge>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-charcoal leading-tight line-clamp-1">{annonce.title}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">
              {annonce.city}, {annonce.country} · {PURPOSE_LABEL[annonce.purpose] ?? annonce.purpose}
            </p>
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1.5 rounded-lg text-charcoal-400 hover:bg-charcoal-50"
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
                  className="absolute right-0 top-8 z-10 w-44 rounded-lg border border-charcoal-100 bg-white shadow-lg py-1"
                  onMouseLeave={() => setMenuOpen(false)}
                >
                  {annonce.status === 'PUBLISHED' && (
                    <Link
                      href={`/proprietes/${annonce.slug}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-charcoal-50"
                    >
                      <Eye className="h-4 w-4" /> Voir l'annonce
                    </Link>
                  )}
                  <Link
                    href={`/dashboard/annonces/${annonce.slug}/modifier`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-charcoal hover:bg-charcoal-50"
                  >
                    <Pencil className="h-4 w-4" /> Modifier
                  </Link>
                  <button
                    onClick={() => { onDelete(annonce.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-danger/5 w-full"
                  >
                    <Trash2 className="h-4 w-4" /> Supprimer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="font-mono font-bold text-navy">{formatPrice(annonce.price, annonce.currency)}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-charcoal-400 mt-auto">
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {annonce.views} vues
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {annonce.favorites} favoris
          </span>
          <span className="ml-auto">Mis à jour le {new Date(annonce.updatedAt).toLocaleDateString('fr-FR')}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Link href={`/dashboard/annonces/${annonce.slug}/modifier`}>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Modifier
            </Button>
          </Link>
          {annonce.status === 'DRAFT' && (
            <Button size="sm" className="gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Publier
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function AnnoncesManager(): React.ReactElement {
  const [annonces, setAnnonces] = useState<Annonce[]>(MOCK_ANNONCES);
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all'
    ? annonces
    : annonces.filter((a) => a.status === filter);

  const handleDelete = (id: string): void => {
    setAnnonces((prev) => prev.filter((a) => a.id !== id));
  };

  const tabs = [
    { value: 'all', label: `Toutes (${annonces.length})` },
    { value: 'PUBLISHED', label: `Publiées (${annonces.filter((a) => a.status === 'PUBLISHED').length})` },
    { value: 'DRAFT', label: `Brouillons (${annonces.filter((a) => a.status === 'DRAFT').length})` },
    { value: 'PENDING_REVIEW', label: `En révision (${annonces.filter((a) => a.status === 'PENDING_REVIEW').length})` },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Mes annonces</h1>
          <p className="text-sm text-charcoal-400 mt-0.5">Gérez vos propriétés publiées et brouillons</p>
        </div>
        <Link href="/dashboard/annonces/nouvelle">
          <Button className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nouvelle annonce
          </Button>
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total annonces', value: annonces.length, color: 'text-navy' },
          { label: 'Publiées', value: annonces.filter((a) => a.status === 'PUBLISHED').length, color: 'text-emerald' },
          { label: 'Vues totales', value: annonces.reduce((s, a) => s + a.views, 0), color: 'text-sky' },
          { label: 'Favoris totaux', value: annonces.reduce((s, a) => s + a.favorites, 0), color: 'text-gold' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-charcoal-100 p-4">
            <p className={cn('font-mono text-2xl font-bold', color)}>{value}</p>
            <p className="text-xs text-charcoal-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-charcoal-100 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              filter === tab.value
                ? 'border-navy text-navy'
                : 'border-transparent text-charcoal-400 hover:text-charcoal',
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
              <AnnonceCard key={annonce.id} annonce={annonce} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <Building2 className="h-12 w-12 text-charcoal-200" aria-hidden="true" />
            <p className="text-lg font-semibold text-charcoal">Aucune annonce</p>
            <p className="text-sm text-charcoal-400">Créez votre première annonce immobilière.</p>
            <Link href="/dashboard/annonces/nouvelle">
              <Button className="gap-2 mt-2">
                <Plus className="h-4 w-4" aria-hidden="true" /> Créer une annonce
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
