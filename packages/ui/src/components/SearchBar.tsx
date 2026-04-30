'use client';

import * as React from 'react';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

type SearchPurpose = 'SALE' | 'RENT' | 'SHORT_TERM_RENT';

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
  compact?: boolean;
  variant?: 'default' | 'hero';
}

interface SearchParams {
  query: string;
  city: string;
  purpose: SearchPurpose;
  type: string;
}

const PURPOSES: { value: SearchPurpose; label: string }[] = [
  { value: 'SALE', label: 'Acheter' },
  { value: 'RENT', label: 'Louer' },
  { value: 'SHORT_TERM_RENT', label: 'Court séjour' },
];

const PROPERTY_TYPES = [
  { value: '', label: 'Tous les types' },
  { value: 'HOUSE', label: 'Maison' },
  { value: 'APARTMENT', label: 'Appartement' },
  { value: 'LAND', label: 'Terrain' },
  { value: 'VILLA', label: 'Villa' },
  { value: 'COMMERCIAL', label: 'Commercial' },
];

/** Search bar with purpose tabs */
export function SearchBar({
  onSearch,
  className,
  compact = false,
  variant = 'default',
}: SearchBarProps): React.ReactElement {
  const [purpose, setPurpose] = React.useState<SearchPurpose>('SALE');
  const [query, setQuery] = React.useState('');
  const [city, setCity] = React.useState('');
  const [type, setType] = React.useState('');

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    onSearch?.({ query, city, purpose, type });
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Purpose tabs */}
      <div className="mb-0 flex w-fit gap-1" role="tablist" aria-label="Type de recherche">
        {PURPOSES.map((p) => (
          <button
            key={p.value}
            role="tab"
            aria-selected={purpose === p.value}
            onClick={() => setPurpose(p.value)}
            className={cn(
              'relative overflow-hidden rounded-t-xl px-6 py-3.5 text-sm font-medium transition-all duration-300',
              purpose === p.value
                ? 'text-navy bg-white'
                : variant === 'hero'
                  ? 'bg-white/20 text-white backdrop-blur-md hover:bg-white/30'
                  : 'bg-charcoal-50 text-charcoal-500 hover:bg-charcoal-100',
            )}
          >
            {purpose === p.value && <span className="bg-gold absolute left-0 top-0 h-1 w-full" />}
            {p.label}
          </button>
        ))}
      </div>

      {/* Search form */}
      <form
        onSubmit={handleSubmit}
        role="search"
        aria-label="Rechercher une propriété"
        className={cn(
          'flex flex-col gap-0 rounded-b-2xl rounded-tr-2xl bg-white md:flex-row',
          'shadow-navy-900/30 shadow-2xl',
          compact ? 'p-2' : 'p-3',
        )}
      >
        {/* Keyword */}
        <div className="group relative flex flex-1 items-center">
          <Search
            className="text-charcoal-300 group-focus-within:text-gold pointer-events-none absolute left-4 h-5 w-5 transition-colors"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mot-clé, référence, quartier…"
            aria-label="Mots-clés"
            className={cn(
              'text-charcoal w-full bg-transparent py-4 pl-12 pr-4 text-base',
              'border-charcoal-100 md:border-r',
              'placeholder:text-charcoal-300 focus:outline-none',
            )}
          />
        </div>

        {/* City */}
        <div className="group relative flex items-center md:w-56">
          <MapPin
            className="text-charcoal-300 group-focus-within:text-gold pointer-events-none absolute left-4 h-5 w-5 transition-colors"
            aria-hidden="true"
          />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ville (ex: Cotonou)"
            aria-label="Ville"
            className={cn(
              'text-charcoal w-full bg-transparent py-4 pl-12 pr-4 text-base',
              'border-charcoal-100 md:border-r',
              'placeholder:text-charcoal-300 focus:outline-none',
            )}
          />
        </div>

        {/* Property type */}
        <div className="group relative flex items-center md:w-48">
          <Home
            className="text-charcoal-300 group-focus-within:text-gold pointer-events-none absolute left-4 h-5 w-5 transition-colors"
            aria-hidden="true"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Type de bien"
            className={cn(
              'text-charcoal w-full appearance-none bg-transparent py-4 pl-12 pr-10 text-base',
              'cursor-pointer focus:outline-none',
            )}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="text-charcoal-300 pointer-events-none absolute right-4 h-4 w-4"
            aria-hidden="true"
          />
        </div>

        {/* Submit */}
        <div
          className={cn('mt-2 flex items-center md:ml-2 md:mt-0', compact ? '' : 'min-w-[150px]')}
        >
          <button
            type="submit"
            className={cn(
              'flex w-full items-center justify-center gap-2',
              'bg-navy rounded-xl text-base font-semibold text-white',
              'px-8 py-4 transition-all duration-300',
              'hover:bg-navy-600 hover:shadow-navy/30 hover:shadow-lg active:scale-95',
              'focus-visible:ring-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            )}
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className={cn('inline', compact && 'md:hidden')}>Rechercher</span>
          </button>
        </div>
      </form>
    </div>
  );
}
