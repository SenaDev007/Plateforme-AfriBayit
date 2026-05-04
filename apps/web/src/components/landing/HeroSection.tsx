'use client';
import type React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SearchBar } from '@afribayit/ui';
import { Shield, CheckCircle, Globe } from 'lucide-react';
import { InteractiveGlobe } from '@/components/visual/InteractiveGlobe';

const HERO_BG =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop'; // Darker, moody modern mansion

export function HeroSection(): React.ReactElement {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  return (
    <section className="bg-navy relative min-h-[100svh] w-full overflow-hidden md:h-[110vh] md:min-h-[800px]">
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
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 pt-24 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:pt-32"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-center lg:text-left"
        >
          <div className="border-gold/30 bg-gold/10 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md md:gap-3 md:px-5 md:py-2">
            <span className="bg-gold h-1.5 w-1.5 animate-pulse rounded-full md:h-2 md:w-2" />
            <p className="text-gold text-[9px] font-bold uppercase tracking-[0.2em] md:text-[11px] md:tracking-[0.3em]">
              L'excellence immobilière en Afrique
            </p>
          </div>

          <h1 className="text-hero-mobile md:text-hero-desktop mb-6 font-sans font-black tracking-tighter text-white md:mb-8">
            L'Immobilier <br />
            <span className="text-gold font-serif italic tracking-normal">Réinventé.</span>
          </h1>
          <p className="mb-12 text-lg font-light leading-relaxed text-white/70 md:text-xl lg:max-w-lg">
            Découvrez une nouvelle ère de confiance. Transactions sécurisées par séquestre,
            vérifications par drone et transparence blockchain.
          </p>

          {/* Minimal Search Bar Container */}
          <div className="transform rounded-[32px] border border-white/10 bg-white/5 p-1.5 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-white/20 hover:bg-white/10 md:rounded-[40px] md:p-2">
            <SearchBar onSearch={() => {}} variant="hero" />
          </div>

          {/* Floating Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-4 md:gap-8 lg:justify-start">
            {[
              { icon: Shield, label: 'Escrow Sécurisé' },
              { icon: CheckCircle, label: 'KYC Vérifié' },
              { icon: Globe, label: 'Standard International' },
            ].map((item, i) => (
              <div
                key={i}
                className="hover:text-gold group flex items-center gap-3 text-white/50 transition-colors"
              >
                <item.icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span className="text-[10px] font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Floating Cards (Desktop Only) */}
        <div className="relative hidden h-[600px] w-full max-w-lg lg:block">
          {/* Central Interactive Globe — Section 3.1.1 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40">
            <InteractiveGlobe />
          </div>

          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-0 top-0 z-20 w-72"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80"
                className="mb-4 h-40 w-full rounded-2xl object-cover"
                alt=""
              />
              <div className="space-y-2">
                <div className="bg-gold h-1.5 w-12 rounded-full" />
                <div className="h-4 w-full rounded-full bg-white/20" />
                <div className="h-4 w-2/3 rounded-full bg-white/10" />
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-20 right-0 z-10 w-72"
          >
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6199f7a096?w=400&q=80"
                className="mb-4 h-40 w-full rounded-2xl object-cover"
                alt=""
              />
              <div className="space-y-2">
                <div className="bg-sky h-1.5 w-12 rounded-full" />
                <div className="h-4 w-full rounded-full bg-white/20" />
                <div className="h-4 w-2/3 rounded-full bg-white/10" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="from-gold h-20 w-[2px] animate-pulse bg-gradient-to-b to-transparent opacity-60" />
      </div>
    </section>
  );
}
