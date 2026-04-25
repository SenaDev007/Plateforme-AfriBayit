'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PropertyCard, PropertyCardSkeleton } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { api } from '@/lib/api';

interface FavoriteRecord {
  id: string;
  property: {
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
    images: Array<{ url: string; isPrimary?: boolean }>;
  };
}

function toCardData(fav: FavoriteRecord): PropertyCardData {
  const p = fav.property;
  const primaryImage = p.images.find((img) => img.isPrimary) ?? p.images[0];
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
    imageUrl: primaryImage?.url ?? '',
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
  };
}

export default function FavoritesPage(): React.ReactElement {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<PropertyCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.accessToken) {
      setLoading(false);
      return;
    }
    api.users
      .getFavorites(session.accessToken as string)
      .then((res) => {
        const records = res.data as FavoriteRecord[];
        setFavorites(records.map(toCardData));
      })
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-charcoal font-serif text-2xl font-bold">Mes favoris</h1>
          <p className="text-charcoal-400 mt-1">
            {loading ? '…' : `${favorites.length} propriété(s) sauvegardée(s)`}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="border-charcoal-100 rounded-xl border bg-white p-12 text-center">
            <p className="mb-3 text-4xl" aria-hidden="true">
              🤍
            </p>
            <p className="text-charcoal font-semibold">Aucun favori pour l&apos;instant</p>
            <p className="text-charcoal-400 mt-1 text-sm">
              Explorez les propriétés et cliquez sur le cœur pour les sauvegarder ici.
            </p>
            <Link
              href="/recherche"
              className="bg-navy hover:bg-navy/90 mt-4 inline-block rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              Explorer les propriétés
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favorites.map((property) => (
              <Link
                key={property.id}
                href={`/proprietes/${property.slug}` as Route}
                className="block"
              >
                <PropertyCard property={property} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
