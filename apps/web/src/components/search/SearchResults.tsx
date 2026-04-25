import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { LayoutGrid, List, Map } from 'lucide-react';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { MapView } from './MapView';

const TITLES = [
  'Villa Prestige',
  'Appartement T3',
  'Terrain 500m²',
  'Duplex moderne',
  'Studio meublé',
];
const CITIES = ['Cotonou', 'Abidjan', 'Ouagadougou', 'Lomé', 'Porto-Novo'];
const COUNTRIES = ['Bénin', "Côte d'Ivoire", 'Burkina Faso', 'Togo', 'Bénin'];
const PRICES = [85000000, 280000, 12000000, 45000000, 85000];
const TYPES = ['VILLA', 'APARTMENT', 'LAND', 'DUPLEX', 'STUDIO'];
const PURPOSES = [
  'SALE',
  'RENT',
  'SALE',
  'SALE',
  'SHORT_TERM_RENT',
] as PropertyCardData['purpose'][];
const PHOTOS = [
  '1613977257363-707ba9348227',
  '1502672260266-1c1ef2d93688',
  '1549517045-bc93de075e53',
  '1600596542815-ffad4c1539a9',
  '1522708323590-d24dbb6b0267',
];
const BEDROOMS = [4, 3, 0, 5, 1];
const BATHROOMS = [3, 2, 0, 3, 1];
const SURFACES = [350, 110, 500, 280, 45];

const MOCK_RESULTS: PropertyCardData[] = Array.from({ length: 9 }, (_, i) => {
  const v = i % 5;
  const bedrooms = BEDROOMS[v];
  const bathrooms = BATHROOMS[v];
  const surface = SURFACES[v];
  return {
    id: String(i + 1),
    slug: `propriete-${i + 1}`,
    title: TITLES[v] ?? 'Propriété',
    city: CITIES[v] ?? 'Cotonou',
    country: COUNTRIES[v] ?? 'Bénin',
    price: PRICES[v] ?? 1000000,
    currency: 'XOF',
    ...(bedrooms ? { bedrooms } : {}),
    ...(bathrooms ? { bathrooms } : {}),
    ...(surface ? { surface } : {}),
    purpose: PURPOSES[v] ?? 'SALE',
    type: TYPES[v] ?? 'HOUSE',
    imageUrl: `https://images.unsplash.com/photo-${PHOTOS[v] ?? PHOTOS[0]}?w=600&q=80`,
    isVerified: i % 3 !== 0,
    isFeatured: i % 4 === 0,
  };
});

const MAP_PROPERTIES = MOCK_RESULTS.map((p, i) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  price: p.price,
  currency: p.currency,
  latitude: 6.3654 + (i * 0.02 - 0.04),
  longitude: 2.4183 + (i * 0.015 - 0.03),
  type: p.type ?? 'HOUSE',
  purpose: p.purpose ?? 'SALE',
}));

interface SearchResultsProps {
  searchParams: Record<string, string | undefined>;
}

export async function SearchResults({
  searchParams,
}: SearchResultsProps): Promise<React.ReactElement> {
  const results = MOCK_RESULTS;
  const total = results.length;
  const view = searchParams['vue'] ?? 'grille';

  return (
    <div className="flex flex-col gap-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-charcoal-400 text-sm">
          <span className="text-charcoal font-semibold">{total}</span> propriétés trouvées
        </p>
        <div className="border-charcoal-100 flex items-center gap-1 rounded-lg border p-1">
          {[
            { value: 'grille', Icon: LayoutGrid, label: 'Vue grille' },
            { value: 'liste', Icon: List, label: 'Vue liste' },
            { value: 'carte', Icon: Map, label: 'Vue carte' },
          ].map(({ value, Icon, label }) => (
            <Link
              key={value}
              href={
                `/recherche?${new URLSearchParams({ ...searchParams, vue: value } as Record<string, string>).toString()}` as Route
              }
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

      {/* Map view */}
      {view === 'carte' && <MapView properties={MAP_PROPERTIES} className="h-[600px]" />}

      {/* Grid / List view */}
      {view !== 'carte' &&
        (results.length > 0 ? (
          <div
            className={
              view === 'liste'
                ? 'flex flex-col gap-4'
                : 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3'
            }
          >
            {results.map((property) => (
              <Link
                key={property.id}
                href={`/proprietes/${property.slug}` as Route}
                className="block"
              >
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <span className="text-5xl" aria-hidden="true">
              🏘️
            </span>
            <p className="text-charcoal text-lg font-semibold">Aucune propriété trouvée</p>
            <p className="text-charcoal-400 text-sm">Modifiez vos critères de recherche.</p>
          </div>
        ))}
    </div>
  );
}
