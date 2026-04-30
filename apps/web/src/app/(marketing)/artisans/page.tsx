import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArtisansList } from '@/components/artisans/ArtisansList';
import { ArtisansFilters } from '@/components/artisans/ArtisansFilters';
import { Skeleton } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Artisans & Services',
  description:
    "Trouvez des artisans qualifiés pour vos travaux en Afrique de l'Ouest — maçons, électriciens, plombiers, peintres.",
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ArtisansPage({ searchParams }: Props): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <header className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <p className="text-gold mb-2 text-sm font-bold uppercase tracking-[0.2em]">
              Artisans & Expertise
            </p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Des professionnels <span className="text-gold italic">vérifiés</span> pour vos travaux
            </h1>
            <p className="max-w-xl text-sm font-light text-white/60 md:text-base">
              Plombiers, électriciens, maçons, peintres — tous vérifiés KYC et notés par la
              communauté AfriBayit pour garantir la qualité de vos chantiers.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="flex-shrink-0 lg:w-80">
            <div className="sticky top-24">
              <ArtisansFilters initialParams={params} />
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
              <ArtisansList searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
