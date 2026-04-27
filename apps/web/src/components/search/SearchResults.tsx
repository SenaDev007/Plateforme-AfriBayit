import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { LayoutGrid, List, Map } from 'lucide-react';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { MapView } from './MapView';

interface ApiProperty {
  id: string;
  slug: string;
  title: string;
  city: string;
  country: string;
  price: unknown;
  currency: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  surface?: number | null;
  purpose: string;
  type: string;
  isVerified: boolean;
  isFeatured: boolean;
  latitude?: number | null;
  longitude?: number | null;
  images?: Array<{ url: string; isPrimary?: boolean }>;
}

function toCardData(p: ApiProperty): PropertyCardData {
  const primaryImage = p.images?.find((img) => img.isPrimary) ?? p.images?.[0];
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    city: p.city,
    country: p.country,
    price: Number(p.price),
    currency: p.currency,
    ...(p.bedrooms ? { bedrooms: p.bedrooms } : {}),
    ...(p.bathrooms ? { bathrooms: p.bathrooms } : {}),
    ...(p.surface ? { surface: p.surface } : {}),
    purpose: p.purpose as PropertyCardData['purpose'],
    type: p.type,
    imageUrl:
      primaryImage?.url ??
      `https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80`,
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
  };
}

interface SearchResultsProps {
  searchParams: Record<string, string | undefined>;
}

export async function SearchResults({
  searchParams,
}: SearchResultsProps): Promise<React.ReactElement> {
  let results: PropertyCardData[] = [];
  let total = 0;

  try {
    const params = new URLSearchParams();
    if (searchParams['q']) params.set('q', searchParams['q']);
    if (searchParams['city']) params.set('city', searchParams['city']);
    if (searchParams['but']) params.set('purpose', searchParams['but']);
    if (searchParams['type']) params.set('type', searchParams['type']);
    if (searchParams['prixMin']) params.set('prixMin', searchParams['prixMin']);
    if (searchParams['prixMax']) params.set('prixMax', searchParams['prixMax']);
    if (searchParams['surfaceMin']) params.set('surfaceMin', searchParams['surfaceMin']);
    if (searchParams['surfaceMax']) params.set('surfaceMax', searchParams['surfaceMax']);
    if (searchParams['chambres']) params.set('chambres', searchParams['chambres']);
    if (searchParams['country']) params.set('country', searchParams['country']);
    params.set('page', searchParams['page'] ?? '1');
    params.set('limit', '12');

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/properties?${params.toString()}`, {
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const data = (await res.json()) as { data: ApiProperty[]; total: number };
      results = (data.data ?? []).map(toCardData);
      total = data.total ?? results.length;
    }
  } catch {
    // API unavailable — empty state shown
  }

  const view = searchParams['vue'] ?? 'grille';
  const mapProperties = results.map((p, i) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    currency: p.currency,
    latitude: 6.3654 + (i * 0.02 - 0.04),
    longitude: 2.4183 + (i * 0.015 - 0.03),
    type: p.type ?? 'HOUSE',
    purpose: (p.purpose ?? 'SALE') as string,
  }));

  return (
    <div className="flex flex-col gap-5">
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

      {view === 'carte' && <MapView properties={mapProperties} className="h-[600px]" />}

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
