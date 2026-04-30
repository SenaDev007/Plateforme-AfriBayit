'use client';
import type React from 'react';
import type { Route } from 'next';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@afribayit/ui';

// High-quality African luxury real estate image
const HERO_BG =
  'https://images.unsplash.com/photo-1613490908574-dbf2638ce8e6?q=80&w=2000&auto=format&fit=crop';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroSection(): React.ReactElement {
  const router = useRouter();

  const handleSearch = (params: {
    query: string;
    city: string;
    purpose: string;
    type: string;
  }): void => {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('q', params.query);
    if (params.city) searchParams.set('ville', params.city);
    if (params.purpose) searchParams.set('but', params.purpose);
    if (params.type) searchParams.set('type', params.type);
    router.push(`/recherche?${searchParams.toString()}` as Route);
  };

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Bannière principale"
      className="bg-navy relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Cinematic Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 15, ease: 'easeOut' }}
          src={HERO_BG}
          alt="Luxury African Real Estate"
          className="h-full w-full object-cover"
        />
        {/* Overlay Gradients for readability */}
        <div className="from-navy-900/70 via-navy-900/50 to-charcoal-900/90 absolute inset-0 bg-gradient-to-b" />
      </div>

      <div className="relative z-10 mx-auto mt-20 flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex w-full max-w-4xl flex-col items-center gap-8"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <span className="rounded-pill border-gold/30 bg-gold/10 text-gold shadow-glass inline-flex items-center gap-2 border px-5 py-2 text-sm font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="bg-gold absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
                <span className="bg-gold relative inline-flex h-2 w-2 rounded-full"></span>
              </span>
              L'expérience immobilière de référence en Afrique
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[80px]"
          >
            Trouvez votre place <br className="hidden sm:block" />
            sous le soleil <span className="text-gradient-gold pr-2 italic">d'Afrique</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-balance text-lg font-light leading-relaxed text-white/80 md:text-xl"
          >
            Achetez, vendez et louez des biens d'exception avec notre système d'escrow sécurisé. De
            Dakar à Abidjan, votre sérénité est notre priorité.
          </motion.p>

          {/* Search bar */}
          <motion.div variants={itemVariants} className="mt-6 w-full">
            <SearchBar onSearch={handleSearch} variant="hero" />
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {[
              { label: 'Paiement Sécurisé Escrow', icon: '🔒' },
              { label: 'Profils Vérifiés KYC', icon: '✓' },
              { label: 'Assistance Juridique', icon: '⚖️' },
            ].map((badge) => (
              <div
                key={badge.label}
                className="rounded-pill flex items-center gap-2 border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm"
              >
                <span aria-hidden="true" className="text-gold">
                  {badge.icon}
                </span>
                {badge.label}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToNext}
        className="group absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-3 focus-visible:outline-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        aria-label="Défiler vers le bas"
      >
        <span className="group-hover:text-gold text-xs font-medium uppercase tracking-widest text-white/50 transition-colors duration-300">
          Découvrir
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="group-hover:border-gold/50 flex h-12 w-7 items-start justify-center rounded-full border-2 border-white/20 pt-2 backdrop-blur-sm transition-colors duration-300">
            <div className="bg-gold h-2 w-1 rounded-full" />
          </div>
        </motion.div>
      </motion.button>
    </section>
  );
}
