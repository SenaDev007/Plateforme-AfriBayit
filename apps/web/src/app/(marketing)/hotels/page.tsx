import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HotelsList } from '@/components/hotels/HotelsList';
import { HotelsFilters } from '@/components/hotels/HotelsFilters';
import { Skeleton } from '@afribayit/ui';
import { Star, ShieldCheck, CreditCard } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';

export const metadata: Metadata = {
  title: 'Hôtels & Séjours | AfriBayit',
  description:
    "Réservez des hôtels et hébergements certifiés en Afrique de l'Ouest — Bénin, Côte d'Ivoire, Sénégal et Togo. Paiement Mobile Money. Annulation flexible.",
};

interface HotelsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function HotelsPage({
  searchParams,
}: HotelsPageProps): Promise<React.ReactElement> {
  const params = await searchParams;
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <header className="bg-navy relative overflow-hidden pb-24 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/10 absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/3 translate-x-1/3 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/4 translate-y-1/4 rounded-full bg-white/5 blur-[80px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <Star className="text-gold h-4 w-4" />
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                Sélection certifiée · Mobile Money · Annulation flexible
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Séjournez avec <span className="text-gold italic">élégance</span> en Afrique
            </h1>
            <p className="max-w-2xl text-base font-light leading-relaxed text-white/80">
              Hôtels, résidences et guesthouses certifiés AfriBayit à travers l'Afrique de l'Ouest.
              Réservation instantanée, paiement Mobile Money, annulation flexible.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: ShieldCheck, label: 'Établissements vérifiés' },
                { icon: CreditCard, label: 'Mobile Money accepté' },
                { icon: Star, label: 'Notés par nos voyageurs' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80"
                >
                  <item.icon className="text-gold h-4 w-4" />
                  {item.label}
                </div>
              ))}
            </div>
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

      <SiteFooter />
    </div>
  );
}
