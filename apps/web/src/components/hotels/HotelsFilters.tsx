'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, RotateCcw, Star } from 'lucide-react';
import { Input, Button, Card } from '@afribayit/ui';

const HOTEL_TYPES = [
  { value: '', label: 'Tous' },
  { value: 'HOTEL', label: 'Hôtel' },
  { value: 'RESIDENCE', label: 'Résidence' },
  { value: 'GUESTHOUSE', label: "Maison d'hôtes" },
  { value: 'VILLA', label: 'Villa privée' },
  { value: 'APARTMENT', label: 'Appartement' },
];

const AMENITIES = [
  'Piscine',
  'WiFi',
  'Climatisation',
  'Restauration',
  'Parking',
  'Navette aéroport',
  'Gym',
];

interface HotelsFiltersProps {
  initialParams: Record<string, string | undefined>;
}

export function HotelsFilters({ initialParams }: HotelsFiltersProps): React.ReactElement {
  const router = useRouter();
  const [filters, setFilters] = useState({
    city: initialParams['city'] ?? '',
    type: initialParams['type'] ?? '',
    starRating: initialParams['starRating'] ?? '',
    minPrice: initialParams['minPrice'] ?? '',
    maxPrice: initialParams['maxPrice'] ?? '',
    checkIn: initialParams['checkIn'] ?? '',
    checkOut: initialParams['checkOut'] ?? '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const applyFilters = (): void => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (selectedAmenities.length) params.set('amenities', selectedAmenities.join(','));
    router.push(`/hotels?${params.toString()}` as Route);
  };

  const resetFilters = (): void => {
    setFilters({
      city: '',
      type: '',
      starRating: '',
      minPrice: '',
      maxPrice: '',
      checkIn: '',
      checkOut: '',
    });
    setSelectedAmenities([]);
    router.push('/hotels');
  };

  return (
    <Card className="sticky top-20">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="text-navy h-4 w-4" aria-hidden="true" />
          <h2 className="text-charcoal font-semibold">Filtres</h2>
        </div>
        <button
          onClick={resetFilters}
          className="text-charcoal-400 hover:text-danger flex items-center gap-1 text-xs transition-colors"
          aria-label="Réinitialiser"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" /> Réinitialiser
        </button>
      </div>

      <div className="space-y-5">
        <Input
          label="Ville / Destination"
          value={filters.city}
          onChange={(e) => setFilters((p) => ({ ...p, city: e.target.value }))}
          placeholder="Cotonou, Abidjan…"
        />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-charcoal mb-1.5 block text-sm font-medium">Arrivée</label>
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => setFilters((p) => ({ ...p, checkIn: e.target.value }))}
              className="border-charcoal-200 focus:ring-navy/30 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
          <div>
            <label className="text-charcoal mb-1.5 block text-sm font-medium">Départ</label>
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => setFilters((p) => ({ ...p, checkOut: e.target.value }))}
              className="border-charcoal-200 focus:ring-navy/30 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-charcoal mb-2 text-sm font-medium">
            Type d&apos;hébergement
          </legend>
          <div className="flex flex-wrap gap-1.5">
            {HOTEL_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => setFilters((p) => ({ ...p, type: t.value }))}
                className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${filters.type === t.value ? 'bg-navy text-white' : 'bg-charcoal-50 text-charcoal hover:bg-navy/10'}`}
                aria-pressed={filters.type === t.value}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-charcoal mb-2 text-sm font-medium">Étoiles minimum</legend>
          <div className="flex gap-1.5">
            {['1', '2', '3', '4', '5'].map((n) => (
              <button
                key={n}
                onClick={() =>
                  setFilters((p) => ({ ...p, starRating: p.starRating === n ? '' : n }))
                }
                className={`flex flex-1 items-center justify-center gap-0.5 rounded-md border py-1.5 text-xs transition-colors ${filters.starRating === n ? 'bg-gold/10 border-gold text-gold' : 'border-charcoal-200 text-charcoal hover:border-gold/40'}`}
                aria-pressed={filters.starRating === n}
              >
                <Star className="h-3 w-3" aria-hidden="true" /> {n}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-charcoal mb-2 text-sm font-medium">Prix / nuit (FCFA)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min"
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters((p) => ({ ...p, minPrice: e.target.value }))}
              placeholder="0"
            />
            <Input
              label="Max"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters((p) => ({ ...p, maxPrice: e.target.value }))}
              placeholder="∞"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-charcoal mb-2 text-sm font-medium">Équipements</legend>
          <div className="flex flex-wrap gap-1.5">
            {AMENITIES.map((a) => (
              <button
                key={a}
                onClick={() =>
                  setSelectedAmenities((prev) =>
                    prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a],
                  )
                }
                className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${selectedAmenities.includes(a) ? 'bg-navy text-white' : 'bg-charcoal-50 text-charcoal hover:bg-navy/10'}`}
                aria-pressed={selectedAmenities.includes(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <Button onClick={applyFilters} fullWidth>
          Rechercher
        </Button>
      </div>
    </Card>
  );
}
