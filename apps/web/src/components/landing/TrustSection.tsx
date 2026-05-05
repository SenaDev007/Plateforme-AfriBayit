'use client';

import React from 'react';
import { ShieldCheck, Lock, UserCheck, Scale, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Aucun bien fantôme.',
    description:
      'Chaque annonce passe par notre équipe de vérification avant publication. Titre foncier, identité du vendeur, cohérence du prix au m².',
  },
  {
    icon: Lock,
    title: 'Votre argent ne bouge que si tout est conforme.',
    description:
      "Le paiement est bloqué jusqu'à signature et validation des deux parties. Zéro risque de disparition avec la mise de fonds.",
  },
  {
    icon: UserCheck,
    title: 'Vous savez à qui vous parlez.',
    description:
      "Acheteur, vendeur, agent : chacun passe par une vérification d'identité. Parce que l'anonymat coûte cher dans l'immobilier.",
  },
  {
    icon: Scale,
    title: 'Nous restons dans la transaction.',
    description:
      "En cas de conflit, notre équipe médiation intervient. Vous n'êtes jamais seul face à un problème.",
  },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-white py-24 sm:py-32">
      {/* Decorative background elements */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div className="bg-navy absolute right-0 top-0 -mr-20 -mt-20 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-gold absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-navy font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:leading-tight">
            L'immobilier africain a un problème de confiance. <br className="hidden lg:block" />
            <span className="text-gold">Nous l'avons résolu.</span>
          </h2>
          <p className="text-charcoal-600 mt-6 text-lg leading-8">
            Chaque bien est contrôlé. Chaque FCFA est protégé. <br className="hidden sm:block" />
            Chaque vendeur est identifié. Avant que vous ne voyiez quoi que ce soit.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="flex flex-col">
                <dt className="text-navy flex items-center gap-x-3 text-xl font-bold leading-7">
                  <div className="bg-navy/5 border-navy/10 flex h-12 w-12 items-center justify-center rounded-xl border">
                    <pillar.icon className="text-gold h-6 w-6" aria-hidden="true" />
                  </div>
                  {pillar.title}
                </dt>
                <dd className="text-charcoal-600 mt-4 flex flex-auto flex-col text-base leading-7">
                  <p className="flex-auto">{pillar.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-16 flex justify-center lg:mt-20">
          <a
            href="/securite"
            className="text-navy hover:text-gold group inline-flex items-center gap-2 font-bold transition-colors"
          >
            Voir comment fonctionne l'escrow
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
