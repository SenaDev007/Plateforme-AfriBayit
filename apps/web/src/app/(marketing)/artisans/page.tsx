import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArtisansList } from '@/components/artisans/ArtisansList';
import { ArtisansFilters } from '@/components/artisans/ArtisansFilters';
import { Skeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { cn } from '@afribayit/ui/src/lib/cn';
import { Badge, Button } from '@afribayit/ui';
import { ShieldCheck, Star, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Artisans & Services',
  description:
    "Trouvez des artisans qualifiés pour vos travaux en Afrique de l'Ouest — maçons, électriciens, plombiers, peintres.",
};

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

import { ArtisansHeader } from '@/components/artisans/ArtisansHeader';

export default async function ArtisansPage({ searchParams }: Props): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="selection:bg-gold selection:text-navy min-h-screen bg-white">
      <SiteNavbar />
      <ArtisansHeader />

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

      <SiteFooter />
    </div>
  );
}
