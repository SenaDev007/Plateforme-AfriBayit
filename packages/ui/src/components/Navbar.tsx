'use client';

import * as React from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

const COUNTRIES = [
  { code: 'bj', label: 'Bénin', flag: '🇧🇯' },
  { code: 'ci', label: "Côte d'Ivoire", flag: '🇨🇮' },
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
  transparentOnTop?: boolean;
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
  transparentOnTop = false,
}: NavbarProps): React.ReactElement {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCountryOpen, setIsCountryOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(!transparentOnTop);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (transparentOnTop) {
      setIsScrolled(latest > 50);
    }
  });

  const currentFlag = COUNTRIES.find((c) => c.code === currentCountry)?.flag ?? '🌍';
  const isDarkText = isScrolled || !transparentOnTop;

  return (
    <motion.nav
      role="navigation"
      aria-label="Navigation principale"
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500',
        isScrolled
          ? 'backdrop-blur-glass border-charcoal-100 shadow-glass border-b bg-white/95'
          : 'border-b border-transparent bg-transparent',
        className,
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-6 lg:px-8',
          isScrolled ? 'h-16' : 'h-24',
        )}
      >
        {/* Logo */}
        <a
          href="/"
          className="focus-visible:ring-gold group flex items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2"
          aria-label="AfriBayit — Accueil"
        >
          {/* Logo Mark */}
          <div className="bg-gold/10 relative mr-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105">
            <div className="from-gold-300 to-gold-600 absolute inset-0 bg-gradient-to-br opacity-20" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-gold relative z-10 h-5 w-5"
            >
              <path
                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 22V12H15V22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span
            className={cn(
              'font-serif text-2xl font-bold transition-colors duration-300',
              isDarkText ? 'text-navy' : 'text-white',
            )}
          >
            Afri
          </span>
          <span className="text-gold font-serif text-2xl font-bold">Bayit</span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                'group relative text-sm font-medium transition-colors',
                isDarkText ? 'text-charcoal-600 hover:text-navy' : 'text-white/90 hover:text-white',
              )}
            >
              {link.label}
              <span className="bg-gold absolute -bottom-1 left-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Country selector */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setIsCountryOpen((v) => !v)}
              aria-expanded={isCountryOpen}
              aria-haspopup="listbox"
              className={cn(
                'rounded-pill flex items-center gap-1.5 border px-3 py-1.5 text-sm transition-colors',
                'focus-visible:ring-gold focus-visible:outline-none focus-visible:ring-2',
                isDarkText
                  ? 'border-charcoal-200 text-charcoal hover:border-navy/40 hover:bg-navy/5'
                  : 'border-white/30 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/10',
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
                className={cn(
                  'absolute right-0 mt-2 w-44 rounded-xl bg-white',
                  'border-charcoal-100 shadow-glass-lg z-10 overflow-hidden border py-2',
                )}
              >
                {COUNTRIES.map((country) => (
                  <li
                    key={country.code}
                    role="option"
                    aria-selected={country.code === currentCountry}
                  >
                    <button
                      onClick={() => {
                        onCountryChange?.(country.code);
                        setIsCountryOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 px-4 py-2.5 text-sm',
                        'hover:bg-navy/5 text-charcoal transition-colors',
                        country.code === currentCountry && 'text-navy bg-navy/5 font-medium',
                      )}
                    >
                      <span className="text-lg leading-none">{country.flag}</span>
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
                <img
                  src={userAvatar}
                  alt={userName}
                  className="ring-gold/50 h-9 w-9 rounded-full object-cover ring-2"
                />
              ) : (
                <div className="bg-navy ring-gold/50 flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold text-white ring-2">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-4 sm:flex">
              <button
                onClick={onLogin}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isDarkText
                    ? 'text-charcoal-600 hover:text-navy'
                    : 'text-white/90 hover:text-white',
                )}
              >
                Connexion
              </button>
              <button
                onClick={onRegister}
                className={cn(
                  'rounded-pill px-5 py-2.5 text-sm font-medium transition-all duration-300',
                  'focus-visible:ring-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  'hover:scale-105 active:scale-95',
                  isScrolled
                    ? 'bg-navy hover:bg-navy-600 text-white shadow-md'
                    : 'bg-gold text-navy hover:bg-gold-400 shadow-[0_0_20px_rgba(212,175,55,0.4)]',
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
            className={cn(
              'focus-visible:ring-gold rounded-md p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 lg:hidden',
              isDarkText ? 'text-charcoal hover:bg-charcoal-50' : 'text-white hover:bg-white/10',
            )}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="border-charcoal-100 shadow-glass-lg absolute top-full w-full border-t bg-white lg:hidden"
        >
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-charcoal hover:bg-navy/5 hover:text-navy block rounded-lg px-4 py-3 text-base font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
            {!userName && (
              <div className="border-charcoal-100 mt-4 flex flex-col gap-3 border-t pt-4">
                <button
                  onClick={onLogin}
                  className="text-navy border-navy rounded-pill hover:bg-navy/5 w-full border py-3 text-sm font-medium transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={onRegister}
                  className="bg-navy rounded-pill hover:bg-navy-600 w-full py-3 text-sm font-medium text-white transition-colors"
                >
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
