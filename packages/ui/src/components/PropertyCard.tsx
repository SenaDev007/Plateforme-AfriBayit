'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, BedDouble, Bath, Expand, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/cn';
import { Badge } from './Badge';

export interface PropertyCardData {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  price: number;
  currency: string;
  surface?: number;
  bedrooms?: number;
  bathrooms?: number;
  purpose: 'SALE' | 'RENT' | 'SHORT_TERM_RENT' | 'INVESTMENT';
  type: string;
  imageUrl: string;
  isVerified?: boolean;
  isFeatured?: boolean;
}

interface PropertyCardProps {
  property: PropertyCardData;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  /** Compact mode for map popups */
  compact?: boolean;
  className?: string;
}

const purposeLabel: Record<PropertyCardData['purpose'], string> = {
  SALE: 'Vente',
  RENT: 'Location',
  SHORT_TERM_RENT: 'Court séjour',
  INVESTMENT: 'Investissement',
};

const purposeBadge: Record<PropertyCardData['purpose'], 'default' | 'gold' | 'sky' | 'success'> = {
  SALE: 'default',
  RENT: 'sky',
  SHORT_TERM_RENT: 'success',
  INVESTMENT: 'gold',
};

/** Formats XOF / other currencies compactly */
function formatPrice(amount: number, currency: string): string {
  if (currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} M FCFA`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} K FCFA`;
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

export function PropertyCard({
  property,
  onFavorite,
  isFavorited = false,
  compact = false,
  className,
}: PropertyCardProps): React.ReactElement {
  const [favorited, setFavorited] = React.useState(isFavorited);

  const handleFavorite = (e: React.MouseEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setFavorited((v) => !v);
    onFavorite?.(property.id);
  };

  return (
    <motion.article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-lg bg-white',
        'border border-charcoal-100 shadow-card',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:-translate-y-1.5 hover:shadow-card-hover',
        compact ? 'max-w-[280px]' : 'w-full',
        className,
      )}
      aria-label={`Propriété : ${property.title}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ paddingBottom: compact ? '60%' : '56.25%' }}>
        <img
          src={property.imageUrl}
          alt={property.title}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'transition-transform duration-500 group-hover:scale-105',
          )}
          loading="lazy"
        />

        {/* Badges overlay */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Badge variant={purposeBadge[property.purpose]}>
            {purposeLabel[property.purpose]}
          </Badge>
          {property.isFeatured && <Badge variant="gold">Premium</Badge>}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={cn(
            'absolute right-3 top-3 rounded-full bg-white/90 p-2',
            'transition-all duration-200 hover:scale-110',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
          )}
          aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorited}
        >
          <Heart
            className={cn('h-4 w-4', favorited ? 'fill-danger text-danger' : 'text-charcoal-400')}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Content */}
      <div className={cn('flex flex-1 flex-col gap-2', compact ? 'p-3' : 'p-4')}>
        {/* Location */}
        <div className="flex items-center gap-1 text-xs text-charcoal-400">
          <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">
            {property.city}, {property.country}
          </span>
        </div>

        {/* Title */}
        <h3 className={cn('font-serif font-semibold text-charcoal leading-tight', compact ? 'text-sm' : 'text-base')}>
          {property.title}
        </h3>

        {/* Features */}
        {!compact && (
          <div className="flex items-center gap-3 text-xs text-charcoal-400">
            {property.bedrooms != null && (
              <span className="flex items-center gap-1">
                <BedDouble className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{property.bedrooms} ch.</span>
              </span>
            )}
            {property.bathrooms != null && (
              <span className="flex items-center gap-1">
                <Bath className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{property.bathrooms} sdb.</span>
              </span>
            )}
            {property.surface != null && (
              <span className="flex items-center gap-1">
                <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{property.surface} m²</span>
              </span>
            )}
          </div>
        )}

        {/* Price + verified */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <p className="font-mono font-semibold text-navy">
            {formatPrice(property.price, property.currency)}
          </p>
          {property.isVerified && (
            <span className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Vérifié
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
