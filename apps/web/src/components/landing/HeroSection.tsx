'use client';
import type React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SearchBar } from '@afribayit/ui';
import { Shield, CheckCircle, Globe } from 'lucide-react';

const HERO_BG =
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop';

export function HeroSection(): React.ReactElement {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 1.05]);

  return (
    <section className="bg-charcoal-950 relative h-[120vh] w-full overflow-hidden">
      {/* Background with Parallax */}
      <motion.div style={{ y: y1, scale }} className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="Luxury Real Estate"
          className="h-full w-full object-cover opacity-60 transition-opacity duration-1000"
        />
        <div className="from-charcoal-950/20 via-charcoal-950/40 to-charcoal-950 absolute inset-0 bg-gradient-to-b" />
      </motion.div>

      {/* Main Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-screen flex-col items-center justify-center px-4 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <p className="text-gold-400 mb-6 text-[10px] font-bold uppercase tracking-[0.4em]">
            L'excellence immobilière en Afrique
          </p>
          <h1 className="mb-8 font-serif text-6xl font-medium tracking-tight text-white md:text-8xl lg:text-9xl">
            L'Immobilier <br />
            <span className="text-gold italic">Réinventé.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg font-light leading-relaxed text-white/60 md:text-xl">
            Découvrez une nouvelle ère de confiance. Transactions sécurisées par escrow,
            vérifications par drone et transparence blockchain.
          </p>

          {/* Minimal Search Bar Container */}
          <div className="mx-auto w-full max-w-3xl transform rounded-[40px] border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-2xl transition-all hover:bg-white/10">
            <SearchBar onSearch={() => {}} variant="hero" />
          </div>
        </motion.div>

        {/* Floating Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          {[
            { icon: Shield, label: 'Escrow Sécurisé' },
            { icon: CheckCircle, label: 'KYC Vérifié' },
            { icon: Globe, label: 'Standard International' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white/40">
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <div className="from-gold h-16 w-[1px] animate-pulse bg-gradient-to-b to-transparent" />
      </div>
    </section>
  );
}
