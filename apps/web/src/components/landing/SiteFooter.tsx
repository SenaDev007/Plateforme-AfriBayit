'use client';
import type React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const FOOTER_LINKS: Record<string, { label: string; href: Route | string }[]> = {
  Plateforme: [
    { label: 'Acheter', href: '/recherche?but=SALE' },
    { label: 'Louer', href: '/recherche?but=RENT' },
    { label: 'Hôtels & Résidences', href: '/hotels' },
    { label: 'Investissement', href: '/investissement' },
  ],
  Écosystème: [
    { label: 'Artisans BTP', href: '/artisans' },
    { label: 'AfriBayit Academy', href: '/formation' },
    { label: 'Communauté', href: '/communaute' },
    { label: 'GeoTrust', href: '/geotrust' },
  ],
  Pays: [
    { label: '🇧🇯 Bénin', href: 'https://bj.afribayit.com' },
    { label: "🇨🇮 Côte d'Ivoire", href: 'https://ci.afribayit.com' },
    { label: '🇧🇫 Burkina Faso', href: 'https://bf.afribayit.com' },
    { label: '🇹🇬 Togo', href: 'https://tg.afribayit.com' },
  ],
  Légal: [
    { label: 'Conditions Générales', href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'Sécurité & Escrow', href: '/securite' },
    { label: 'Support & Contact', href: '/contact' },
  ],
};

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="bg-charcoal-900 pb-12 pt-24 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Pied de page
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top: Brand + Newsletter */}
        <div className="grid grid-cols-1 gap-16 border-b border-white/5 pb-20 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-1">
              <span className="font-serif text-3xl font-bold text-white">Afri</span>
              <span className="text-gold font-serif text-3xl font-bold">Bayit</span>
            </Link>
            <p className="max-w-md text-lg font-light leading-relaxed text-white/50">
              La super-app immobilière redéfinissant la confiance et la transparence sur le
              continent africain.
            </p>

            {/* Socials */}
            <div className="flex gap-5">
              {[Instagram, Twitter, Linkedin, Facebook].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ y: -3, color: '#D4AF37' }}
                  className="hover:border-gold/50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/5 bg-white/5 p-8 md:p-10">
              <h3 className="mb-4 font-serif text-xl font-bold">Restez informé</h3>
              <p className="mb-8 text-sm text-white/40">
                Recevez en priorité les nouvelles opportunités d'investissement et les mises à jour
                législatives.
              </p>
              <form className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="focus:ring-gold/50 flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-4 text-sm transition-all focus:outline-none focus:ring-2"
                />
                <button className="bg-gold text-navy hover:bg-gold-400 flex items-center justify-center gap-2 rounded-full px-8 py-4 font-bold transition-all">
                  S'ABONNER
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Middle: Links */}
        <div className="grid grid-cols-2 gap-12 border-b border-white/5 py-20 md:grid-cols-4">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-white">
                {category}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href as Route}
                      className="hover:text-gold group flex items-center text-sm text-white/40 transition-colors duration-300"
                    >
                      <span className="bg-gold mr-0 h-px w-0 transition-all duration-300 group-hover:mr-2 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: Contact + Copyright */}
        <div className="flex flex-col items-center justify-between gap-12 pt-12 md:flex-row">
          <div className="flex flex-wrap justify-center gap-8 md:justify-start">
            <a
              href="mailto:contact@afribayit.com"
              className="flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
            >
              <Mail className="text-gold h-4 w-4" />
              contact@afribayit.com
            </a>
            <a
              href="tel:+22997000000"
              className="flex items-center gap-2 text-xs text-white/40 transition-colors hover:text-white"
            >
              <Phone className="text-gold h-4 w-4" />
              +229 97 00 00 00
            </a>
            <span className="flex items-center gap-2 text-xs text-white/40">
              <MapPin className="text-gold h-4 w-4" />
              Cotonou · Abidjan · Ouaga
            </span>
          </div>

          <div className="flex flex-col items-center gap-3 md:items-end">
            <div className="flex gap-4">
              <img
                src="https://img.shields.io/badge/App_Store-Coming_Soon-gold?style=flat-square&logo=apple"
                alt="App Store"
              />
              <img
                src="https://img.shields.io/badge/Google_Play-Coming_Soon-navy?style=flat-square&logo=googleplay"
                alt="Play Store"
              />
            </div>
            <p className="text-[10px] uppercase tracking-widest text-white/20">
              © {new Date().getFullYear()} AfriBayit Technologies — YEHI OR Tech. Tous droits
              réservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
