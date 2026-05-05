'use client';

import React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  {
    id: 'bj',
    name: 'Bénin',
    cities: 'Cotonou, Porto-Novo, Parakou',
    domain: 'bj.afribayit.com',
    flag: '🇧🇯',
    currency: 'FCFA',
    payment: 'Mobile Money, Carte',
    listings: '1,200+',
  },
  {
    id: 'ci',
    name: "Côte d'Ivoire",
    cities: 'Abidjan, Yamoussoukro',
    domain: 'ci.afribayit.com',
    flag: '🇨🇮',
    currency: 'FCFA',
    payment: 'Mobile Money, Wave',
    listings: '1,800+',
  },
  {
    id: 'bf',
    name: 'Burkina Faso',
    cities: 'Ouagadougou, Bobo-Dioulasso',
    domain: 'bf.afribayit.com',
    flag: '🇧🇫',
    currency: 'FCFA',
    payment: 'Mobile Money, Orange',
    listings: '450+',
  },
  {
    id: 'tg',
    name: 'Togo',
    cities: 'Lomé, Sokodé',
    domain: 'tg.afribayit.com',
    flag: '🇹🇬',
    currency: 'FCFA',
    payment: 'Mobile Money, TMoney',
    listings: '750+',
  },
];

export function CountriesSection() {
  return (
    <section className="bg-charcoal-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <p className="text-gold mb-4 text-[10px] font-bold uppercase tracking-[0.4em]">
            AfriBayit est là où vous êtes
          </p>
          <h2 className="text-navy font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:leading-tight">
            Bénin. Côte d'Ivoire. Burkina Faso. Togo. <br />
            <span className="text-gold italic">Et la suite arrive.</span>
          </h2>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {COUNTRIES.map((country) => (
            <div
              key={country.id}
              className="border-charcoal-200 group relative flex flex-col justify-between overflow-hidden rounded-[32px] border bg-white p-8 transition-all hover:shadow-xl sm:p-10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{country.flag}</span>
                    <h3 className="text-navy text-2xl font-bold">{country.name}</h3>
                  </div>
                  <p className="text-charcoal-500 mt-2 text-sm">{country.cities}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-gold font-mono text-xl font-bold">{country.listings}</span>
                  <span className="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider">
                    Annonces
                  </span>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                <span className="bg-navy/5 text-navy inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                  Devise : {country.currency}
                </span>
                <span className="bg-gold/10 text-charcoal-700 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium">
                  {country.payment}
                </span>
              </div>

              <div className="border-charcoal-100 mt-8 flex items-center justify-between border-t pt-6">
                <span className="text-charcoal-400 font-mono text-sm font-medium">
                  {country.domain}
                </span>
                <a
                  href={`https://${country.domain}`}
                  className="text-navy hover:text-gold inline-flex items-center gap-2 text-sm font-bold transition-colors"
                >
                  Explorer
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Waitlist CTA */}
        <div className="border-charcoal-100 mx-auto mt-16 max-w-3xl rounded-[32px] border bg-white p-8 text-center shadow-sm sm:mt-24 sm:p-12">
          <Globe className="text-gold mx-auto mb-4 h-8 w-8" />
          <h3 className="text-navy mb-2 text-xl font-bold">
            Vous êtes au Sénégal ? Au Mali ? Au Cameroun ?
          </h3>
          <p className="text-charcoal-500 mx-auto mb-8 max-w-xl">
            Laissez-nous votre pays. Vous serez les premiers informés du lancement d'AfriBayit dans
            votre région.
          </p>
          <button className="bg-navy hover:bg-navy-700 rounded-full px-8 py-3 font-medium text-white transition-colors">
            Rejoindre la liste d'attente
          </button>
        </div>
      </div>
    </section>
  );
}
