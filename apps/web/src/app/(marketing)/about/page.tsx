'use client';
import type React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Target, Rocket, Heart, Award } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';

const stats = [
  { label: 'Utilisateurs Actifs', value: '50k+', icon: Users },
  { label: 'Propriétés Vendues', value: '1.2k', icon: ShieldCheck },
  { label: 'Pays Couverts', value: '4', icon: Target },
  { label: 'Points de Confiance', value: '10M+', icon: Award },
];

export default function AboutPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <main>
        {/* Hero Section */}
        <section className="bg-navy relative overflow-hidden py-32 text-white">
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="bg-gold absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full blur-[120px]" />
            <div className="bg-gold absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full blur-[120px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold mb-6 text-sm font-bold uppercase tracking-[0.3em]"
            >
              Notre Histoire & Vision
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 font-serif text-5xl font-bold leading-tight md:text-7xl"
            >
              Révolutionner l&apos;immobilier <br />
              <span className="text-gold italic">en Afrique de l&apos;Ouest</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mx-auto max-w-3xl text-lg text-white/60"
            >
              AfriBayit est né d&apos;une mission simple : sécuriser chaque transaction immobilière
              en Afrique pour que la confiance ne soit plus une option, mais un standard.
            </motion.p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-charcoal-100 border-b bg-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-navy/5 text-navy mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-navy font-serif text-3xl font-bold">{stat.value}</p>
                  <p className="text-charcoal-400 text-xs font-bold uppercase tracking-widest">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-32">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-charcoal mb-8 font-serif text-4xl font-bold">
                  Pourquoi <span className="text-navy italic">AfriBayit</span> ?
                </h2>
                <div className="space-y-6">
                  <p className="text-charcoal-600 text-lg leading-relaxed">
                    Pendant trop longtemps, le marché immobilier en Afrique de l&apos;Ouest a été
                    freiné par le manque de transparence, les litiges fonciers et l&apos;insécurité
                    financière.
                  </p>
                  <p className="text-charcoal-600 text-lg leading-relaxed">
                    Nous avons construit une plateforme qui combine la puissance de l&apos;IA
                    Rebecca avec un système d&apos;Escrow rigoureux et un réseau de notaires
                    certifiés pour garantir que votre investissement est protégé à 100%.
                  </p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-start gap-4">
                    <div className="bg-emerald/10 text-emerald mt-1 rounded-lg p-2">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-bold">Sécurité Escrow</h4>
                      <p className="text-charcoal-400 text-sm">
                        Fonds bloqués jusqu&apos;à validation finale.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-gold/10 text-gold mt-1 rounded-lg p-2">
                      <Target className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-charcoal font-bold">Audit Foncier IA</h4>
                      <p className="text-charcoal-400 text-sm">
                        Vérification automatique des titres.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-navy/5 absolute inset-0 -rotate-3 rounded-[40px]" />
                <img
                  src="https://images.unsplash.com/photo-1542362567-b054bc133bc8?q=80&w=1200"
                  alt="Architecture Moderne Afrique"
                  className="relative z-10 h-[500px] w-full rounded-[40px] object-cover shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-charcoal-50 py-32">
          <div className="container mx-auto px-4">
            <div className="mb-20 text-center">
              <h2 className="text-charcoal font-serif text-4xl font-bold">
                Nos Valeurs Fondamentales
              </h2>
              <div className="bg-gold mx-auto mt-6 h-1 w-20" />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  title: 'Intégrité',
                  desc: "Nous ne faisons aucun compromis sur la légalité et l'honnêteté de nos annonces.",
                  icon: ShieldCheck,
                },
                {
                  title: 'Innovation',
                  desc: "L'IA et la Blockchain au service de la sécurisation foncière africaine.",
                  icon: Rocket,
                },
                {
                  title: 'Impact',
                  desc: "Faciliter l'accès à la propriété pour la diaspora et les locaux.",
                  icon: Heart,
                },
              ].map((value, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white p-10 shadow-sm transition-transform hover:-translate-y-2"
                >
                  <div className="bg-navy/5 text-navy mb-6 flex h-14 w-14 items-center justify-center rounded-2xl">
                    <value.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-charcoal mb-4 text-xl font-bold">{value.title}</h3>
                  <p className="text-charcoal-400 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
