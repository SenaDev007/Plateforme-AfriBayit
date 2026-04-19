'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Aminata Koné',
    role: 'Acheteuse · Abidjan',
    avatar: 'AK',
    rating: 5,
    text: 'J\'ai acheté ma première maison grâce à AfriBayit. Le système d\'escrow m\'a donné une confiance totale. La transaction s\'est passée sans accroc.',
  },
  {
    name: 'Kofi Mensah',
    role: 'Investisseur · Accra',
    avatar: 'KM',
    rating: 5,
    text: 'Excellent service. J\'investis depuis le Ghana dans des propriétés au Bénin. Le paiement en Mobile Money est super pratique.',
  },
  {
    name: 'Fatou Diallo',
    role: 'Propriétaire · Lomé',
    avatar: 'FD',
    rating: 5,
    text: 'Je loue mon appartement sur AfriBayit depuis 6 mois. Les locataires sont vérifiés KYC et j\'ai zéro problème de paiement.',
  },
];

function StarRating({ rating }: { rating: number }): React.ReactElement {
  return (
    <div className="flex gap-0.5" aria-label={`Note : ${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-gold text-gold' : 'text-charcoal-200'}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function TestimonialsSection(): React.ReactElement {
  return (
    <section aria-labelledby="testimonials-title" className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-medium text-gold uppercase tracking-widest mb-3">Témoignages</p>
          <h2 id="testimonials-title" className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Ils nous font confiance
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.blockquote
              key={testimonial.name}
              className="flex flex-col gap-4 p-6 rounded-xl border border-charcoal-100 shadow-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <StarRating rating={testimonial.rating} />
              <p className="text-charcoal-600 text-sm leading-relaxed italic">"{testimonial.text}"</p>
              <footer className="flex items-center gap-3 mt-auto">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white text-sm font-semibold"
                  aria-hidden="true"
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-medium text-charcoal text-sm">{testimonial.name}</p>
                  <p className="text-xs text-charcoal-400">{testimonial.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
