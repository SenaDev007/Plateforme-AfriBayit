'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Module {
  icon: string;
  title: string;
  description: string;
  href: string;
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
    description: 'Appartements meublés et maisons pour touristes et voyageurs d\'affaires.',
    href: '/recherche?but=SHORT_TERM_RENT',
    color: 'bg-sky/5 hover:bg-sky/10',
  },
  {
    icon: '🏨',
    title: 'Hôtels',
    description: 'Réservez les meilleurs hôtels et résidences dans toute l\'Afrique de l\'Ouest.',
    href: '/hotels',
    color: 'bg-gold/5 hover:bg-gold/10',
    badge: 'Nouveau',
  },
  {
    icon: '🔨',
    title: 'Artisans',
    description: 'Menuisiers, plombiers, électriciens — trouvez l\'expert qu\'il vous faut.',
    href: '/artisans',
    color: 'bg-emerald/5 hover:bg-emerald/10',
  },
  {
    icon: '🎓',
    title: 'Formation',
    description: 'Cours en ligne et présentiel sur l\'immobilier, la construction et l\'investissement.',
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
    <section aria-labelledby="modules-title" className="py-20 bg-charcoal-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-gold uppercase tracking-widest mb-3">
            Tout en un seul endroit
          </p>
          <h2 id="modules-title" className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Une super-app pour l'immobilier africain
          </h2>
          <p className="mt-4 text-charcoal-400 max-w-xl mx-auto">
            De la recherche de propriété à la réservation d'artisans, tout l'écosystème immobilier réuni.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {MODULES.map((module) => (
            <motion.div key={module.title} variants={itemVariants}>
              <Link href={module.href} className="group block h-full">
                <div
                  className={`relative flex flex-col gap-3 p-6 rounded-xl border border-charcoal-100 h-full transition-all duration-300 ${module.color} hover:shadow-card-hover hover:-translate-y-1`}
                >
                  {/* Badge */}
                  {module.badge && (
                    <span className="absolute top-4 right-4 rounded-pill bg-gold text-navy text-xs font-semibold px-2.5 py-0.5">
                      {module.badge}
                    </span>
                  )}

                  {/* Icon */}
                  <span className="text-3xl" aria-hidden="true">{module.icon}</span>

                  {/* Content */}
                  <div>
                    <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">
                      {module.title}
                    </h3>
                    <p className="text-sm text-charcoal-400 leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-1 text-sm font-medium text-navy mt-auto">
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
