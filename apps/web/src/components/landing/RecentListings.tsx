import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';

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
    ...(primaryImage?.url ? { imageUrl: primaryImage.url } : {}),
    isVerified: p.isVerified,
    isFeatured: p.isFeatured,
  };
}

export async function RecentListings(): Promise<React.ReactElement | null> {
  let listings: PropertyCardData[] = [];

  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/properties?limit=6`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = (await res.json()) as { data: ApiProperty[]; total: number };
      listings = (data.data ?? []).map(toCardData);
    }
  } catch {
    // API unavailable — section hidden gracefully
  }

  if (listings.length === 0) return null;

  return (
    <section aria-labelledby="recent-listings-title" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-gold mb-2 text-sm font-medium uppercase tracking-widest">
              Nouvelles annonces
            </p>
            <h2
              id="recent-listings-title"
              className="text-charcoal font-serif text-3xl font-bold sm:text-4xl"
            >
              Propriétés récentes
            </h2>
          </div>
          <Link
            href="/recherche"
            className="text-navy hover:text-navy-600 hidden items-center gap-2 text-sm font-medium transition-colors sm:flex"
          >
            Voir toutes les annonces
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((property) => (
            <Link
              key={property.id}
              href={`/proprietes/${property.slug}` as Route}
              className="block"
            >
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/recherche"
            className="text-navy border-navy rounded-pill hover:bg-navy/5 inline-flex items-center gap-2 border px-6 py-2.5 text-sm font-medium transition-colors"
          >
            Voir toutes les annonces
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
