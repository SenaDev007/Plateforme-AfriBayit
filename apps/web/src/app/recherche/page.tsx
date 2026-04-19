import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';
import { PropertyCardSkeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';

export const metadata: Metadata = {
  title: 'Recherche de propriétés',
  description: 'Trouvez votre bien immobilier idéal en Afrique de l\'Ouest. Filtrez par ville, prix, surface et type.',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 9 }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-charcoal-50">
      <SiteNavbar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex flex-col lg:flex-row gap-6 py-8">
          {/* Sidebar filters */}
          <aside
            className="w-full lg:w-72 flex-shrink-0"
            aria-label="Filtres de recherche"
          >
            <SearchFilters initialParams={params} />
          </aside>

          {/* Results */}
          <main className="flex-1 min-w-0" id="main-content">
            <Suspense fallback={<SearchSkeleton />}>
              <SearchResults searchParams={params} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
