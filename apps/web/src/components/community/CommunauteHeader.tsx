'use client';
import { motion } from 'framer-motion';
import { Globe, Plus } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import Link from 'next/link';
import type { Route } from 'next';

export function CommunauteHeader() {
  return (
    <header className="bg-navy relative flex min-h-[70vh] flex-col justify-center overflow-hidden">
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
              <Globe className="h-3.5 w-3.5" />
              Intelligence Collective
            </div>
            <Badge variant="outline" className="border-white/20 px-4 font-bold text-white/40">
              15K+ MEMBRES
            </Badge>
          </div>

          <h1 className="max-w-6xl font-serif text-6xl font-bold leading-[1.05] tracking-tight text-white md:text-[100px] lg:text-[120px]">
            Bâtissons <span className="text-gold italic">ensemble</span> l'immobilier
            <br />
            de demain.
          </h1>

          <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-end">
            <p className="border-gold/30 max-w-2xl border-l pl-8 text-xl font-light leading-relaxed text-white/50">
              Le plus grand réseau d'experts, d'investisseurs et d'artisans d'Afrique de l'Ouest.
              Partagez votre vision, trouvez des solutions certifiées.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link href={'/communaute/nouveau' as Route}>
                <Button
                  variant="gold"
                  size="lg"
                  className="shadow-gold/20 flex h-16 items-center gap-3 rounded-full px-12 text-sm font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105"
                >
                  <Plus className="h-5 w-5" />
                  CRÉER UNE DISCUSSION
                </Button>
              </Link>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-navy bg-charcoal-800 h-14 w-14 rounded-full border-4 shadow-xl"
                  />
                ))}
                <div className="border-navy bg-gold flex h-14 w-14 items-center justify-center rounded-full border-4 text-xs font-black shadow-xl">
                  +15k
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
