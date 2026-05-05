'use client';

import React from 'react';
import { Eye, LayoutDashboard, Target, ArrowRight, Briefcase } from 'lucide-react';

const ARGUMENTS = [
  {
    title: 'Plus de visibilité',
    description:
      'Vos biens devant des milliers d\'acheteurs qualifiés. Profil agent vérifié. Badge "Pro certifié" sur chaque annonce.',
    icon: Eye,
  },
  {
    title: 'Un CRM intégré',
    description:
      'Gérez vos prospects, suivez vos transactions, mesurez vos performances. Tout dans un tableau de bord conçu pour les professionnels.',
    icon: LayoutDashboard,
  },
  {
    title: 'Des leads qualifiés',
    description:
      "Pas de touristes. Nos visiteurs passent par une étape d'identification. Vous parlez à des personnes qui cherchent vraiment.",
    icon: Target,
  },
];

export function ProfessionalsSection() {
  return (
    <section className="bg-navy relative overflow-hidden py-24 sm:py-32">
      {/* Decorative background */}
      <div className="bg-gold/5 pointer-events-none absolute right-0 top-0 -mr-20 -mt-20 h-[500px] w-[500px] rounded-full blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <div className="border-gold/20 bg-gold/10 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
            <Briefcase className="text-gold h-4 w-4" />
            <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">
              Pour ceux qui font de l'immobilier un métier
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl lg:leading-tight">
            Vous êtes agent immobilier, promoteur ou investisseur professionnel ?
          </h2>
          <p className="mt-6 text-xl text-white/80">
            AfriBayit est votre plateforme de croissance.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <div className="grid max-w-xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-3">
            {ARGUMENTS.map((arg) => (
              <div
                key={arg.title}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                  <arg.icon className="text-gold h-8 w-8" />
                </div>
                <h3 className="mb-4 text-2xl font-bold text-white">{arg.title}</h3>
                <p className="leading-relaxed text-white/60">{arg.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <a
            href="/pro/inscription"
            className="bg-gold text-navy shadow-gold/20 hover:bg-gold-400 rounded-full px-8 py-4 text-sm font-bold shadow-lg transition-all hover:scale-105"
          >
            Créer mon compte Agent Pro
          </a>
          <a
            href="/pro"
            className="hover:text-gold group inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors"
          >
            Voir les offres professionnelles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
