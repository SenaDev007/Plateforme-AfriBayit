'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import {
  Sun,
  Moon,
  ChevronUp,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Heart,
  Twitter,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// THEME TOGGLE & SCROLL TOP
// ============================================================================

function handleScrollTop() {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  });
}

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
        <button
          onClick={() => setTheme('light')}
          className={cn(
            'rounded-full p-2 transition-all',
            theme === 'light' ? 'bg-gold text-navy' : 'text-white/40 hover:text-white',
          )}
        >
          <Sun className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Clair</span>
        </button>

        <button
          type="button"
          onClick={handleScrollTop}
          className="hover:text-gold mx-2 text-white/40 transition-colors"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="sr-only">Haut</span>
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={cn(
            'rounded-full p-2 transition-all',
            theme === 'dark' ? 'bg-gold text-navy' : 'text-white/40 hover:text-white',
          )}
        >
          <Moon className="h-4 w-4" strokeWidth={1.5} />
          <span className="sr-only">Sombre</span>
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// NAVIGATION DATA
// ============================================================================

const NAVIGATION = {
  categories: [
    {
      id: 'platform',
      name: 'Plateforme',
      sections: [
        {
          id: 'services',
          name: 'Services',
          items: [
            { name: 'Acheter', href: '/recherche?but=SALE' },
            { name: 'Louer', href: '/recherche?but=RENT' },
            { name: 'Investir', href: '/investissement' },
            { name: 'Hôtels', href: '/hotels' },
          ],
        },
        {
          id: 'trust',
          name: 'Confiance',
          items: [
            { name: 'Audit Foncier', href: '/audit' },
            { name: 'Séquestre', href: '/securite' },
            { name: 'GeoTrust', href: '/geotrust' },
            { name: 'Notaires', href: '/notaires' },
          ],
        },
        {
          id: 'countries',
          name: 'Pays',
          items: [
            { name: 'Bénin', href: 'https://bj.afribayit.com' },
            { name: "Côte d'Ivoire", href: 'https://ci.afribayit.com' },
            { name: 'Sénégal', href: 'https://sn.afribayit.com' },
            { name: 'Togo', href: 'https://tg.afribayit.com' },
          ],
        },
        {
          id: 'company',
          name: 'Compagnie',
          items: [
            { name: 'À Propos', href: '/about' },
            { name: 'Blog', href: '/blog' },
            { name: 'Carrières', href: '/jobs' },
            { name: 'Contact', href: '/contact' },
          ],
        },
        {
          id: 'legal',
          name: 'Légal',
          items: [
            { name: 'CGU', href: '/terms' },
            { name: 'Confidentialité', href: '/privacy' },
            { name: 'Cookies', href: '/cookies' },
          ],
        },
      ],
    },
  ],
};

const SOCIAL_LINKS = [
  { icon: Mail, href: 'mailto:contact@afribayit.com', label: 'Email' },
  { icon: Twitter, href: 'https://x.com/afribayit', label: 'X' },
  { icon: Instagram, href: 'https://instagram.com/afribayit', label: 'Instagram' },
  { icon: MessageCircle, href: 'https://wa.me/afribayit', label: 'WhatsApp' },
  { icon: Linkedin, href: 'https://linkedin.com/company/afribayit', label: 'LinkedIn' },
  { icon: Facebook, href: 'https://facebook.com/afribayit', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/@afribayit', label: 'YouTube' },
];

const socialItemClass =
  'hover:-translate-y-1 border border-white/10 rounded-xl p-2.5 transition-all hover:border-gold/50 hover:bg-gold/5 text-white/40 hover:text-gold';

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================

export function SiteFooter() {
  return (
    <footer className="bg-navy border-t border-white/10 px-4 py-16">
      {/* Brand Section */}
      <div className="relative mx-auto grid max-w-7xl items-center justify-center gap-12 border-b border-white/5 pb-16 md:flex md:gap-16">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center gap-1">
            <span className="font-sans text-2xl font-black tracking-tighter text-white">Afri</span>
            <span className="text-gold font-serif text-2xl font-normal italic">Bayit.</span>
          </div>
        </Link>
        <p className="max-w-2xl text-center text-xs font-light leading-relaxed text-white/40 md:text-left">
          AfriBayit est la plateforme de référence pour l&apos;investissement immobilier sécurisé en
          Afrique de l&apos;Ouest. Nous combinons technologie de pointe, expertise juridique et
          accompagnement local pour transformer vos idées en actifs immobiliers tangibles. Notre
          mission est de démocratiser l&apos;accès à la propriété avec une transparence totale et
          une sécurité sans compromis.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-12 leading-6 sm:grid-cols-3 lg:grid-cols-5">
          {NAVIGATION.categories[0]?.sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-gold mb-6 text-[10px] font-bold uppercase tracking-[0.3em]">
                {section.name}
              </h3>
              <ul role="list" className="flex flex-col space-y-4">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href as any}
                      className="hover:text-gold text-xs font-medium text-white/40 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Socials & Theme */}
      <div className="flex flex-col items-center justify-center gap-8 border-t border-white/5 py-8">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {SOCIAL_LINKS.map((social, index) => {
            const Icon = social.icon as any;
            return (
              <Link
                key={index}
                aria-label={social.label}
                href={social.href as any}
                rel="noreferrer"
                target="_blank"
                className={socialItemClass}
              >
                <Icon strokeWidth={1.5} className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
        <ThemeToggle />
      </div>

      {/* Bottom Copyright */}
      <div className="mx-auto mt-10 flex flex-col items-center justify-center text-[10px] uppercase tracking-widest text-white/20">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span> © {new Date().getFullYear()} </span>
          <span>Fait avec</span>
          <Heart className="text-gold mx-1 h-3 w-3 animate-pulse" />
          <span> pour l'Afrique</span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
