'use client';
import type React from 'react';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Button, Card } from '@afribayit/ui';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

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
  { value: 'DUPLEX', label: 'Duplex' },
  { value: 'COMMERCIAL', label: 'Commercial' },
];

const PURPOSES = [
  { value: '', label: 'Tout' },
  { value: 'SALE', label: 'Vente' },
  { value: 'RENT', label: 'Location' },
  { value: 'SHORT_TERM_RENT', label: 'Court séjour' },
  { value: 'INVESTMENT', label: 'Investissement' },
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
    router.push(`/recherche?${params.toString()}`);
  };

  const resetFilters = (): void => {
    setFilters({ ville: '', but: '', type: '', prixMin: '', prixMax: '', surfaceMin: '', surfaceMax: '', chambres: '' });
    router.push('/recherche');
  };

  return (
    <Card className="sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-navy" aria-hidden="true" />
          <h2 className="font-semibold text-charcoal">Filtres</h2>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs text-charcoal-400 hover:text-danger transition-colors"
          aria-label="Réinitialiser tous les filtres"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Réinitialiser
        </button>
      </div>

      <div className="space-y-5">
        {/* Purpose */}
        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Type d'opération</legend>
          <div className="flex flex-wrap gap-1.5">
            {PURPOSES.map((p) => (
              <button
                key={p.value}
                onClick={() => updateFilter('but', p.value)}
                className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${
                  filters.but === p.value
                    ? 'bg-navy text-white'
                    : 'bg-charcoal-50 text-charcoal hover:bg-navy/10'
                }`}
                aria-pressed={filters.but === p.value}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* City */}
        <Input
          label="Ville"
          value={filters.ville}
          onChange={(e) => updateFilter('ville', e.target.value)}
          placeholder="Cotonou, Abidjan…"
        />

        {/* Property type */}
        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Type de bien</legend>
          <div className="flex flex-wrap gap-1.5">
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => updateFilter('type', t.value)}
                className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${
                  filters.type === t.value
                    ? 'bg-navy text-white'
                    : 'bg-charcoal-50 text-charcoal hover:bg-navy/10'
                }`}
                aria-pressed={filters.type === t.value}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        {/* Price range */}
        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Prix (FCFA)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min"
              type="number"
              value={filters.prixMin}
              onChange={(e) => updateFilter('prixMin', e.target.value)}
              placeholder="0"
            />
            <Input
              label="Max"
              type="number"
              value={filters.prixMax}
              onChange={(e) => updateFilter('prixMax', e.target.value)}
              placeholder="∞"
            />
          </div>
        </fieldset>

        {/* Surface */}
        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Surface (m²)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min"
              type="number"
              value={filters.surfaceMin}
              onChange={(e) => updateFilter('surfaceMin', e.target.value)}
              placeholder="0"
            />
            <Input
              label="Max"
              type="number"
              value={filters.surfaceMax}
              onChange={(e) => updateFilter('surfaceMax', e.target.value)}
              placeholder="∞"
            />
          </div>
        </fieldset>

        {/* Bedrooms */}
        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Chambres</legend>
          <div className="flex gap-1.5">
            {BEDROOM_OPTIONS.map((n) => (
              <button
                key={n}
                onClick={() => updateFilter('chambres', filters.chambres === n ? '' : n)}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium border transition-colors ${
                  filters.chambres === n
                    ? 'bg-navy text-white border-navy'
                    : 'border-charcoal-200 text-charcoal hover:border-navy/40'
                }`}
                aria-pressed={filters.chambres === n}
              >
                {n}
              </button>
            ))}
          </div>
        </fieldset>

        <Button onClick={applyFilters} fullWidth>
          Appliquer les filtres
        </Button>
      </div>
    </Card>
  );
}
