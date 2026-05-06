'use client';
import type React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  ShieldCheck,
  MapPin,
  ArrowRight,
  BarChart3,
  Lock,
  Globe,
  Users,
  CheckCircle,
} from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@afribayit/ui/src/lib/cn';
import { Badge, Button } from '@afribayit/ui';

const AVANTAGES = [
  {
    icon: BarChart3,
    title: 'Données de marché en temps réel',
    description:
      'Prix au m², taux de rendement locatif, évolution des quartiers — toutes les données dont vous avez besoin pour décider en connaissance de cause.',
  },
  {
    icon: Lock,
    title: 'Sécurité escrow garantie',
    description:
      "Chaque transaction est sécurisée via notre moteur escrow notarial. Les fonds ne sont libérés qu'après validation complète du titre foncier.",
  },
  {
    icon: ShieldCheck,
    title: 'Vérification foncière IA',
    description:
      'Notre pipeline documentaire (OCR + IA) vérifie chaque titre : TF, ACD, APFR. Zéro arnaque, zéro terrain fantôme.',
  },
  {
    icon: Globe,
    title: 'Couverture multi-pays',
    description:
      "Investissez depuis la diaspora ou localement au Bénin, Côte d'Ivoire, Sénégal et Togo avec un cadre légal adapté à chaque pays.",
  },
  {
    icon: Users,
    title: "Réseau d'experts locaux",
    description:
      'Notaires, géomètres, avocats fonciers et agents certifiés AfriBayit vous accompagnent à chaque étape de votre investissement.',
  },
  {
    icon: MapPin,
    title: 'Zones à fort potentiel identifiées',
    description:
      "Nos algorithmes cartographient les zones en développement pour vous permettre d'anticiper les plus-values avant le marché.",
  },
];

const ZONES = [
  {
    pays: 'Bénin',
    flag: '🇧🇯',
    zones: ['Fidjrossè, Cotonou', 'Calavi, Abomey-Calavi', 'Centre-ville, Porto-Novo'],
    rendement: '8–12%',
    bg: 'bg-navy',
  },
  {
    pays: "Côte d'Ivoire",
    flag: '🇨🇮',
    zones: ['Cocody, Abidjan', 'Marcory, Abidjan', 'Yamoussoukro Centre'],
    rendement: '7–11%',
    bg: 'bg-charcoal-900',
  },
  {
    pays: 'Togo',
    flag: '🇹🇬',
    zones: ['Bè, Lomé', 'Agoè-Nyivé', 'Kégué, Lomé'],
    rendement: '9–13%',
    bg: 'bg-navy',
  },
  {
    pays: 'Sénégal',
    flag: '🇸🇳',
    zones: ['Plateau, Dakar', 'Almadies, Dakar', 'Saly Portudal'],
    rendement: '6–10%',
    bg: 'bg-charcoal-900',
  },
];

const ETAPES = [
  {
    num: '01',
    title: 'Définissez votre stratégie',
    desc: 'Location longue durée, revente, développement ? Nos conseillers vous aident à poser les bases.',
  },
  {
    num: '02',
    title: 'Identifiez votre bien',
    desc: 'Filtrez par pays, zone, rendement estimé et type de propriété. Chaque annonce inclut un score IA AfriBayit.',
  },
  {
    num: '03',
    title: 'Vérifiez la foncière',
    desc: 'Notre pipeline IA vérifie le titre foncier. Un géomètre certifié valide les coordonnées GPS si besoin.',
  },
  {
    num: '04',
    title: 'Sécurisez via escrow',
    desc: "Les fonds sont déposés dans le compte séquestre AfriBayit jusqu'à validation complète de la transaction.",
  },
  {
    num: '05',
    title: 'Signez & encaissez',
    desc: 'Acte notarié, transfert de propriété, accès à votre tableau de bord investisseur en temps réel.',
  },
];

