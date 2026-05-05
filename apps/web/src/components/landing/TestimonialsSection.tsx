'use client';
import type React from 'react';

import { motion } from 'framer-motion';
import { Star, Quote, CheckCircle } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Aïcha K.',
    role: 'Cotonou — Acheteuse appartement 3 pièces',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e16fd3c?q=80&w=200',
    rating: 5,
    text: "J'avais peur d'envoyer de l'argent sans voir le bien en vrai. L'escrow m'a rassuré dès le départ. La transaction s'est faite en 11 jours. Propre, clair, sans stress.",
  },
  {
    name: 'Kofi A.',
    role: 'Abidjan — Vendeur terrain Cocody',
    avatar: 'https://images.unsplash.com/photo-1506803682983-e5e11c521199?q=80&w=200',
    rating: 5,
    text: "J'ai listé mon terrain en 20 minutes. En 3 semaines j'avais un acheteur sérieux. Vérification faite par l'équipe, signature chez le notaire partenaire. Je recommande à tous mes contacts.",
  },
  {
    name: 'Mamadou S.',
    role: 'Ouagadougou — Client Artisans BTP',
    avatar: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?q=80&w=200',
    rating: 5,
    text: "Je cherchais un plombier qualifié pour ma villa en construction. En 48h j'avais 4 devis comparatifs de professionnels certifiés. C'est une autre façon de travailler.",
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
      {/* Decorative background */}
      <div className="bg-navy/[0.02] absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              id="testimonials-title"
              className="text-navy font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Ils ont sécurisé leur transaction. <br className="hidden sm:block" />
              <span className="text-gold italic">Ils en parlent.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.blockquote
              key={testimonial.name}
              className="hover:border-gold/30 border-charcoal-100/50 flex flex-col gap-6 rounded-[32px] border bg-white p-6 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.15)] md:p-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <div className="flex items-start justify-between">
                <StarRating rating={testimonial.rating} />
                <Quote className="text-gold/20 h-8 w-8" />
              </div>

              <p className="text-charcoal-600 flex-grow text-lg font-light italic leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="text-navy/60 bg-navy/5 mb-2 flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold">
                <CheckCircle className="text-gold h-3.5 w-3.5" />
                Transaction vérifiée AfriBayit
              </div>

              <footer className="border-charcoal-100/50 flex items-center gap-4 border-t pt-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="ring-gold/20 h-12 w-12 rounded-full object-cover shadow-sm ring-2"
                />
                <div>
                  <p className="text-navy text-sm font-bold">{testimonial.name}</p>
                  <p className="text-charcoal-400 text-xs font-medium">{testimonial.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>

        {/* Global Stats Badge */}
        <motion.div
          className="mx-auto mt-24 w-fit"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="bg-navy border-gold/20 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 rounded-full border px-8 py-6 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-gold font-mono text-lg font-bold">4 200</span>
              <span className="text-sm font-medium text-white/80">annonces actives</span>
            </div>
            <div className="hidden h-5 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-gold font-mono text-lg font-bold">98%</span>
              <span className="text-sm font-medium text-white/80">de satisfaction</span>
            </div>
            <div className="hidden h-5 w-px bg-white/20 sm:block" />
            <div className="flex items-center gap-2">
              <span className="text-gold font-mono text-lg font-bold">0 FCFA</span>
              <span className="text-sm font-medium text-white/80">perdu via l'escrow</span>
            </div>
            <div className="hidden h-5 w-px bg-white/20 md:block" />
            <div className="flex items-center gap-2">
              <span className="text-gold font-mono text-lg font-bold">4</span>
              <span className="text-sm font-medium text-white/80">pays desservis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
