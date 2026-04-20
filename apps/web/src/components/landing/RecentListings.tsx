import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PropertyCard, PropertyCardSkeleton } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';

// In production, this would be a server component fetching from the API
const MOCK_LISTINGS: PropertyCardData[] = [
  {
    id: '1',
    slug: 'villa-cocotiers-cotonou',
    title: 'Villa Les Cocotiers',
    city: 'Cotonou',
    country: 'Bénin',
    price: 85000000,
    currency: 'XOF',
    bedrooms: 4,
    bathrooms: 3,
    surface: 350,
    purpose: 'SALE',
    type: 'VILLA',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80',
    isVerified: true,
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'appart-riviera-abidjan',
    title: 'Appartement Riviera Golf',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    price: 280000,
    currency: 'XOF',
    bedrooms: 3,
    bathrooms: 2,
    surface: 110,
    purpose: 'RENT',
    type: 'APARTMENT',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80',
    isVerified: true,
  },
  {
    id: '3',
    slug: 'terrain-ouagadougou-sud',
    title: 'Terrain viabilisé — Secteur 15',
    city: 'Ouagadougou',
    country: 'Burkina Faso',
    price: 12000000,
    currency: 'XOF',
    surface: 600,
    purpose: 'SALE',
    type: 'LAND',
    imageUrl: 'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80',
    isVerified: false,
  },
  {
    id: '4',
    slug: 'studio-lome-baguida',
    title: 'Studio meublé Baguida',
    city: 'Lomé',
    country: 'Togo',
    price: 85000,
    currency: 'XOF',
    bedrooms: 1,
    bathrooms: 1,
    surface: 45,
    purpose: 'SHORT_TERM_RENT',
    type: 'STUDIO',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80',
    isVerified: true,
  },
  {
    id: '5',
    slug: 'duplex-porto-novo',
    title: 'Duplex moderne Porto-Novo',
    city: 'Porto-Novo',
    country: 'Bénin',
    price: 45000000,
    currency: 'XOF',
    bedrooms: 5,
    bathrooms: 3,
    surface: 280,
    purpose: 'SALE',
    type: 'DUPLEX',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
    isVerified: true,
    isFeatured: true,
  },
  {
    id: '6',
    slug: 'villa-bassam',
    title: 'Villa Grand-Bassam Bord de Mer',
    city: 'Grand-Bassam',
    country: 'Côte d\'Ivoire',
    price: 120000000,
    currency: 'XOF',
    bedrooms: 6,
    bathrooms: 4,
    surface: 500,
    purpose: 'SALE',
    type: 'VILLA',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80',
    isVerified: true,
    isFeatured: true,
  },
];

export async function RecentListings(): Promise<React.ReactElement> {
  // TODO: Replace with real API call
  // const listings = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/properties?limit=6`).then(r => r.json());
  const listings = MOCK_LISTINGS;

  return (
    <section aria-labelledby="recent-listings-title" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm font-medium text-gold uppercase tracking-widest mb-2">
              Nouvelles annonces
            </p>
            <h2 id="recent-listings-title" className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
              Propriétés récentes
            </h2>
          </div>
          <Link
            href="/recherche"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-navy hover:text-navy-600 transition-colors"
          >
            Voir toutes les annonces
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((property) => (
            <Link key={property.id} href={`/proprietes/${property.slug}` as Route} className="block">
              <PropertyCard property={property} />
            </Link>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/recherche"
            className="inline-flex items-center gap-2 text-sm font-medium text-navy border border-navy rounded-pill px-6 py-2.5 hover:bg-navy/5 transition-colors"
          >
            Voir toutes les annonces
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