export default function InvestissementPage(): React.ReactElement {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(useTransform(scrollYProgress, [0, 0.1], [1, 0.95]), {
    stiffness: 100,
    damping: 30,
  });
  const opacityProgress = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="selection:bg-gold selection:text-navy min-h-screen bg-white">
      <SiteNavbar />

      {/* HERO — Apple Style Reveal */}
      <motion.header
        style={{ scale: scaleProgress }}
        className="bg-navy relative flex min-h-screen flex-col justify-center overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/20 absolute right-[-10%] top-[-10%] h-[800px] w-[800px] animate-pulse rounded-full blur-[160px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-white/5 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-[0.03] [background-size:48px_48px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="border-gold/30 bg-gold/5 mb-10 inline-flex items-center gap-3 rounded-full border px-6 py-2 backdrop-blur-xl"
            >
              <TrendingUp className="text-gold h-4 w-4" />
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">
                Exclusivité AfriBayit · Intelligence Foncière
              </span>
            </motion.div>

            <h1 className="mb-8 font-serif text-6xl font-bold leading-[1.1] tracking-tight text-white md:text-[100px] lg:text-[120px]">
              Investir en <span className="text-gold italic">Afrique</span>.<br />
              Sans{' '}
              <span className="relative inline-block">
                frontières.
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 1 }}
                  className="bg-gold/30 absolute bottom-4 left-0 -z-10 h-2"
                />
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="mx-auto mb-12 max-w-3xl text-xl font-light leading-relaxed text-white/60 md:text-2xl"
            >
              La première plateforme technologique sécurisant l'acquisition d'actifs immobiliers en
              Afrique de l'Ouest par l'IA et l'Escrow Notarial.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <Button
                variant="gold"
                size="lg"
                className="shadow-gold/20 h-16 rounded-full px-12 text-sm font-black uppercase tracking-widest shadow-2xl"
              >
                Explorer le catalogue
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="hover:text-navy h-16 rounded-full border-white/20 px-12 text-sm font-bold uppercase tracking-widest text-white hover:bg-white"
              >
                Parler à un conseiller
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: opacityProgress }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="flex h-12 w-6 justify-center rounded-full border-2 border-white/20 p-2">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-gold h-2 w-1 rounded-full"
            />
          </div>
        </motion.div>
      </motion.header>

      {/* Floating Stats — Tesla Style */}
      <section className="relative z-20 -mt-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[40px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl md:grid-cols-4">
            {[
              { label: 'Biens référencés', value: '4,200+' },
              { label: 'Transactions', value: '2,800+' },
              { label: 'ROI moyen', value: '9.4%' },
              { label: 'Confiance IA', value: '100%' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-navy/40 group relative p-10 text-center transition-colors hover:bg-white/5"
              >
                <div className="mb-2 font-serif text-4xl font-bold text-white">{s.value}</div>
                <div className="text-gold/60 group-hover:text-gold text-[10px] font-black uppercase tracking-[0.3em] transition-colors">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-gold mb-4 text-[10px] font-bold uppercase tracking-[0.4em]">
              Pourquoi AfriBayit
            </p>
            <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">
              L'infrastructure que vous méritez{' '}
              <span className="text-gold italic">pour investir en Afrique</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {AVANTAGES.map((a, i) => (
              <div
                key={i}
                className="border-charcoal-100 bg-charcoal-50 hover:border-navy/20 group rounded-3xl border p-8 transition-all hover:bg-white hover:shadow-xl"
              >
                <div className="bg-navy/5 group-hover:bg-navy mb-6 flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
                  <a.icon className="text-navy h-6 w-6 transition-colors group-hover:text-white" />
                </div>
                <h3 className="text-navy mb-3 font-serif text-xl font-bold">{a.title}</h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKET PULSE — Section 5.9.3 Style */}
      <section className="bg-charcoal-50 overflow-hidden py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="navy" className="mb-6 px-4 py-1">
                Market Pulse (5.9.3)
              </Badge>
              <h2 className="text-navy mb-8 font-serif text-5xl font-bold leading-tight">
                Des données <span className="text-gold italic">actionnables</span>,<br />
                pas seulement des chiffres.
              </h2>
              <p className="text-charcoal-500 mb-10 text-lg font-light leading-relaxed">
                Notre IA analyse des millions de points de données pour vous offrir une vision
                limpide du marché. De l'évolution du prix au m² à Fidjrossè jusqu'aux prévisions de
                croissance à Cocody.
              </p>
              <div className="space-y-6">
                {[
                  { label: 'Précision des prévisions IA', val: '98.2%' },
                  { label: 'Mise à jour des données', val: 'Temps Réel' },
                  { label: 'Sources certifiées', val: 'Notaires & Géomètres' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="bg-gold/20 flex h-6 w-6 items-center justify-center rounded-full">
                      <CheckCircle className="text-gold h-4 w-4" />
                    </div>
                    <span className="text-navy text-sm font-bold uppercase tracking-wider">
                      {item.label}
                    </span>
                    <div className="border-charcoal-100 flex-1 border-b border-dotted" />
                    <span className="text-gold text-sm font-black">{item.val}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-navy group relative overflow-hidden rounded-[48px] p-12 shadow-2xl">
                <div className="animate-shimmer absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(212,175,55,0.05)_50%,transparent_75%)] bg-[length:250%_250%]" />
                <div className="relative z-10">
                  <div className="mb-12 flex items-center justify-between">
                    <div>
                      <p className="text-gold mb-2 text-[10px] font-black uppercase tracking-widest">
                        Indice de Potentiel
                      </p>
                      <h4 className="font-serif text-3xl font-bold text-white">Dakar Plateau</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald text-2xl font-bold">+14.2%</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                        vs 2024
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 flex h-48 items-end gap-3">
                    {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className="bg-gold/20 group-hover:bg-gold/40 flex-1 rounded-t-lg transition-colors"
                      />
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
                    <p className="text-xs font-light italic text-white/80">
                      "Rebecca : La zone du Plateau présente un risque foncier faible (98/100) avec
                      une demande locative en hausse constante."
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ZONES À FORT POTENTIEL */}
      <section className="bg-white py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-24 max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-gold mb-6 text-[10px] font-black uppercase tracking-[0.6em]"
            >
              Écosystème AfriBayit
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-navy font-serif text-5xl font-bold leading-tight md:text-6xl"
            >
              Zones identifiées à <span className="text-gold italic">haut rendement</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {ZONES.map((z, idx) => (
              <motion.div
                key={z.pays}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={cn(
                  'hover:shadow-3xl group relative overflow-hidden rounded-[48px] p-12 transition-all duration-700 hover:-translate-y-4',
                  z.bg,
                )}
              >
                <div className="bg-gold/10 absolute right-0 top-0 h-80 w-80 -translate-y-1/2 translate-x-1/2 rounded-full blur-[100px] transition-all group-hover:blur-[140px]" />
                <div className="relative z-10">
                  <div className="mb-10 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <span className="text-5xl">{z.flag}</span>
                      <h3 className="font-serif text-3xl font-bold text-white">{z.pays}</h3>
                    </div>
                    <div className="border-gold/30 bg-gold/10 rounded-full border px-6 py-2 backdrop-blur-md">
                      <span className="text-gold text-sm font-black tracking-widest">
                        RDT: {z.rendement}
                      </span>
                    </div>
                  </div>

                  <div className="mb-12 space-y-4">
                    {z.zones.map((zone) => (
                      <div key={zone} className="group/item flex items-center gap-4 text-white/70">
                        <div className="bg-gold h-1.5 w-1.5 rounded-full transition-transform group-hover/item:scale-150" />
                        <span className="text-base font-medium tracking-wide">{zone}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/recherche?pays=${z.pays}` as any}
                    className="hover:text-gold inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white transition-colors"
                  >
                    Explorer les opportunités
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-gold mb-4 text-[10px] font-bold uppercase tracking-[0.4em]">
              De A à Z
            </p>
            <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">
              Votre investissement en <span className="text-gold italic">5 étapes claires</span>
            </h2>
          </div>

          <div className="relative">
            <div className="bg-charcoal-100 absolute left-6 top-0 hidden h-full w-px md:block" />
            <div className="space-y-12">
              {ETAPES.map((e) => (
                <div key={e.num} className="relative flex gap-8">
                  <div className="bg-navy relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full font-bold text-white shadow-lg">
                    {e.num}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-navy mb-2 font-serif text-xl font-bold">{e.title}</h3>
                    <p className="text-charcoal-500 max-w-xl text-sm leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-navy relative overflow-hidden py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/10 absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl">
            Prêt à faire croître votre patrimoine{' '}
            <span className="text-gold italic">en Afrique ?</span>
          </h2>
          <p className="mb-10 text-lg text-white/70">
            Rejoignez des centaines d'investisseurs qui font confiance à AfriBayit pour sécuriser
            leurs actifs immobiliers sur le continent.
          </p>
          <Link
            href={'/recherche?but=SALE' as any}
            className="bg-gold text-navy group inline-flex items-center gap-2 rounded-full px-10 py-5 font-bold shadow-lg transition-all hover:scale-105"
          >
            Voir les opportunités
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
