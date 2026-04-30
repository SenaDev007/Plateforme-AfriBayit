import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';
import { PropertyCardSkeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Recherche de propriétés',
  description:
    "Trouvez votre bien immobilier idéal en Afrique de l'Ouest. Filtrez par ville, prix, surface et type.",
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    ville?: string;
    but?: string;
    type?: string;
    prixMin?: string;
    prixMax?: string;
    surfaceMin?: string;
    surfaceMax?: string;
    chambres?: string;
    page?: string;
    vue?: 'grille' | 'liste' | 'carte';
  }>;
}

function SearchSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <SiteNavbar />

      <header className="bg-navy pb-16 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
              Découvrez des <span className="text-gold italic">propriétés d'exception</span>
            </h1>
            <p className="max-w-xl text-sm font-light text-white/60 md:text-base">
              Explorez notre catalogue rigoureusement sélectionné et vérifié à travers le Bénin, la
              Côte d'Ivoire, le Burkina Faso et le Togo.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 py-12 lg:flex-row">
          {/* Sidebar filters */}
          <aside className="w-full flex-shrink-0 lg:w-80" aria-label="Filtres de recherche">
            <div className="sticky top-24">
              <SearchFilters initialParams={params} />
            </div>
          </aside>

          {/* Results */}
          <main className="min-w-0 flex-1" id="main-content">
            <Suspense fallback={<SearchSkeleton />}>
              <SearchResults searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
