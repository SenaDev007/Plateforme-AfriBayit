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
  { value: 'GUESTHOUSE', label: 'Maison d\'hôtes' },
  { value: 'VILLA', label: 'Villa privée' },
  { value: 'APARTMENT', label: 'Appartement' },
];

const AMENITIES = ['Piscine', 'WiFi', 'Climatisation', 'Restauration', 'Parking', 'Navette aéroport', 'Gym'];

interface HotelsFiltersProps {
  initialParams: Record<string, string | undefined>;
}

export function HotelsFilters({ initialParams }: HotelsFiltersProps): React.ReactElement {
  const router = useRouter();
  const [filters, setFilters] = useState({
    ville: initialParams['ville'] ?? '',
    type: initialParams['type'] ?? '',
    stars: initialParams['stars'] ?? '',
    prixMin: initialParams['prixMin'] ?? '',
    prixMax: initialParams['prixMax'] ?? '',
    checkin: initialParams['checkin'] ?? '',
    checkout: initialParams['checkout'] ?? '',
  });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const applyFilters = (): void => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (selectedAmenities.length) params.set('amenities', selectedAmenities.join(','));
    router.push(`/hotels?${params.toString()}` as Route);
  };

  const resetFilters = (): void => {
    setFilters({ ville: '', type: '', stars: '', prixMin: '', prixMax: '', checkin: '', checkout: '' });
    setSelectedAmenities([]);
    router.push('/hotels');
  };

  return (
    <Card className="sticky top-20">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-navy" aria-hidden="true" />
          <h2 className="font-semibold text-charcoal">Filtres</h2>
        </div>
        <button onClick={resetFilters} className="flex items-center gap-1 text-xs text-charcoal-400 hover:text-danger transition-colors" aria-label="Réinitialiser">
          <RotateCcw className="h-3 w-3" aria-hidden="true" /> Réinitialiser
        </button>
      </div>

      <div className="space-y-5">
        <Input label="Ville / Destination" value={filters.ville} onChange={(e) => setFilters((p) => ({ ...p, ville: e.target.value }))} placeholder="Cotonou, Abidjan…" />

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Arrivée</label>
            <input type="date" value={filters.checkin} onChange={(e) => setFilters((p) => ({ ...p, checkin: e.target.value }))}
              className="w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1.5">Départ</label>
            <input type="date" value={filters.checkout} onChange={(e) => setFilters((p) => ({ ...p, checkout: e.target.value }))}
              className="w-full rounded-lg border border-charcoal-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30" />
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Type d'hébergement</legend>
          <div className="flex flex-wrap gap-1.5">
            {HOTEL_TYPES.map((t) => (
              <button key={t.value} onClick={() => setFilters((p) => ({ ...p, type: t.value }))}
                className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${filters.type === t.value ? 'bg-navy text-white' : 'bg-charcoal-50 text-charcoal hover:bg-navy/10'}`}
                aria-pressed={filters.type === t.value}>
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Étoiles minimum</legend>
          <div className="flex gap-1.5">
            {['1', '2', '3', '4', '5'].map((n) => (
              <button key={n} onClick={() => setFilters((p) => ({ ...p, stars: p.stars === n ? '' : n }))}
                className={`flex-1 flex items-center justify-center gap-0.5 rounded-md py-1.5 text-xs border transition-colors ${filters.stars === n ? 'bg-gold/10 border-gold text-gold' : 'border-charcoal-200 text-charcoal hover:border-gold/40'}`}
                aria-pressed={filters.stars === n}>
                <Star className="h-3 w-3" aria-hidden="true" /> {n}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Prix / nuit (FCFA)</legend>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Min" type="number" value={filters.prixMin} onChange={(e) => setFilters((p) => ({ ...p, prixMin: e.target.value }))} placeholder="0" />
            <Input label="Max" type="number" value={filters.prixMax} onChange={(e) => setFilters((p) => ({ ...p, prixMax: e.target.value }))} placeholder="∞" />
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Équipements</legend>
          <div className="flex flex-wrap gap-1.5">
            {AMENITIES.map((a) => (
              <button key={a} onClick={() => setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a])}
                className={`rounded-pill px-3 py-1 text-xs font-medium transition-colors ${selectedAmenities.includes(a) ? 'bg-navy text-white' : 'bg-charcoal-50 text-charcoal hover:bg-navy/10'}`}
                aria-pressed={selectedAmenities.includes(a)}>
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <Button onClick={applyFilters} fullWidth>Rechercher</Button>
      </div>
    </Card>
  );
}
