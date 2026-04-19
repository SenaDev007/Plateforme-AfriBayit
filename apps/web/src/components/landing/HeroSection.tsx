'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SearchBar } from '@afribayit/ui';
import { PropertyCard } from '@afribayit/ui';
import type { PropertyCardData } from '@afribayit/ui';

const HERO_PROPERTIES: PropertyCardData[] = [
  {
    id: '1',
    slug: 'villa-cocotiers-cotonou',
    title: 'Villa Les Cocotiers',
    city: 'Cotonou',
    country: 'Bénin',
    price: 85000000,
    currency: 'XOF',
    bedrooms: 4,
    bathrooms: 3,
    surface: 350,
    purpose: 'SALE',
    type: 'VILLA',
    imageUrl: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400&q=80',
    isVerified: true,
    isFeatured: true,
  },
  {
    id: '2',
    slug: 'appart-cocody-abidjan',
    title: 'Appartement Cocody',
    city: 'Abidjan',
    country: 'Côte d\'Ivoire',
    price: 350000,
    currency: 'XOF',
    bedrooms: 3,
    bathrooms: 2,
    surface: 120,
    purpose: 'RENT',
    type: 'APARTMENT',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=80',
    isVerified: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroSection(): React.ReactElement {
  const router = useRouter();

  const handleSearch = (params: { query: string; city: string; purpose: string; type: string }): void => {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.set('q', params.query);
    if (params.city) searchParams.set('ville', params.city);
    if (params.purpose) searchParams.set('but', params.purpose);
    if (params.type) searchParams.set('type', params.type);
    router.push(`/recherche?${searchParams.toString()}`);
  };

  return (
    <section
      aria-label="Bannière principale"
      className="relative min-h-screen bg-hero flex items-center overflow-hidden pt-16"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-1/4 -right-1/4 h-[800px] w-[800px] rounded-full bg-sky/10 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Copy + Search */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-6"
          >
            {/* Eyebrow */}
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-pill bg-gold/20 px-4 py-1.5 text-sm font-medium text-gold">
                🌍 Disponible au Bénin, CI, BF & Togo
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                L'immobilier africain,{' '}
                <span className="text-gradient-gold">simplifié</span>
              </h1>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-white/70 max-w-lg leading-relaxed"
            >
              Achetez, vendez ou louez en toute confiance. Notre système d'escrow sécurisé
              protège chaque transaction au FCFA ou en devises internationales.
            </motion.p>

            {/* Trust badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
              {['✓ KYC vérifié', '✓ Escrow sécurisé', '✓ Mobile Money'].map((badge) => (
                <span key={badge} className="text-sm text-white/60 flex items-center gap-1">
                  {badge}
                </span>
              ))}
            </motion.div>

            {/* Search bar */}
            <motion.div variants={itemVariants} className="w-full max-w-2xl">
              <SearchBar onSearch={handleSearch} />
            </motion.div>
          </motion.div>

          {/* Right — Floating property cards */}
          <div className="hidden lg:flex flex-col gap-4 items-end">
            {HERO_PROPERTIES.map((property, index) => (
              <motion.div
                key={property.id}
                className="w-72"
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 6,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: index * 2,
                }}
                style={{ willChange: 'transform' }}
              >
                <PropertyCard property={property} compact />
              </motion.div>
            ))}

            {/* Map preview badge */}
            <motion.div
              className="glass rounded-xl p-4 flex items-center gap-3 w-72"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald/20">
                <span className="text-xl" aria-hidden="true">📍</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-charcoal">2 847 propriétés</p>
                <p className="text-xs text-charcoal-400">actives sur la carte</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="h-10 w-6 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="h-2 w-1 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
