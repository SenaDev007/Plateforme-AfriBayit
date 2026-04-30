'use client';
import type React from 'react';
import { motion } from 'framer-motion';

const PARTNERS = ['BCEAO', 'BOAD', 'ORABANK', 'ECOBANK', 'CORIS BANK', 'FEDA PAY'];

export function TrustedBy(): React.ReactElement {
  return (
    <section className="border-charcoal-50 border-b bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-charcoal-400 mb-10 text-center text-xs font-semibold uppercase tracking-[0.2em]">
          Ils nous font confiance pour la sécurisation de leurs flux
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-30 grayscale transition-all duration-700 hover:opacity-100 hover:grayscale-0 md:gap-16">
          {PARTNERS.map((name) => (
            <motion.span
              key={name}
              className="text-charcoal font-sans text-xl font-bold tracking-tighter md:text-2xl"
              whileHover={{ scale: 1.05 }}
            >
              {name}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
