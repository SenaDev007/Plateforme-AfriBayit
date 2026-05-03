'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Aminata Koné',
    role: 'Investisseuse · Abidjan, CI',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=200',
    rating: 5,
    text: "Avant AfriBayit, j'avais peur d'investir au pays à cause des litiges. Aujourd'hui, je suis multi-propriétaire à Cocody, titres fonciers en main. Leur séquestre offre une garantie de 100%. Tolérance zéro pour l'improvisation.",
  },
  {
    name: 'Dr. Samuel Mensah',
    role: 'Diaspora · Paris / Accra',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    rating: 5,
    text: "Gérer mon patrimoine depuis l'Europe était un cauchemar. Avec AfriBayit, je pilote plus d'un million d'euros d'actifs depuis mon smartphone. C'est le standard institutionnel, enfin disponible pour nous.",
  },
  {
    name: 'Fatouma Touré',
    role: 'Opératrice Hospitality · Cotonou',
    avatar: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?q=80&w=200',
    rating: 5,
    text: "En 3 mois sur le module Hospitality, j'ai explosé ma rentabilité. Mon taux d'occupation est à 92%, je reçois mes fonds directement sur Mobile Money. C'est simple : ça tourne, et ça encaisse.",
  },
];

function StarRating({ rating }: { rating: number }): React.ReactElement {
  return (
    <div className="flex gap-1" aria-label={`Note : ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-gold text-gold' : 'text-charcoal-100'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection(): React.ReactElement {
  return (
    <section
      aria-labelledby="testimonials-title"
      className="relative overflow-hidden bg-white py-32"
    >
      {/* Decorative quotes background */}
      <Quote className="text-charcoal-50 absolute left-10 top-10 -z-0 h-64 w-64 opacity-50" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold mb-4 text-sm font-bold uppercase tracking-[0.2em]">
              Résultats Prouvés
            </p>
            <h2
              id="testimonials-title"
              className="text-charcoal font-sans text-4xl font-black tracking-tighter sm:text-6xl lg:text-7xl"
            >
              Ils ont arrêté de rêver. <br />
              <span className="text-navy font-serif font-normal italic">Ils encaissent.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.blockquote
              key={testimonial.name}
              className="bg-charcoal-50 hover:border-charcoal-100 flex flex-col gap-6 rounded-[32px] border border-transparent p-10 transition-all duration-500 hover:bg-white hover:shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="flex items-start justify-between">
                <StarRating rating={testimonial.rating} />
                <Quote className="text-gold/20 h-8 w-8" />
              </div>

              <p className="text-charcoal-600 text-lg font-light italic leading-relaxed">
                "{testimonial.text}"
              </p>

              <footer className="border-charcoal-100/50 mt-auto flex items-center gap-4 border-t pt-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-14 w-14 rounded-2xl object-cover shadow-md"
                />
                <div>
                  <p className="text-charcoal text-base font-bold">{testimonial.name}</p>
                  <p className="text-gold text-xs font-medium uppercase tracking-wider">
                    {testimonial.role}
                  </p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* Global Rating Badge */}
        <motion.div
          className="mt-20 flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="bg-navy flex items-center gap-2 rounded-full px-6 py-3 text-white shadow-xl">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="border-navy bg-charcoal-200 h-8 w-8 rounded-full border-2"
                />
              ))}
            </div>
            <span className="text-sm font-bold">4.9/5 basé sur 2,500+ avis</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
