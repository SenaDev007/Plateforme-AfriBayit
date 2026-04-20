import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArtisansList } from '@/components/artisans/ArtisansList';
import { ArtisansFilters } from '@/components/artisans/ArtisansFilters';
import { Skeleton } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Artisans & Services',
  description: 'Trouvez des artisans qualifiés pour vos travaux en Afrique de l\'Ouest — maçons, électriciens, plombiers, peintres.',
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ArtisansPage({ searchParams }: Props): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-charcoal-50">
      <section className="bg-gradient-to-br from-emerald/90 to-navy py-16 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-gold uppercase tracking-widest mb-3">Artisans & Services</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Des artisans qualifiés près de chez vous
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto">
            Plombiers, électriciens, maçons, peintres — tous vérifiés KYC et notés par la communauté.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-72 flex-shrink-0">
            <ArtisansFilters initialParams={params} />
          </aside>
          <main className="flex-1 min-w-0">
            <Suspense fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
              </div>
            }>
              <ArtisansList searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
