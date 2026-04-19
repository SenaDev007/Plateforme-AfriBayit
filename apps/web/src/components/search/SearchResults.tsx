import Link from 'next/link';
import { LayoutGrid, List, Map } from 'lucide-react';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';

// Mock data — replace with real API fetch
const MOCK_RESULTS: PropertyCardData[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  slug: `propriete-${i + 1}`,
  title: [`Villa Prestige`, `Appartement T3`, `Terrain 500m²`, `Duplex moderne`, `Studio meublé`][i % 5] ?? 'Propriété',
  city: ['Cotonou', 'Abidjan', 'Ouagadougou', 'Lomé', 'Porto-Novo'][i % 5] ?? 'Cotonou',
  country: ['Bénin', 'Côte d\'Ivoire', 'Burkina Faso', 'Togo', 'Bénin'][i % 5] ?? 'Bénin',
  price: [85000000, 280000, 12000000, 45000000, 85000][i % 5] ?? 1000000,
  currency: 'XOF',
  bedrooms: [4, 3, undefined, 5, 1][i % 5] ?? undefined,
  bathrooms: [3, 2, undefined, 3, 1][i % 5] ?? undefined,
  surface: [350, 110, 500, 280, 45][i % 5] ?? undefined,
  purpose: ['SALE', 'RENT', 'SALE', 'SALE', 'SHORT_TERM_RENT'][i % 5] as PropertyCardData['purpose'],
  type: ['VILLA', 'APARTMENT', 'LAND', 'DUPLEX', 'STUDIO'][i % 5] ?? 'HOUSE',
  imageUrl: `https://images.unsplash.com/photo-${['1613977257363-707ba9348227', '1502672260266-1c1ef2d93688', '1549517045-bc93de075e53', '1600596542815-ffad4c1539a9', '1522708323590-d24dbb6b0267'][i % 5]}?w=600&q=80`,
  isVerified: i % 3 !== 0,
  isFeatured: i % 4 === 0,
}));

interface SearchResultsProps {
  searchParams: Record<string, string | undefined>;
}

export async function SearchResults({ searchParams }: SearchResultsProps): Promise<React.ReactElement> {
  // TODO: Replace with real API call
  // const { data, total } = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?${new URLSearchParams(searchParams)}`).then(r => r.json());
  const results = MOCK_RESULTS;
  const total = results.length;

  const view = searchParams['vue'] ?? 'grille';

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-charcoal-400">
          <span className="font-semibold text-charcoal">{total}</span> propriétés trouvées
        </p>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border border-charcoal-100 p-1">
          {[
            { value: 'grille', Icon: LayoutGrid, label: 'Vue grille' },
            { value: 'liste', Icon: List, label: 'Vue liste' },
            { value: 'carte', Icon: Map, label: 'Vue carte' },
          ].map(({ value, Icon, label }) => (
            <Link
              key={value}
              href={`/recherche?${new URLSearchParams({ ...searchParams, vue: value } as Record<string, string>).toString()}`}
              className={`flex items-center justify-center rounded-md p-2 transition-colors ${
                view === value ? 'bg-navy text-white' : 'text-charcoal-400 hover:bg-charcoal-50'
              }`}
              aria-label={label}
              aria-current={view === value ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>

      {/* Results grid */}
      {results.length > 0 ? (
        <div
          className={
            view === 'liste'
              ? 'flex flex-col gap-4'
              : 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
          }
        >
          {results.map((property) => (
            <Link key={property.id} href={`/proprietes/${property.slug}`} className="block">
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl" aria-hidden="true">🏘️</span>
          <p className="text-lg font-semibold text-charcoal">Aucune propriété trouvée</p>
          <p className="text-sm text-charcoal-400">Modifiez vos critères de recherche.</p>
        </div>
      )}
    </div>
  );
}
