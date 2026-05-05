'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const COUNTRIES = [
  { code: 'bj', label: 'Bénin', flag: '🇧🇯', domain: 'bj.afribayit.com' },
  { code: 'ci', label: "Côte d'Ivoire", flag: '🇨🇮', domain: 'ci.afribayit.com' },
  { code: 'sn', label: 'Sénégal', flag: '🇸🇳', domain: 'sn.afribayit.com' },
  { code: 'tg', label: 'Togo', flag: '🇹🇬', domain: 'tg.afribayit.com' },
  { code: 'bf', label: 'Burkina Faso', flag: '🇧🇫', domain: 'bf.afribayit.com' },
  { code: 'cm', label: 'Cameroun', flag: '🇨🇲', domain: 'cm.afribayit.com' },
  { code: 'ng', label: 'Nigeria', flag: '🇳🇬', domain: 'ng.afribayit.com' },
];

/**
 * Premium Country Selector for AfriBayit.
 * Features: Subdomain redirection, Glassmorphism, Search, and Brand Identity.
 */
export function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (domain: string) => {
    if (typeof window !== 'undefined') {
      const isProduction = window.location.hostname.includes('afribayit.com');
      if (isProduction) {
        window.location.href = `https://${domain}`;
      } else {
        console.log(`[Dev] Redirecting to: ${domain}`);
        setIsOpen(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hover:border-gold/30 group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:bg-white/10"
      >
        <Globe className="text-gold h-4 w-4" />
        <span className="text-xs font-bold uppercase tracking-widest text-white/90 group-hover:text-white">
          Sélecteur de Pays
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="bg-navy/95 shadow-glass-lg backdrop-blur-glass absolute right-0 z-50 mt-4 w-80 overflow-hidden rounded-[24px] border border-white/10"
            >
              <div className="p-4">
                {/* Search Header */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Rechercher un pays..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="focus:border-gold/30 w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white transition-colors placeholder:text-white/20 focus:outline-none"
                  />
                </div>

                <div className="custom-scrollbar max-h-[300px] space-y-1 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleSelect(country.domain)}
                        className="group flex w-full items-center justify-between rounded-xl px-4 py-3 transition-all duration-300 hover:bg-white/10"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl leading-none">{country.flag}</span>
                          <div className="text-left">
                            <p className="group-hover:text-gold text-sm font-bold text-white transition-colors">
                              {country.label}
                            </p>
                            <p className="text-[10px] uppercase tracking-tighter text-white/40">
                              {country.domain}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="group-hover:text-gold h-4 w-4 transform text-white/10 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))
                  ) : (
                    <div className="py-8 text-center">
                      <p className="font-sans text-xs italic text-white/30">Aucun pays trouvé</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="bg-gold/5 border-t border-white/5 p-4 text-center">
                <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">
                  Plus de destinations à venir
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
