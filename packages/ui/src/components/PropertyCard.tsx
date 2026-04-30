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

/**
 * Premium Property Card
 * Used for displaying properties in grids and carousels.
 */
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
        'group relative flex flex-col overflow-hidden rounded-2xl bg-white',
        'border-charcoal-100 shadow-card border',
        'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:shadow-card-hover hover:-translate-y-2',
        compact ? 'max-w-[300px]' : 'w-full',
        className,
      )}
      aria-label={`Propriété : ${property.title}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.imageUrl}
          alt={property.title}
          className={cn(
            'absolute inset-0 h-full w-full object-cover',
            'transition-transform duration-700 group-hover:scale-110',
          )}
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div className="from-charcoal-900/60 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges overlay */}
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <Badge
            variant={purposeBadge[property.purpose]}
            className="text-navy border-none bg-white/90 px-3 py-1 shadow-lg backdrop-blur-sm"
          >
            {purposeLabel[property.purpose]}
          </Badge>
          {property.isFeatured && (
            <Badge variant="gold" className="px-3 py-1 shadow-lg">
              Premium
            </Badge>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={cn(
            'absolute right-4 top-4 rounded-full bg-white/90 p-2.5 shadow-lg',
            'transition-all duration-300 hover:scale-110 hover:bg-white',
            'focus-visible:ring-gold focus-visible:outline-none focus-visible:ring-2',
          )}
          aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          aria-pressed={favorited}
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors duration-300',
              favorited ? 'fill-danger text-danger' : 'text-charcoal-400',
            )}
            aria-hidden="true"
          />
        </button>

        {/* Price Tag Overlay (Bottom) */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between rounded-xl bg-white/95 p-3 shadow-xl backdrop-blur-md">
            <span className="text-navy text-xs font-bold uppercase tracking-wider">
              Prix Direct
            </span>
            <span className="text-navy font-mono text-sm font-bold">
              {formatPrice(property.price, property.currency)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn('flex flex-1 flex-col gap-3', compact ? 'p-4' : 'p-5')}>
        {/* Location */}
        <div className="text-charcoal-400 flex items-center gap-1.5 text-xs font-medium">
          <MapPin className="text-gold h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          <span className="truncate">
            {property.city}, {property.country}
          </span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'text-charcoal group-hover:text-navy font-serif font-bold leading-tight transition-colors',
            compact ? 'text-base' : 'text-xl',
          )}
        >
          {property.title}
        </h3>

        {/* Features */}
        <div className="text-charcoal-500 flex items-center gap-4 pt-1 text-xs font-medium">
          {property.bedrooms != null && (
            <span className="bg-charcoal-50 flex items-center gap-1.5 rounded-md px-2 py-1">
              <BedDouble className="text-navy h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {property.bedrooms} <span className="hidden sm:inline">chambres</span>
                <span className="sm:hidden">ch.</span>
              </span>
            </span>
          )}
          {property.bathrooms != null && (
            <span className="bg-charcoal-50 flex items-center gap-1.5 rounded-md px-2 py-1">
              <Bath className="text-navy h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {property.bathrooms} <span className="hidden sm:inline">douches</span>
                <span className="sm:hidden">sdb.</span>
              </span>
            </span>
          )}
          {property.surface != null && (
            <span className="bg-charcoal-50 flex items-center gap-1.5 rounded-md px-2 py-1">
              <Expand className="text-navy h-3.5 w-3.5" aria-hidden="true" />
              <span>{property.surface} m²</span>
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="bg-charcoal-100 my-1 h-px w-full" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <p className="text-navy font-mono text-lg font-bold">
            {formatPrice(property.price, property.currency)}
          </p>
          {property.isVerified ? (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              VÉRIFIÉ
            </span>
          ) : (
            <span className="text-charcoal-300 text-[10px] font-bold uppercase tracking-widest">
              Nouveau
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
