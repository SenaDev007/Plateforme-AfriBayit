import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';
import { PropertyCardSkeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { cn } from '@afribayit/ui/src/lib/cn';
import { Badge } from '@afribayit/ui';
import { Sparkles, Map, Grid, List } from 'lucide-react';

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

import { SearchHeader } from '@/components/search/SearchHeader';

export default async function SearchPage({
  searchParams,
}: SearchPageProps): Promise<React.ReactElement> {
  const params = await searchParams;

  return (
    <div className="selection:bg-gold selection:text-navy min-h-screen bg-[#FDFDFD]">
      <SiteNavbar />
      <SearchHeader params={params} />

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

      <SiteFooter />
    </div>
  );
}
