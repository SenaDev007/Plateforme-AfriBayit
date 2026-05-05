'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { Home, Key, TrendingUp, HardHat, Hotel, GraduationCap, ArrowRight } from 'lucide-react';

const SERVICES = [
  {
    id: '01',
    title: 'Immobilier résidentiel',
    subtitle: 'Trouver, acheter, habiter.',
    description:
      'Appartements, villas, terrains. Filtres avancés par prix, surface, quartier. Chaque bien vérifié. Visite virtuelle 360° disponible.',
    icon: Home,
    color: 'bg-navy',
    textColor: 'text-white',
    span: 'md:col-span-2 md:row-span-2',
    image:
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop',
    cta: 'Explorer les biens',
    href: '/recherche',
  },
  {
    id: '02',
    title: 'Location',
    subtitle: 'Courte ou longue durée.',
    description:
      'Séjours professionnels, logements étudiants, hôtels locaux certifiés. Mobile Money accepté. Confirmation instantanée.',
    icon: Key,
    color: 'bg-gold/10',
    textColor: 'text-charcoal',
    span: 'md:col-span-1 md:row-span-1',
    cta: 'Trouver un logement',
    href: '/location',
  },
  {
    id: '03',
    title: 'Investissement',
    subtitle: 'Rendement sans opacité.',
    description:
      'Identifiez les zones à fort potentiel. Accédez aux données de marché par ville. Nos partenaires notaires valident chaque opération.',
    icon: TrendingUp,
    color: 'bg-charcoal-50',
    textColor: 'text-charcoal',
    span: 'md:col-span-1 md:row-span-2',
    cta: 'Voir les opportunités',
    href: '/investissement',
  },
  {
    id: '04',
    title: 'Artisans BTP',
    subtitle: 'Des professionnels certifiés pour votre bien.',
    description:
      'Maçon, électricien, plombier, architecte — chaque artisan est évalué par la communauté et certifié par AfriBayit. Demande de devis en 3 clics.',
    icon: HardHat,
    color: 'bg-gold',
    textColor: 'text-navy',
    span: 'md:col-span-1 md:row-span-1',
    cta: 'Trouver un artisan',
    href: '/artisans',
  },
  {
    id: '05',
    title: 'Hôtels & Séjours',
    subtitle: "L'hospitalité africaine, au bon prix.",
    description:
      'Hôtels locaux référencés, guesthouses vérifiées. Réservation sécurisée. Annulation flexible.',
    icon: Hotel,
    color: 'bg-charcoal-900',
    textColor: 'text-white',
    span: 'md:col-span-1 md:row-span-1',
    cta: 'Réserver',
    href: '/hotels',
  },
  {
    id: '06',
    title: 'Académie',
    subtitle: "Comprendre l'immobilier pour mieux décider.",
    description:
      'Formations certifiantes en gestion immobilière, droit foncier, investissement. En ligne. À votre rythme.',
    icon: GraduationCap,
    color: 'bg-navy-100',
    textColor: 'text-navy',
    span: 'md:col-span-1 md:row-span-1',
    cta: 'Voir les formations',
    href: '/academie',
  },
];

export function ModulesSection(): React.ReactElement {
  return (
    <section className="overflow-hidden bg-white py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 max-w-3xl">
          <p className="text-gold mb-4 text-[10px] font-bold uppercase tracking-[0.4em]">
            Tout l'immobilier africain. Un seul endroit.
          </p>
          <h2 className="text-navy text-section-mobile md:text-section-desktop font-serif font-bold leading-tight tracking-tight">
            Que vous achetiez, louiez, investissiez ou construisiez — <br />
            <span className="text-gold italic">AfriBayit a ce qu'il vous faut.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 md:grid-rows-3">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`${s.span} border-charcoal-100/50 group relative flex flex-col justify-between overflow-hidden rounded-[32px] border ${s.color} p-8 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] md:p-10`}
            >
              {s.image && (
                <div className="absolute inset-0 z-0 opacity-20 transition-all duration-700 group-hover:scale-110 group-hover:opacity-40">
                  <img src={s.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}

              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-6 flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl md:h-14 md:w-14 ${s.textColor === 'text-white' ? 'bg-white/10' : 'bg-navy/5'} backdrop-blur-sm`}
                  >
                    <s.icon
                      className={`h-6 w-6 md:h-7 md:w-7 ${s.textColor === 'text-white' ? 'text-gold' : 'text-navy'}`}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${s.textColor === 'text-white' ? 'text-white/40' : 'text-navy/40'} tracking-widest`}
                  >
                    {s.id}
                  </span>
                </div>

                <h3 className={`mb-1 font-serif text-2xl font-bold tracking-tight ${s.textColor}`}>
                  {s.title}
                </h3>
                <p
                  className={`mb-4 text-sm font-bold tracking-tight ${s.textColor === 'text-white' ? 'text-gold' : 'text-navy'}`}
                >
                  {s.subtitle}
                </p>
                <p
                  className={`mb-8 flex-grow text-sm leading-relaxed ${s.textColor === 'text-white' ? 'text-white/70' : 'text-charcoal-500'}`}
                >
                  {s.description}
                </p>

                <a
                  href={s.href}
                  className={`mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-transform hover:translate-x-2 ${s.textColor === 'text-white' ? 'hover:text-gold text-white' : 'text-navy hover:text-gold'}`}
                >
                  {s.cta}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
