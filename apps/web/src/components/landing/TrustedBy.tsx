'use client';
import type React from 'react';
import { motion } from 'framer-motion';

const PARTNERS = [
  {
    name: 'BCEAO',
    logo: 'https://www.google.com/s2/favicons?domain=bceao.int&sz=128',
    fullName: "Banque Centrale des États de l'Afrique de l'Ouest",
  },
  {
    name: 'BOAD',
    logo: 'https://www.google.com/s2/favicons?domain=boad.org&sz=128',
    fullName: 'Banque Ouest Africaine de Développement',
  },
  {
    name: 'ECOBANK',
    logo: 'https://logo.clearbit.com/ecobank.com',
    fullName: 'The Pan-African Bank',
  },
  {
    name: 'ORABANK',
    logo: 'https://logo.clearbit.com/orabank.net',
    fullName: 'Un Partenaire à votre Écoute',
  },
  {
    name: 'CORIS BANK',
    logo: 'https://logo.clearbit.com/coris-bank.com',
    fullName: 'La Banque Autrement',
  },
  {
    name: 'FEDA PAY',
    logo: 'https://logo.clearbit.com/fedapay.com',
    fullName: 'Passerelle de Paiement Sécurisée',
  },
];

export function TrustedBy(): React.ReactElement {
  return (
    <section className="bg-navy relative overflow-hidden border-y border-white/10 py-20">
      {/* Background decoration */}
      <div
        className="absolute inset-0 z-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)',
        }}
      />

      <div className="container relative z-10 mx-auto px-4">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gold mb-16 text-center text-[10px] font-bold uppercase tracking-[0.4em]"
        >
          ADOUBÉ PAR LES INSTITUTIONS FINANCIÈRES LES PLUS STRICTES D&apos;AFRIQUE
        </motion.p>

        <div className="relative flex overflow-hidden">
          {/* Fading Edges Mask */}
          <div className="from-navy pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r to-transparent" />
          <div className="from-navy pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l to-transparent" />

          <motion.div
            className="flex gap-20 whitespace-nowrap"
            animate={{ x: [0, -2500] }}
            transition={{
              duration: 40,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, i) => (
              <div
                key={`${partner.name}-${i}`}
                className="group flex min-w-[200px] flex-col items-center gap-6"
              >
                <div className="relative flex h-16 w-32 items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-full object-contain opacity-40 brightness-0 invert transition-all duration-500 group-hover:opacity-100 group-hover:brightness-100 group-hover:invert-0"
                  />
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="text-gold font-sans text-xs font-black tracking-widest transition-colors duration-500 group-hover:text-white">
                    {partner.name}
                  </span>
                  <span className="group-hover:text-gold/60 font-sans text-[8px] font-medium uppercase tracking-tight text-white/20 transition-all duration-500">
                    {partner.fullName}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
