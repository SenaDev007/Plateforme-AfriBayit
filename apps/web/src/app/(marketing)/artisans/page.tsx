import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ArtisansList } from '@/components/artisans/ArtisansList';
import { ArtisansFilters } from '@/components/artisans/ArtisansFilters';
import { Skeleton } from '@afribayit/ui';
import { ShieldCheck, Star, Clock } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';

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
              <ShieldCheck className="text-gold h-4 w-4" />
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                KYC · Évalués · Certifiés AfriBayit
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-6xl">
              Des artisans <span className="text-gold italic">vérifiés</span> pour vos travaux
            </h1>
            <p className="max-w-2xl text-base font-light leading-relaxed text-white/80">
              Plombiers, électriciens, maçons, architectes — chaque professionnel est vérifié KYC,
              évalué par la communauté et certifié AfriBayit. Devis en 3 clics, paiement sécurisé.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: ShieldCheck, label: 'Identité vérifiée' },
                { icon: Star, label: 'Noté par la communauté' },
                { icon: Clock, label: 'Devis sous 24h' },
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
