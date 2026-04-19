import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PropertyCard, PropertyCardSkeleton } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Mes favoris', robots: { index: false } };

// Mock data — replace with real API call using user session
const MOCK_FAVORITES: PropertyCardData[] = [
  {
    id: '1', slug: 'villa-cocotiers-cotonou', title: 'Villa Les Cocotiers', city: 'Cotonou',
    country: 'Bénin', price: 85000000, currency: 'XOF', bedrooms: 4, bathrooms: 3, surface: 350,
    purpose: 'SALE', type: 'VILLA', imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80',
    isVerified: true, isFeatured: true,
  },
  {
    id: '2', slug: 'appart-riviera-abidjan', title: 'Appartement Riviera Golf', city: 'Abidjan',
    country: "Côte d'Ivoire", price: 280000, currency: 'XOF', bedrooms: 3, bathrooms: 2, surface: 110,
    purpose: 'RENT', type: 'APARTMENT', imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
    isVerified: true,
  },
];

function FavoritesGrid(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {MOCK_FAVORITES.map((property) => (
        <a key={property.id} href={`/proprietes/${property.slug}`} className="block">
          <PropertyCard property={property} />
        </a>
      ))}
    </div>
  );
}

export default function FavoritesPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-charcoal">Mes favoris</h1>
          <p className="text-charcoal-400 mt-1">{MOCK_FAVORITES.length} propriété(s) sauvegardée(s)</p>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
          </div>
        }>
          <FavoritesGrid />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
