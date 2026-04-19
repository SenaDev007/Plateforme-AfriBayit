import type React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const FOOTER_LINKS = {
  'Immobilier': [
    { label: 'Acheter', href: '/recherche?but=SALE' },
    { label: 'Louer', href: '/recherche?but=RENT' },
    { label: 'Court séjour', href: '/recherche?but=SHORT_TERM_RENT' },
    { label: 'Investir', href: '/investissement' },
  ],
  'Services': [
    { label: 'Hôtels', href: '/hotels' },
    { label: 'Artisans', href: '/artisans' },
    { label: 'Formation', href: '/formation' },
    { label: 'Communauté', href: '/communaute' },
  ],
  'Pays': [
    { label: '🇧🇯 Bénin', href: 'https://bj.afribayit.com' },
    { label: '🇨🇮 Côte d\'Ivoire', href: 'https://ci.afribayit.com' },
    { label: '🇧🇫 Burkina Faso', href: 'https://bf.afribayit.com' },
    { label: '🇹🇬 Togo', href: 'https://tg.afribayit.com' },
  ],
  'Légal': [
    { label: 'CGU', href: '/cgu' },
    { label: 'Confidentialité', href: '/confidentialite' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Contact', href: '/contact' },
  ],
};

export function SiteFooter(): React.ReactElement {
  return (
    <footer className="bg-charcoal text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Pied de page</h2>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="AfriBayit — Accueil">
              <span className="font-serif text-3xl font-bold">
                <span className="text-white">Afri</span>
                <span className="text-gold">Bayit</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-xs">
              La super-app immobilière pan-africaine. Achetez, vendez et louez en toute confiance.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              <a href="mailto:contact@afribayit.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Mail className="h-4 w-4 text-gold" aria-hidden="true" />
                contact@afribayit.com
              </a>
              <a href="tel:+22997000000" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
                +229 97 00 00 00
              </a>
              <p className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
                Cotonou, Bénin · Abidjan, CI
              </p>
            </div>

            {/* App badges */}
            <div className="mt-6 flex gap-3">
              <div className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/60">
                App Store — Bientôt
              </div>
              <div className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/60">
                Google Play — Bientôt
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} AfriBayit — YEHI OR Tech. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/40">🔒 Paiements sécurisés</span>
            <span className="text-xs text-white/40">✓ KYC vérifié</span>
            <span className="text-xs text-white/40">🌍 Pan-africain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
