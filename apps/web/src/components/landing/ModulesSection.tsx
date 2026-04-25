'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Module {
  icon: string;
  title: string;
  description: string;
  href: Route | string;
  color: string;
  badge?: string;
}

const MODULES: Module[] = [
  {
    icon: '🏠',
    title: 'Immobilier',
    description: 'Achat, vente et location avec escrow sécurisé et KYC vérifié.',
    href: '/recherche',
    color: 'bg-navy/5 hover:bg-navy/10',
    badge: '3.2k annonces',
  },
  {
    icon: '🛋️',
    title: 'Location Courte Durée',
    description: "Appartements meublés et maisons pour touristes et voyageurs d'affaires.",
    href: '/recherche?but=SHORT_TERM_RENT',
    color: 'bg-sky/5 hover:bg-sky/10',
  },
  {
    icon: '🏨',
    title: 'Hôtels',
    description: "Réservez les meilleurs hôtels et résidences dans toute l'Afrique de l'Ouest.",
    href: '/hotels',
    color: 'bg-gold/5 hover:bg-gold/10',
    badge: 'Nouveau',
  },
  {
    icon: '🔨',
    title: 'Artisans',
    description: "Menuisiers, plombiers, électriciens — trouvez l'expert qu'il vous faut.",
    href: '/artisans',
    color: 'bg-emerald/5 hover:bg-emerald/10',
  },
  {
    icon: '🎓',
    title: 'Formation',
    description:
      "Cours en ligne et présentiel sur l'immobilier, la construction et l'investissement.",
    href: '/formation',
    color: 'bg-danger/5 hover:bg-danger/10',
  },
  {
    icon: '👥',
    title: 'Communauté',
    description: 'Rejoignez des groupes, échangez des conseils et développez votre réseau.',
    href: '/communaute',
    color: 'bg-charcoal/5 hover:bg-charcoal/10',
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function ModulesSection(): React.ReactElement {
  return (
    <section aria-labelledby="modules-title" className="bg-charcoal-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-gold mb-3 text-sm font-medium uppercase tracking-widest">
            Tout en un seul endroit
          </p>
          <h2
            id="modules-title"
            className="text-charcoal font-serif text-3xl font-bold sm:text-4xl"
          >
            Une super-app pour l'immobilier africain
          </h2>
          <p className="text-charcoal-400 mx-auto mt-4 max-w-xl">
            De la recherche de propriété à la réservation d'artisans, tout l'écosystème immobilier
            réuni.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {MODULES.map((module) => (
            <motion.div key={module.title} variants={itemVariants}>
              <Link href={module.href as Route} className="group block h-full">
                <div
                  className={`border-charcoal-100 relative flex h-full flex-col gap-3 rounded-xl border p-6 transition-all duration-300 ${module.color} hover:shadow-card-hover hover:-translate-y-1`}
                >
                  {/* Badge */}
                  {module.badge && (
                    <span className="rounded-pill bg-gold text-navy absolute right-4 top-4 px-2.5 py-0.5 text-xs font-semibold">
                      {module.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <span className="text-3xl" aria-hidden="true">
                    {module.icon}
                  </span>

                  {/* Content */}
                  <div>
                    <h3 className="text-charcoal mb-1 font-serif text-lg font-semibold">
                      {module.title}
                    </h3>
                    <p className="text-charcoal-400 text-sm leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-navy mt-auto flex items-center gap-1 text-sm font-medium">
                    Explorer
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
