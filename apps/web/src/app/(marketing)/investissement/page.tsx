import type React from 'react';
import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'Investir en Afrique | AfriBayit',
  description:
    "Investissez dans l'immobilier africain en toute sécurité. Données de marché, zones à fort potentiel, escrow notarial et accompagnement juridique au Bénin, Côte d'Ivoire, Sénégal et Togo.",
};

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
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      {/* HERO */}
      <header className="bg-navy relative overflow-hidden pb-32 pt-36">
        <div className="pointer-events-none absolute inset-0">
          <div className="bg-gold/10 absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/3 translate-x-1/3 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/4 translate-y-1/4 rounded-full bg-white/5 blur-[100px]" />
          <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] opacity-5 [background-size:32px_32px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-md">
              <TrendingUp className="text-gold h-4 w-4" />
              <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">
                Rendements 6–13% · Données temps réel
              </span>
            </div>

            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-white md:text-7xl">
              Investissez dans l'immobilier africain.{' '}
              <span className="text-gold italic">En toute sécurité.</span>
            </h1>

            <p className="mb-10 max-w-2xl text-lg font-light leading-relaxed text-white/80">
              Des données de marché fiables, un escrow notarial, une vérification IA du titre
              foncier. AfriBayit transforme l'investissement immobilier en Afrique de l'Ouest en une
              opération transparente et sécurisée.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href={'/recherche?but=SALE' as any}
                className="bg-gold text-navy shadow-gold/20 group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold shadow-lg transition-all hover:scale-105"
              >
                Voir les opportunités
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href={'/contact' as any}
                className="inline-flex items-center justify-center rounded-full border-2 border-white/30 px-8 py-4 font-bold text-white transition-all hover:border-white hover:bg-white/5"
              >
                Parler à un conseiller
              </Link>
            </div>
          </div>
        </div>

        {/* Floating stats */}
        <div className="relative z-10 mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md md:grid-cols-4">
            {[
              { label: 'Biens référencés', value: '4,200+' },
              { label: 'Transactions sécurisées', value: '2,800+' },
              { label: 'Rendement moyen', value: '9.4%' },
              { label: 'Pays opérationnels', value: '4' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

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

      {/* ZONES À FORT POTENTIEL */}
      <section className="bg-charcoal-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-gold mb-4 text-[10px] font-bold uppercase tracking-[0.4em]">
              Cartographie du potentiel
            </p>
            <h2 className="text-navy font-serif text-4xl font-bold md:text-5xl">
              Zones identifiées à <span className="text-gold italic">fort rendement</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ZONES.map((z) => (
              <div
                key={z.pays}
                className={`group relative overflow-hidden rounded-3xl ${z.bg} p-8 transition-all hover:shadow-2xl`}
              >
                <div className="bg-gold/10 absolute right-0 top-0 h-48 w-48 -translate-y-1/3 translate-x-1/3 rounded-full blur-[60px]" />
                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{z.flag}</span>
                      <h3 className="font-serif text-2xl font-bold text-white">{z.pays}</h3>
                    </div>
                    <div className="border-gold/30 bg-gold/10 rounded-full border px-4 py-1.5">
                      <span className="text-gold text-sm font-bold">Rdt: {z.rendement}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {z.zones.map((zone) => (
                      <div key={zone} className="flex items-center gap-3 text-white/80">
                        <CheckCircle className="text-gold h-4 w-4 flex-shrink-0" />
                        <span className="text-sm font-medium">{zone}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/recherche?pays=${z.pays}` as any}
                    className="hover:text-gold mt-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/60 transition-all"
                  >
                    Explorer les biens <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
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
