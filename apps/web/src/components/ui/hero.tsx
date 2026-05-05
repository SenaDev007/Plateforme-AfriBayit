'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SearchBar } from '@afribayit/ui';
import { Shield, CheckCircle, Globe } from 'lucide-react';
import { CountrySelector } from '@/components/navigation/CountrySelector';

/**
 * Premium Hero Section — Section 2.7 & M1
 * Noir & Or theme with stylized Africa connectivity map.
 */
export default function HeroGlobe() {
  return (
    <section className="bg-navy relative w-full overflow-hidden pb-16 pt-32 text-white antialiased md:pb-24 md:pt-40">
      {/* Decorative Gradients */}
      <div
        className="absolute right-0 top-0 h-1/2 w-1/2"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.1) 0%, rgba(0, 48, 135, 0) 60%)',
        }}
      />
      <div
        className="absolute left-0 top-0 h-1/2 w-1/2 -scale-x-100"
        style={{
          background:
            'radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.1) 0%, rgba(0, 48, 135, 0) 60%)',
        }}
      />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 text-center md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Top Badges Row */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="border-gold/30 bg-gold/10 inline-flex items-center gap-3 rounded-full border px-5 py-2 backdrop-blur-md">
              <span className="bg-gold h-2 w-2 animate-pulse rounded-full" />
              <p className="text-gold text-caption-mobile md:text-caption-desktop font-sans font-bold uppercase tracking-[0.3em]">
                L&apos;EXCELLENCE IMMOBILIÈRE EN AFRIQUE
              </p>
            </div>
            <CountrySelector />
          </div>

          <h1 className="text-hero-mobile md:text-hero-desktop mx-auto mb-8 max-w-5xl font-serif font-bold tracking-tight text-white">
            L&apos;Immobilier <br />
            <span className="text-gold italic">Réinventé.</span>
          </h1>

          <p className="text-body-mobile md:text-body-desktop mx-auto mb-12 max-w-2xl font-sans font-light leading-relaxed text-white/60">
            Découvrez la première super-app immobilière africaine ultra-sécurisée. Investissez avec
            la confiance du séquestre inviolable et de la blockchain.
          </p>

          {/* Integrated Search Bar — Section M1 */}
          <div className="shadow-glass-lg backdrop-blur-glass mx-auto mb-12 max-w-3xl transform rounded-[32px] border border-white/10 bg-white/5 p-2 transition-all duration-500 hover:border-white/20 hover:bg-white/10 md:rounded-[40px] md:p-3">
            <SearchBar onSearch={() => {}} variant="hero" />
          </div>

          <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Link
              href="/recherche"
              as
              any
              className="neumorphic-button rounded-pill border-gold/30 bg-navy text-caption-mobile md:text-caption-desktop shadow-gold hover:border-gold/50 group relative w-full overflow-hidden border px-10 py-5 font-sans font-bold uppercase tracking-widest text-white transition-all duration-300 sm:w-auto"
            >
              Explorer le Catalogue
            </Link>
            <a
              href="#securite"
              className="text-caption-mobile md:text-caption-desktop flex w-full items-center justify-center gap-3 font-sans font-bold uppercase tracking-widest text-white/70 transition-colors hover:text-white sm:w-auto"
            >
              <span>Notre Technologie</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </a>
          </div>
        </motion.div>

        {/* Africa Connectivity Map Illustration */}
        <motion.div
          className="relative mt-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        >
          <div className="relative mx-auto flex h-64 w-full max-w-4xl items-center justify-center overflow-hidden md:h-96">
            {/* Africa Map Overlay (Custom Vector-like effect) */}
            <div className="absolute inset-0 z-0 opacity-20 grayscale transition-all duration-1000 hover:opacity-40 hover:grayscale-0">
              <Image
                src="https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?q=80&w=2000&auto=format&fit=crop"
                alt="African Landscape"
                fill
                className="object-cover"
              />
            </div>

            {/* The "Globe3D" replacement: African Map with connectivity */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="relative h-64 w-64 md:h-80 md:w-80">
                <div className="bg-gold/10 absolute inset-0 animate-pulse rounded-full blur-3xl" />
                <Globe className="text-gold h-full w-full opacity-20" strokeWidth={0.5} />
                {/* Visual Representation of Connectivity */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="text-gold h-20 w-20 animate-bounce" strokeWidth={1} />
                </div>
              </div>
              <p className="text-gold mt-6 text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">
                AFRICA CONNECTED REAL ESTATE NETWORK
              </p>
            </div>
          </div>

          {/* Dashboard Preview Overlay */}
          <div className="relative z-20 mx-auto -mt-20 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-1 shadow-[0_0_80px_rgba(212,175,55,0.15)] backdrop-blur-3xl md:-mt-32">
            <div className="overflow-hidden rounded-[22px]">
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1920&auto=format&fit=crop"
                alt="AfriBayit Dashboard Preview"
                width={1920}
                height={1080}
                className="h-auto w-full opacity-90 transition-transform duration-700 hover:scale-[1.02]"
                priority
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <div className="from-gold h-24 w-[1px] animate-pulse bg-gradient-to-b to-transparent opacity-40" />
      </div>
    </section>
  );
}
