import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import { SearchFilters } from '@/components/search/SearchFilters';
import { PropertyCardSkeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';

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

      <header className="bg-navy relative overflow-hidden pb-24 pt-36">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/10 absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-white/5 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="text-gold inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="bg-gold absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                <span className="bg-gold relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              100% des biens vérifiés
            </div>

            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Découvrez des <span className="text-gold italic">propriétés d'exception</span>
            </h1>

            <p className="max-w-2xl text-base font-light leading-relaxed text-white/80 md:text-lg">
              Explorez notre catalogue rigoureusement sélectionné et vérifié. Chaque propriété passe
              par notre processus strict de conformité foncière au Bénin, en Côte d'Ivoire, au
              Sénégal et au Togo.
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

      <SiteFooter />
    </div>
  );
}
