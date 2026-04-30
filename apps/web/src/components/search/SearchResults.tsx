'use client';
import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { LayoutGrid, List, Map, Search as SearchIcon } from 'lucide-react';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { MapView } from './MapView';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

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
      `https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80`,
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
  };
}

interface SearchResultsProps {
  searchParams: Record<string, string | undefined>;
}

export function SearchResults({ searchParams }: SearchResultsProps): React.ReactElement {
  const [results, setResults] = useState<PropertyCardData[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
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
        const res = await fetch(`${apiUrl}/api/v1/properties?${params.toString()}`);

        if (res.ok) {
          const data = (await res.json()) as { data: ApiProperty[]; total: number };
          setResults((data.data ?? []).map(toCardData));
          setTotal(data.total ?? data.data?.length ?? 0);
        }
      } catch {
        // Handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

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
    <div className="flex flex-col gap-8">
      <div className="border-charcoal-100 flex flex-col items-center justify-between gap-4 border-b pb-6 sm:flex-row">
        <div>
          <p className="text-charcoal-400 text-sm font-medium">
            Nous avons trouvé <span className="text-navy font-bold">{total}</span> propriétés
            correspondant à vos critères
          </p>
        </div>

        <div className="bg-charcoal-50 border-charcoal-100 flex items-center gap-1 rounded-xl border p-1">
          {[
            { value: 'grille', Icon: LayoutGrid, label: 'Grille' },
            { value: 'liste', Icon: List, label: 'Liste' },
            { value: 'carte', Icon: Map, label: 'Carte' },
          ].map(({ value, Icon, label }) => (
            <Link
              key={value}
              href={
                `/recherche?${new URLSearchParams({ ...searchParams, vue: value } as Record<string, string>).toString()}` as Route
              }
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-all duration-300 ${
                view === value
                  ? 'text-navy bg-white shadow-sm'
                  : 'text-charcoal-400 hover:text-charcoal'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden md:inline">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-charcoal-50 h-[400px] animate-pulse rounded-2xl" />
            ))}
          </motion.div>
        ) : view === 'carte' ? (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-charcoal-100 overflow-hidden rounded-3xl border shadow-xl"
          >
            <MapView properties={mapProperties} className="h-[700px]" />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={
              view === 'liste'
                ? 'flex flex-col gap-6'
                : 'grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3'
            }
          >
            {results.length > 0 ? (
              results.map((property) => (
                <Link
                  key={property.id}
                  href={`/proprietes/${property.slug}` as Route}
                  className="block"
                >
                  <PropertyCard property={property} />
                </Link>
              ))
            ) : (
              <div className="bg-charcoal-50/50 border-charcoal-100 col-span-full flex flex-col items-center justify-center gap-6 rounded-[40px] border-2 border-dashed py-32">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
                  <SearchIcon className="text-charcoal-200 h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-charcoal mb-2 text-xl font-bold">Aucun résultat trouvé</h3>
                  <p className="text-charcoal-400 mx-auto max-w-xs text-sm">
                    Essayez d'élargir vos critères de recherche pour trouver plus de propriétés.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
