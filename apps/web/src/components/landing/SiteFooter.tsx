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
    <footer className="bg-[#050505] pb-12 pt-24 text-white/50" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Pied de page
      </h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Newsletter (Left Col) */}
          <div className="flex flex-col justify-between lg:col-span-4">
            <div>
              <Link href="/" className="mb-6 inline-flex items-center gap-1">
                <span className="font-sans text-2xl font-black tracking-tighter text-white">
                  Afri
                </span>
                <span className="text-gold font-serif text-2xl font-normal italic">Bayit.</span>
              </Link>
              <p className="mb-10 max-w-xs text-xs font-light leading-relaxed text-white/40">
                La super-app immobilière redéfinissant la confiance et la transparence sur le
                continent africain.
              </p>
            </div>

            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-white">
                Newsletter VIP
              </p>
              <form className="relative max-w-xs">
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="focus:border-gold w-full border-b border-white/20 bg-transparent py-2 pl-0 pr-8 text-xs text-white placeholder-white/30 transition-colors focus:outline-none"
                />
                <button
                  type="button"
                  className="hover:text-gold absolute right-0 top-1/2 -translate-y-1/2 text-white/40 transition-colors"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links (Right Cols) */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-8">
            {Object.entries(FOOTER_LINKS).map(([category, links]) => (
              <div key={category}>
                <h3 className="mb-6 text-[10px] font-bold uppercase tracking-widest text-white">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href as Route}
                        className="text-xs font-light text-white/40 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-16 h-px w-full bg-white/5" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/30">
            <span>© {new Date().getFullYear()} AfriBayit Inc.</span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline">YEHI OR Tech</span>
          </div>

          <div className="flex gap-6">
            <a
              href="mailto:contact@afribayit.com"
              className="text-white/40 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </a>
            <a href="tel:+22997000000" className="text-white/40 transition-colors hover:text-white">
              <Phone className="h-4 w-4" />
              <span className="sr-only">Phone</span>
            </a>
            {[Instagram, Twitter, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="text-white/40 transition-colors hover:text-white">
                <Icon className="h-4 w-4" />
                <span className="sr-only">Social</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
