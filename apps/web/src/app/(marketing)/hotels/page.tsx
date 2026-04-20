import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HotelsList } from '@/components/hotels/HotelsList';
import { HotelsFilters } from '@/components/hotels/HotelsFilters';
import { Skeleton } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Hôtels & Hébergements',
  description: 'Réservez des hôtels et hébergements en Afrique de l\'Ouest — Bénin, Côte d\'Ivoire, Burkina Faso, Togo.',
};

interface HotelsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function HotelsPage({ searchParams }: HotelsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy to-navy/80 py-16 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-gold uppercase tracking-widest mb-3">Hôtels & Hébergements</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Séjournez en toute sérénité
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Des hôtels et résidences vérifiés dans toute l'Afrique de l'Ouest, réservables instantanément.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <HotelsFilters initialParams={params} />
          </aside>
          <main className="flex-1 min-w-0">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            }>
              <HotelsList searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
