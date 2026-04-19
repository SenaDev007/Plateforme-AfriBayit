'use client';

import * as React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

const COUNTRIES = [
  { code: 'bj', label: 'Bénin', flag: '🇧🇯' },
  { code: 'ci', label: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: 'bf', label: 'Burkina Faso', flag: '🇧🇫' },
  { code: 'tg', label: 'Togo', flag: '🇹🇬' },
];

interface NavLink {
  label: string;
  href: string;
}

interface NavbarProps {
  /** Current country code */
  currentCountry?: string;
  onCountryChange?: (code: string) => void;
  links?: NavLink[];
  /** User display name if logged in */
  userName?: string;
  userAvatar?: string;
  onLogin?: () => void;
  onRegister?: () => void;
  onLogout?: () => void;
  className?: string;
}

/** Sticky glassmorphism navbar with country selector */
export function Navbar({
  currentCountry = 'bj',
  onCountryChange,
  links = [],
  userName,
  userAvatar,
  onLogin,
  onRegister,
  className,
}: NavbarProps): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCountryOpen, setIsCountryOpen] = React.useState(false);
  const { scrollY } = useScroll();

  // Navbar becomes more opaque on scroll
  const bgOpacity = useTransform(scrollY, [0, 80], [0.6, 0.95]);

  const currentFlag = COUNTRIES.find((c) => c.code === currentCountry)?.flag ?? '🌍';

  return (
    <motion.nav
      role="navigation"
      aria-label="Navigation principale"
      style={{ backgroundColor: `rgba(255,255,255,${bgOpacity})` }}
      className={cn(
        'fixed inset-x-0 top-0 z-50',
        'border-b border-white/30 backdrop-blur-glass',
        'shadow-glass transition-shadow duration-300',
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-sm"
          aria-label="AfriBayit — Accueil"
        >
          <span className="font-serif text-2xl font-bold text-navy">Afri</span>
          <span className="font-serif text-2xl font-bold text-gold">Bayit</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-charcoal transition-colors hover:text-navy"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Country selector */}
          <div className="relative">
            <button
              onClick={() => setIsCountryOpen((v) => !v)}
              aria-expanded={isCountryOpen}
              aria-haspopup="listbox"
              aria-label="Sélectionner le pays"
              className={cn(
                'flex items-center gap-1.5 rounded-pill border border-charcoal-200',
                'px-3 py-1.5 text-sm text-charcoal',
                'hover:border-navy/40 hover:bg-navy/5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
                'transition-colors',
              )}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{currentFlag}</span>
              <ChevronDown
                className={cn('h-3 w-3 transition-transform', isCountryOpen && 'rotate-180')}
                aria-hidden="true"
              />
            </button>

            {isCountryOpen && (
              <ul
                role="listbox"
                aria-label="Pays disponibles"
                className={cn(
                  'absolute right-0 mt-1 w-44 rounded-lg bg-white',
                  'border border-charcoal-100 shadow-card-hover py-1 z-10',
                )}
              >
                {COUNTRIES.map((country) => (
                  <li key={country.code} role="option" aria-selected={country.code === currentCountry}>
                    <button
                      onClick={() => {
                        onCountryChange?.(country.code);
                        setIsCountryOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-sm',
                        'hover:bg-navy/5 transition-colors',
                        country.code === currentCountry && 'font-medium text-navy bg-navy/5',
                      )}
                    >
                      <span>{country.flag}</span>
                      <span>{country.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Auth buttons */}
          {userName ? (
            <div className="flex items-center gap-2">
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="h-8 w-8 rounded-full object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-white text-xs font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={onLogin}
                className="text-sm font-medium text-charcoal hover:text-navy transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={onRegister}
                className={cn(
                  'rounded-pill bg-navy px-4 py-1.5 text-sm font-medium text-white',
                  'hover:bg-navy-600 transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2',
                )}
              >
                S'inscrire
              </button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="lg:hidden rounded-md p-2 text-charcoal hover:bg-charcoal-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            {isMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="border-t border-charcoal-100 bg-white/95 backdrop-blur-glass lg:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm font-medium text-charcoal hover:bg-navy/5 hover:text-navy transition-colors"
              >
                {link.label}
              </a>
            ))}
            {!userName && (
              <div className="flex gap-2 pt-2 border-t border-charcoal-100 mt-2">
                <button onClick={onLogin} className="flex-1 py-2 text-sm font-medium text-navy border border-navy rounded-pill">
                  Connexion
                </button>
                <button onClick={onRegister} className="flex-1 py-2 text-sm font-medium text-white bg-navy rounded-pill">
                  S'inscrire
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
