import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HotelsList } from '@/components/hotels/HotelsList';
import { HotelsFilters } from '@/components/hotels/HotelsFilters';
import { Skeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { cn } from '@afribayit/ui/src/lib/cn';
import { Badge, Button } from '@afribayit/ui';
import { ShieldCheck, Star, CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hôtels & Séjours | AfriBayit',
  description:
    "Réservez des hôtels et hébergements certifiés en Afrique de l'Ouest — Bénin, Côte d'Ivoire, Sénégal et Togo. Paiement Mobile Money. Annulation flexible.",
};

interface HotelsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

import { HotelsHeader } from '@/components/hotels/HotelsHeader';

export default async function HotelsPage({
  searchParams,
}: HotelsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="selection:bg-gold selection:text-navy min-h-screen bg-white">
      <SiteNavbar />
      <HotelsHeader />

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

      <SiteFooter />
    </div>
  );
}
