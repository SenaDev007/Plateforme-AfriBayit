import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HotelsList } from '@/components/hotels/HotelsList';
import { HotelsFilters } from '@/components/hotels/HotelsFilters';
import { Skeleton } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Hôtels & Hébergements',
  description:
    "Réservez des hôtels et hébergements en Afrique de l'Ouest — Bénin, Côte d'Ivoire, Burkina Faso, Togo.",
};

interface HotelsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function HotelsPage({
  searchParams,
}: HotelsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <header className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="text-gold mb-2 text-sm font-bold uppercase tracking-[0.2em]">
              Hôtels & Résidences
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Séjournez avec <span className="text-gold italic">élégance</span> en Afrique
            </h1>
            <p className="max-w-xl text-sm font-light text-white/60 md:text-base">
              Une sélection exclusive d'hôtels et résidences de standing à travers l'Afrique de
              l'Ouest, réservables instantanément avec votre portefeuille AfriBayit.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="flex-shrink-0 lg:w-80">
            <div className="sticky top-24">
              <HotelsFilters initialParams={params} />
            </div>
          </aside>
          <main className="min-w-0 flex-1">
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-3xl" />
                  ))}
                </div>
              }
            >
              <HotelsList searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
