'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Globe, Zap } from 'lucide-react';

export function FinalCTA(): React.ReactElement {
  return (
    <section className="to-charcoal-50 overflow-hidden bg-gradient-to-b from-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-navy relative overflow-hidden rounded-[48px] p-8 shadow-[0_32px_64px_-16px_rgba(0,48,135,0.4)] md:p-20">
          {/* Background decoration */}
          <div className="bg-gold/10 absolute right-0 top-0 h-full w-1/2 -translate-y-1/3 translate-x-1/3 rounded-full blur-[120px]" />
          <div className="bg-sky/10 absolute bottom-0 left-0 h-full w-1/3 -translate-x-1/4 translate-y-1/4 rounded-full blur-[100px]" />

          <div className="relative z-10 grid items-center gap-16 lg:grid-cols-2">
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-gold/20 text-gold mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest">
                  <Zap className="fill-gold h-3 w-3" />
                  Prêt à commencer ?
                </div>
                <h2 className="font-serif text-4xl font-bold leading-[1.1] text-white md:text-6xl">
                  Sécurisez votre <br />
                  <span className="text-gradient-gold italic">patrimoine</span> aujourd'hui
                </h2>
                <p className="mt-6 max-w-lg text-lg font-light leading-relaxed text-white/70 md:text-xl">
                  Rejoignez des milliers d'utilisateurs qui font confiance à AfriBayit pour leurs
                  transactions immobilières transfrontalières.
                </p>
              </motion.div>

              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gold text-navy hover:bg-gold-400 shadow-gold/20 group flex items-center gap-3 rounded-full px-10 py-5 text-lg font-bold shadow-xl transition-all"
                >
                  Démarrer mon projet
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="rounded-full border border-white/20 bg-white/5 px-10 py-5 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/10"
                >
                  Voir les démos
                </motion.button>
              </div>

              <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-10">
                <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                  <ShieldCheck className="text-gold h-6 w-6" />
                  Transaction Escrow Sécurisée
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-white/60">
                  <Globe className="text-gold h-6 w-6" />
                  Support Multi-Pays 24/7
                </div>
              </div>
            </div>

            {/* App Mockup side */}
            <div className="relative flex justify-center lg:justify-end">
              <motion.div
                className="bg-charcoal-900 border-charcoal-800 relative hidden aspect-[9/18.5] w-full max-w-[320px] overflow-hidden rounded-[3.5rem] border-[10px] shadow-2xl sm:block"
                initial={{ y: 150, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Speaker Notch */}
                <div className="bg-charcoal-800 absolute left-1/2 top-0 z-20 h-7 w-1/3 -translate-x-1/2 rounded-b-2xl" />

                {/* Screen Content Mockup */}
                <div className="space-y-6 p-6 pt-14">
                  <div className="flex items-center justify-between">
                    <div className="bg-gold/20 h-8 w-8 rounded-lg" />
                    <div className="h-4 w-20 rounded-full bg-white/10" />
                  </div>
                  <div className="from-navy/40 to-charcoal-800 h-44 w-full rounded-2xl bg-gradient-to-br" />
                  <div className="space-y-3">
                    <div className="h-4 w-3/4 rounded-full bg-white/20" />
                    <div className="h-4 w-1/2 rounded-full bg-white/10" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 w-full rounded-2xl bg-white/5" />
                    <div className="h-24 w-full rounded-2xl bg-white/5" />
                  </div>
                  <div className="bg-gold mt-4 h-14 w-full rounded-xl" />
                </div>

                {/* Shine overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent" />
              </motion.div>

              {/* Secondary Floating Card */}
              <motion.div
                className="absolute -left-10 bottom-20 hidden max-w-[200px] rounded-2xl bg-white p-6 shadow-2xl lg:block"
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-charcoal text-xs font-bold">Titre Vérifié</span>
                </div>
                <p className="text-charcoal-400 text-[10px] leading-tight">
                  Document certifié par l'ANDF Bénin via GeoTrust.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
