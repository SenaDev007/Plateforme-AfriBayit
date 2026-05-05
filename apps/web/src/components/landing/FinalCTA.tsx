'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

export function FinalCTA(): React.ReactElement {
  return (
    <section className="bg-navy relative overflow-hidden py-32">
      {/* Decorative gradient overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-50 mix-blend-overlay">
        <div className="from-gold/20 via-navy/5 absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] to-transparent blur-3xl" />
      </div>

      {/* Gold top border line */}
      <div className="bg-gold/30 absolute inset-x-0 top-0 mx-auto h-px max-w-7xl" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="mb-6 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            L'immobilier africain change. <br />
            <span className="text-gold italic">Vous pouvez regarder. Ou en faire partie.</span>
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-white/80">
            Rejoignez les milliers d'acheteurs, vendeurs et professionnels qui font confiance à
            AfriBayit pour chaque transaction. Inscription gratuite. Aucune carte requise.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <a
              href="/recherche"
              className="bg-gold text-navy shadow-gold/20 group relative inline-flex items-center justify-center overflow-hidden rounded-full px-10 py-5 font-bold shadow-lg transition-all hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Trouver mon bien
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
            <a
              href="/publier"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-transparent px-10 py-5 font-bold text-white transition-all hover:border-white hover:bg-white/5"
            >
              Publier une annonce
            </a>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 text-sm font-medium text-white/60 sm:flex-row">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-gold h-4 w-4" />
              Aucune commission à l'inscription
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-gold h-4 w-4" />
              Vérification gratuite
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="text-gold h-4 w-4" />
              Données sécurisées
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
