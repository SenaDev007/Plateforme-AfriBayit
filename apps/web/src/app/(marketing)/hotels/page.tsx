import type React from 'react';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HotelsList } from '@/components/hotels/HotelsList';
import { HotelsFilters } from '@/components/hotels/HotelsFilters';
import { Skeleton } from '@afribayit/ui';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { motion } from 'framer-motion';
import { cn } from '@afribayit/ui/src/lib/cn';
import { Badge, Button } from '@afribayit/ui';
import { MapPin, Sparkles } from 'lucide-react';

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
    <div className="selection:bg-gold selection:text-navy min-h-screen bg-white">
      <SiteNavbar />

      <header className="bg-navy relative flex min-h-[80vh] flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/15 absolute right-[-5%] top-[-10%] h-[700px] w-[700px] animate-pulse rounded-full blur-[140px]" />
          <div className="absolute bottom-[-5%] left-[-5%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-[0.05] [background-size:40px_40px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-10"
          >
            <div className="flex items-center gap-4">
              <div className="text-gold border-gold/30 bg-gold/5 inline-flex items-center gap-3 rounded-full border px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5" />
                Collection Signature
              </div>
              <Badge variant="outline" className="border-white/20 px-4 font-bold text-white/40">
                CERTIFIÉ
              </Badge>
            </div>

            <h1 className="max-w-5xl font-serif text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-[100px] lg:text-[120px]">
              L'Afrique de l'Ouest,
              <br />
              version <span className="text-gold italic">exception</span>.
            </h1>

            <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
              <p className="border-gold/30 max-w-2xl border-l pl-8 text-xl font-light leading-relaxed text-white/50">
                Une sélection rigoureuse d'établissements qui redéfinissent l'hospitalité africaine.
                Du boutique-hôtel de charme à Cotonou au resort de luxe à Assinie.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { icon: ShieldCheck, label: 'Audit Qualité' },
                  { icon: CreditCard, label: 'Mobile Money' },
                  { icon: Star, label: '5-Star Concierge' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-bold text-white/80 backdrop-blur-md"
                  >
                    <item.icon className="text-gold h-4 w-4" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
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
