'use client';
import { motion } from 'framer-motion';
import { Sparkles, Grid, Map } from 'lucide-react';
import { Badge } from '@afribayit/ui';

interface Props {
  params: {
    but?: string;
  };
}

export function SearchHeader({ params }: Props) {
  return (
    <header className="bg-navy relative overflow-hidden pb-32 pt-40">
      {/* Spatial background elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-gold/15 absolute right-[-10%] top-[-10%] h-[700px] w-[700px] animate-pulse rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-white/5 blur-[100px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-[0.04] [background-size:40px_40px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-8"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="text-gold border-gold/30 bg-gold/5 inline-flex items-center gap-3 rounded-full border px-6 py-2 text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-xl">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
              Catalogue Certifié (V3.0)
            </div>
            <Badge
              variant="outline"
              className="border-white/20 px-4 font-bold tracking-widest text-white/60"
            >
              {params.but === 'RENT' ? 'LOCATION' : 'VENTE'}
            </Badge>
          </div>

          <h1 className="max-w-4xl font-serif text-5xl font-bold leading-[1.1] tracking-tight text-white md:text-8xl">
            Trouvez votre <span className="text-gold italic">place</span> dans le monde.
          </h1>

          <div className="flex items-center gap-10">
            <p className="border-gold/30 max-w-xl border-l pl-8 text-lg font-light leading-relaxed text-white/50">
              Chaque annonce sur AfriBayit est authentifiée par notre IA Rebecca et certifiée par
              nos partenaires fonciers locaux. La sécurité, sans compromis.
            </p>
            <div className="hidden items-center gap-6 lg:flex">
              <div className="hover:text-gold hover:border-gold flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/40 transition-all">
                <Grid className="h-5 w-5" />
              </div>
              <div className="hover:text-gold hover:border-gold flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-white/10 text-white/40 transition-all">
                <Map className="h-5 w-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
