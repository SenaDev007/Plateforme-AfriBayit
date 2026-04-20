'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Input, Button, Card } from '@afribayit/ui';

const CATEGORIES = [
  { value: '', label: 'Toutes catégories' },
  { value: 'MASON', label: '🧱 Maçon' },
  { value: 'ELECTRICIAN', label: '⚡ Électricien' },
  { value: 'PLUMBER', label: '🔧 Plombier' },
  { value: 'PAINTER', label: '🎨 Peintre' },
  { value: 'CARPENTER', label: '🪚 Menuisier' },
  { value: 'ROOFER', label: '🏠 Couvreur' },
  { value: 'TILER', label: '🪟 Carreleur' },
  { value: 'LANDSCAPER', label: '🌿 Paysagiste' },
  { value: 'CLEANER', label: '🧹 Nettoyage' },
  { value: 'SECURITY', label: '🔒 Sécurité' },
];

const MIN_RATINGS = [
  { value: '', label: 'Toutes notes' },
  { value: '4', label: '4+ étoiles' },
  { value: '4.5', label: '4.5+ étoiles' },
];

interface ArtisansFiltersProps {
  initialParams: Record<string, string | undefined>;
}

export function ArtisansFilters({ initialParams }: ArtisansFiltersProps): React.ReactElement {
  const router = useRouter();
  const [filters, setFilters] = useState({
    ville: initialParams['ville'] ?? '',
    categorie: initialParams['categorie'] ?? '',
    noteMin: initialParams['noteMin'] ?? '',
    disponible: initialParams['disponible'] ?? '',
    certifie: initialParams['certifie'] ?? '',
  });

  const applyFilters = (): void => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/artisans?${params.toString()}` as Route);
  };

  const resetFilters = (): void => {
    setFilters({ ville: '', categorie: '', noteMin: '', disponible: '', certifie: '' });
    router.push('/artisans');
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
        <Input label="Ville" value={filters.ville} onChange={(e) => setFilters((p) => ({ ...p, ville: e.target.value }))} placeholder="Cotonou, Abidjan…" />

        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Catégorie</legend>
          <div className="flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <button key={c.value} onClick={() => setFilters((p) => ({ ...p, categorie: c.value }))}
                className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.categorie === c.value ? 'bg-navy/10 text-navy font-medium' : 'text-charcoal-600 hover:bg-charcoal-50'}`}
                aria-pressed={filters.categorie === c.value}>
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-charcoal mb-2">Note minimum</legend>
          <div className="flex flex-col gap-1">
            {MIN_RATINGS.map((r) => (
              <button key={r.value} onClick={() => setFilters((p) => ({ ...p, noteMin: r.value }))}
                className={`text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${filters.noteMin === r.value ? 'bg-navy/10 text-navy font-medium' : 'text-charcoal-600 hover:bg-charcoal-50'}`}
                aria-pressed={filters.noteMin === r.value}>
                {r.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={filters.disponible === 'true'} onChange={(e) => setFilters((p) => ({ ...p, disponible: e.target.checked ? 'true' : '' }))}
              className="h-4 w-4 rounded border-charcoal-300 accent-navy" />
            <span className="text-sm text-charcoal">Disponible maintenant</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={filters.certifie === 'true'} onChange={(e) => setFilters((p) => ({ ...p, certifie: e.target.checked ? 'true' : '' }))}
              className="h-4 w-4 rounded border-charcoal-300 accent-navy" />
            <span className="text-sm text-charcoal">Certifié AfriBayit</span>
          </label>
        </div>

        <Button onClick={applyFilters} fullWidth>Filtrer</Button>
      </div>
    </Card>
  );
}
