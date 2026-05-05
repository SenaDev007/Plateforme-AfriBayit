'use client';
import type React from 'react';
import { motion } from 'framer-motion';

const PARTNERS = ['BCEAO', 'BOAD', 'ORABANK', 'ECOBANK', 'CORIS BANK', 'FEDA PAY'];

export function TrustedBy(): React.ReactElement {
  return (
    <section className="border-charcoal-50 overflow-hidden border-b bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-charcoal-400 mb-10 text-center text-xs font-bold uppercase tracking-[0.2em]">
          Adoubé par les institutions financières les plus strictes d&apos;Afrique
        </p>

        <div className="relative flex overflow-hidden">
          <motion.div
            className="flex gap-16 whitespace-nowrap"
            animate={{ x: [0, -1035] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="text-charcoal flex items-center gap-2 font-sans text-xl font-black tracking-tighter opacity-30 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0 md:text-3xl"
              >
                {name}
                <div className="bg-gold ml-8 h-1 w-1 rounded-full" />
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
