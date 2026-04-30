'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import type { Route } from 'next';
import Link from 'next/link';
import { ArrowRight, Home, Bed, Building2, Wrench, GraduationCap, Users } from 'lucide-react';
import { cn } from '@afribayit/ui/src/lib/cn';

interface Module {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: Route | string;
  className: string;
  badge?: string;
}

const MODULES: Module[] = [
  {
    icon: <Home className="text-navy h-8 w-8" />,
    title: 'Immobilier Core',
    description: 'Achat, vente et location avec escrow sécurisé et certification notariale.',
    href: '/recherche',
    className: 'lg:col-span-2 bg-navy/5 border-navy/10',
    badge: '3.2k annonces',
  },
  {
    icon: <Bed className="text-sky h-8 w-8" />,
    title: 'Court Séjour',
    description: "Appartements meublés d'exception pour vos séjours d'affaires ou loisirs.",
    href: '/recherche?but=SHORT_TERM_RENT',
    className: 'bg-sky/5 border-sky/10',
  },
  {
    icon: <Building2 className="text-gold h-8 w-8" />,
    title: 'Hôtellerie',
    description: 'Réservez les meilleurs établissements avec notre PMS intégré.',
    href: '/hotels',
    className: 'bg-gold/5 border-gold/10',
    badge: 'Nouveau',
  },
  {
    icon: <Wrench className="text-emerald h-8 w-8" />,
    title: 'Artisans Certifiés',
    description: 'Trouvez les meilleurs experts BTP vérifiés pour vos projets.',
    href: '/artisans',
    className: 'bg-emerald/5 border-emerald/10',
  },
  {
    icon: <GraduationCap className="text-danger h-8 w-8" />,
    title: 'Academy',
    description: "Formez-vous aux métiers de l'immobilier avec nos experts certifiés.",
    href: '/formation',
    className: 'bg-danger/5 border-danger/10',
  },
  {
    icon: <Users className="text-charcoal h-8 w-8" />,
    title: 'Communauté',
    description: 'Échangez avec des investisseurs et développez votre réseau panafricain.',
    href: '/communaute',
    className: 'lg:col-span-2 bg-charcoal/5 border-charcoal/10',
  },
];

export function ModulesSection(): React.ReactElement {
  return (
    <section aria-labelledby="modules-title" className="bg-charcoal-50 py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold mb-4 text-sm font-bold uppercase tracking-[0.2em]">
              L'Écosystème AfriBayit
            </p>
            <h2
              id="modules-title"
              className="text-charcoal font-serif text-4xl font-bold leading-tight sm:text-5xl"
            >
              Tout ce dont vous avez besoin <br />
              pour votre <span className="text-navy italic">avenir immobilier</span>
            </h2>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((module, i) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className={module.className}
            >
              <Link href={module.href as Route} className="group block h-full">
                <div
                  className={cn(
                    'relative flex h-full flex-col gap-6 rounded-3xl border p-8 shadow-sm transition-all duration-500',
                    'bg-white hover:-translate-y-1 hover:shadow-xl',
                  )}
                >
                  {/* Badge */}
                  {module.badge && (
                    <span className="bg-gold/10 text-gold absolute right-6 top-6 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider">
                      {module.badge}
                    </span>
                  )}

                  {/* Icon Wrapper */}
                  <div
                    className={cn(
                      'flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110',
                      module.className
                        .split(' ')
                        .find((c) => c.startsWith('bg-'))
                        ?.replace('/5', '/10'),
                    )}
                  >
                    {module.icon}
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-charcoal font-serif text-2xl font-bold">{module.title}</h3>
                    <p className="text-charcoal-500 text-base leading-relaxed">
                      {module.description}
                    </p>
                  </div>

                  {/* Arrow Link */}
                  <div className="text-navy mt-auto flex items-center gap-2 text-sm font-bold transition-all duration-300 group-hover:gap-3">
                    DÉCOUVRIR LE MODULE
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
