'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  GraduationCap,
  Plane,
  Database,
  Share2,
  Wallet,
  ArrowRight,
} from 'lucide-react';

const modules = [
  {
    title: 'Séquestre Inviolable',
    description:
      "Ne versez plus jamais d'argent dans le vide. Vos fonds sont bloqués et ultra-sécurisés jusqu'à la signature finale chez le Notaire. Tolérance zéro pour l'arnaque.",
    icon: ShieldCheck,
    color: 'bg-navy',
    textColor: 'text-white',
    span: 'md:col-span-2 md:row-span-2',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Radar GeoTrust 3D',
    description:
      'Fini les terrains litigeux ou imaginaires. Nos drones inspectent et certifient chaque mètre carré. Vous achetez ce que vous voyez, avec une précision chirurgicale.',
    icon: Plane,
    color: 'bg-gold/10',
    textColor: 'text-charcoal',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'AfriBayit Academy',
    description:
      "Ne laissez plus l'ignorance vous coûter des millions. Apprenez les stratégies des top investisseurs et bâtissez un empire intergénérationnel blindé.",
    icon: GraduationCap,
    color: 'bg-charcoal-50',
    textColor: 'text-charcoal',
    span: 'md:col-span-1 md:row-span-2',
    image:
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop',
  },
  {
    title: 'Réseau Ambassadeurs',
    description:
      "Transformez votre réseau en or massif. Recommandez l'excellence et encaissez des commissions premiums sur chaque transaction.",
    icon: Share2,
    color: 'bg-gold',
    textColor: 'text-navy',
    span: 'md:col-span-1 md:row-span-1',
  },
  {
    title: 'Ancrage Blockchain',
    description:
      'Votre titre de propriété est gravé dans le marbre numérique. Inaltérable. Infalsifiable. Dormez enfin sur vos deux oreilles.',
    icon: Database,
    color: 'bg-charcoal-900',
    textColor: 'text-white',
    span: 'md:col-span-1 md:row-span-1',
  },
];

export function ModulesSection(): React.ReactElement {
  return (
    <section className="overflow-hidden bg-white py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <p className="text-gold mb-4 text-[10px] font-bold uppercase tracking-[0.4em]">
            Le Bouclier Anti-Arnaques Définitif
          </p>
          <h2 className="text-charcoal font-sans text-4xl font-black tracking-tighter md:text-6xl lg:text-7xl">
            Investissez en Afrique <br />
            <span className="font-serif font-normal italic">les Yeux Fermés.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {modules.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`${m.span} group relative overflow-hidden rounded-[48px] ${m.color} border-charcoal-100/50 flex flex-col justify-between border p-12 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)]`}
            >
              {m.image && (
                <div className="absolute inset-0 z-0 opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:opacity-40">
                  <img src={m.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}

              <div className="relative z-10">
                <div
                  className={`mb-10 flex h-16 w-16 items-center justify-center rounded-[24px] ${m.textColor === 'text-white' ? 'bg-white/10' : 'bg-navy/5'} backdrop-blur-sm`}
                >
                  <m.icon
                    className={`h-8 w-8 ${m.textColor === 'text-white' ? 'text-gold' : 'text-navy'}`}
                  />
                </div>
                <h3 className={`mb-5 text-2xl font-bold tracking-tight ${m.textColor}`}>
                  {m.title}
                </h3>
                <p
                  className={`text-base leading-relaxed ${m.textColor === 'text-white' ? 'opacity-50' : 'text-charcoal-400'}`}
                >
                  {m.description}
                </p>
              </div>

              <div className="relative z-10 mt-12 flex translate-y-4 items-center gap-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${m.textColor}`}>
                  DÉCOUVRIR
                </span>
                <ArrowRight className={`h-4 w-4 ${m.textColor}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
