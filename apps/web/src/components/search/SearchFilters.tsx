'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@afribayit/ui';
import {
  SlidersHorizontal,
  RotateCcw,
  MapPin,
  Building2,
  Tag,
  Home,
  BedDouble,
} from 'lucide-react';
import { cn } from '@afribayit/ui/src/lib/cn';

interface SearchFiltersProps {
  initialParams: Record<string, string | undefined>;
}

const PROPERTY_TYPES = [
  { value: '', label: 'Tous' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'LAND', label: 'Terrain' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'STUDIO', label: 'Studio' },
  { value: 'COMMERCIAL', label: 'Commerce' },
];

const PURPOSES = [
  { value: '', label: 'Tout' },
  { value: 'SALE', label: 'Vente' },
  { value: 'RENT', label: 'Location' },
  { value: 'SHORT_TERM_RENT', label: 'Court séjour' },
];

const BEDROOM_OPTIONS = ['1', '2', '3', '4', '5+'];

export function SearchFilters({ initialParams }: SearchFiltersProps): React.ReactElement {
  const router = useRouter();
  const [filters, setFilters] = useState({
    ville: initialParams['ville'] ?? '',
    but: initialParams['but'] ?? '',
    type: initialParams['type'] ?? '',
    prixMin: initialParams['prixMin'] ?? '',
    prixMax: initialParams['prixMax'] ?? '',
    surfaceMin: initialParams['surfaceMin'] ?? '',
    surfaceMax: initialParams['surfaceMax'] ?? '',
    chambres: initialParams['chambres'] ?? '',
  });

  const updateFilter = (key: string, value: string): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (): void => {
    const params = new URLSearchParams();
    if (initialParams['q']) params.set('q', initialParams['q']);
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/recherche?${params.toString()}` as Route);
  };

  const resetFilters = (): void => {
    setFilters({
      ville: '',
      but: '',
      type: '',
      prixMin: '',
      prixMax: '',
      surfaceMin: '',
      surfaceMax: '',
      chambres: '',
    });
    router.push('/recherche');
  };

  return (
    <div className="border-charcoal-100 rounded-3xl border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-navy/5 rounded-lg p-2">
            <SlidersHorizontal className="text-navy h-4 w-4" aria-hidden="true" />
          </div>
          <h2 className="text-charcoal text-lg font-bold">Filtres</h2>
        </div>
        <button
          onClick={resetFilters}
          className="text-charcoal-400 hover:text-danger flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors"
          aria-label="Réinitialiser tous les filtres"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          RAZ
        </button>
      </div>

      <div className="space-y-8">
        {/* Purpose */}
        <div className="space-y-3">
          <label className="text-charcoal flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <Tag className="text-gold h-3.5 w-3.5" />
            Opération
          </label>
          <div className="flex flex-wrap gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p.value}
                onClick={() => updateFilter('but', p.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition-all duration-300',
                  filters.but === p.value
                    ? 'bg-navy shadow-navy/20 text-white shadow-md'
                    : 'bg-charcoal-50 text-charcoal-500 hover:bg-navy/5',
                )}
                aria-pressed={filters.but === p.value}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* City */}
        <div className="space-y-3">
          <label className="text-charcoal flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <MapPin className="text-gold h-3.5 w-3.5" />
            Ville
          </label>
          <Input
            value={filters.ville}
            onChange={(e) => updateFilter('ville', e.target.value)}
            placeholder="Cotonou, Abidjan…"
            className="border-charcoal-100 rounded-2xl"
          />
        </div>

        {/* Property type */}
        <div className="space-y-3">
          <label className="text-charcoal flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <Building2 className="text-gold h-3.5 w-3.5" />
            Type de bien
          </label>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter('type', t.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-xs font-bold transition-all duration-300',
                  filters.type === t.value
                    ? 'bg-navy shadow-navy/20 text-white shadow-md'
                    : 'bg-charcoal-50 text-charcoal-500 hover:bg-navy/5',
                )}
                aria-pressed={filters.type === t.value}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="space-y-3">
          <label className="text-charcoal flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <span className="text-gold font-bold">$</span>
            Prix (FCFA)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              value={filters.prixMin}
              onChange={(e) => updateFilter('prixMin', e.target.value)}
              placeholder="Min"
              className="rounded-xl text-sm"
            />
            <Input
              type="number"
              value={filters.prixMax}
              onChange={(e) => updateFilter('prixMax', e.target.value)}
              placeholder="Max"
              className="rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div className="space-y-3">
          <label className="text-charcoal flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
            <BedDouble className="text-gold h-3.5 w-3.5" />
            Chambres
          </label>
          <div className="flex gap-2">
            {BEDROOM_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => updateFilter('chambres', filters.chambres === n ? '' : n)}
                className={cn(
                  'flex-1 rounded-xl border py-2.5 text-xs font-bold transition-all duration-300',
                  filters.chambres === n
                    ? 'bg-navy border-navy shadow-navy/20 text-white shadow-lg'
                    : 'border-charcoal-100 text-charcoal-400 hover:border-navy hover:text-navy',
                )}
                aria-pressed={filters.chambres === n}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={applyFilters}
          className="bg-navy hover:bg-navy-600 shadow-navy/10 mt-4 w-full rounded-2xl py-4 font-bold text-white shadow-xl transition-all active:scale-[0.98]"
        >
          Appliquer
        </button>
      </div>
    </div>
  );
}
