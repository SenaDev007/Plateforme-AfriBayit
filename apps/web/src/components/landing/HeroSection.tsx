'use client';
import type React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SearchBar } from '@afribayit/ui';
import { Shield, CheckCircle, Globe } from 'lucide-react';

const HERO_BG =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop'; // Darker, moody modern mansion

export function HeroSection(): React.ReactElement {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  return (
    <section className="bg-navy relative h-[110vh] min-h-[800px] w-full overflow-hidden">
      {/* Background with Parallax */}
      <motion.div style={{ y: y1, scale }} className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="Luxury Real Estate"
          className="h-full w-full object-cover opacity-50 transition-opacity duration-1000"
        />
        {/* Darker premium overlay */}
        <div className="from-navy/90 via-navy/60 to-navy absolute inset-0 bg-gradient-to-b" />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 pt-32 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl"
        >
          <div className="border-gold/30 bg-gold/10 mb-6 inline-flex items-center gap-3 rounded-full border px-5 py-2 backdrop-blur-md">
            <span className="bg-gold h-2 w-2 animate-pulse rounded-full" />
            <p className="text-gold text-[11px] font-bold uppercase tracking-[0.3em]">
              L'excellence immobilière en Afrique
            </p>
          </div>

          <h1 className="mb-8 font-sans text-5xl font-extrabold tracking-tighter text-white md:text-7xl lg:text-8xl xl:text-[7rem] xl:leading-[0.95]">
            L'Immobilier <br />
            <span className="text-gold font-serif italic tracking-normal">Réinventé.</span>
          </h1>
          <p className="mx-auto mb-16 max-w-2xl text-lg font-light leading-relaxed text-white/70 md:text-xl">
            Découvrez une nouvelle ère de confiance. Transactions sécurisées par séquestre,
            vérifications par drone et transparence blockchain.
          </p>

          {/* Minimal Search Bar Container */}
          <div className="mx-auto w-full max-w-4xl transform rounded-[40px] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/10">
            <SearchBar onSearch={() => {}} variant="hero" />
          </div>
        </motion.div>

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-6 md:gap-12"
        >
          {[
            { icon: Shield, label: 'Escrow Sécurisé' },
            { icon: CheckCircle, label: 'KYC Vérifié' },
            { icon: Globe, label: 'Standard International' },
          ].map((item, i) => (
            <div
              key={i}
              className="hover:text-gold group flex items-center gap-3 text-white/50 transition-colors"
            >
              <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="from-gold h-20 w-[2px] animate-pulse bg-gradient-to-b to-transparent opacity-60" />
      </div>
    </section>
  );
}
