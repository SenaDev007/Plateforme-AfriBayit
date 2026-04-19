'use client';

import * as React from 'react';
import { Search, MapPin, Home, ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

type SearchPurpose = 'SALE' | 'RENT' | 'SHORT_TERM_RENT';

interface SearchBarProps {
  onSearch?: (params: SearchParams) => void;
  className?: string;
  compact?: boolean;
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

/** Hero search bar with purpose tabs */
export function SearchBar({ onSearch, className, compact = false }: SearchBarProps): React.ReactElement {
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
      <div className="flex gap-0 mb-0 w-fit" role="tablist" aria-label="Type de recherche">
        {PURPOSES.map((p) => (
          <button
            key={p.value}
            role="tab"
            aria-selected={purpose === p.value}
            onClick={() => setPurpose(p.value)}
            className={cn(
              'px-5 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200',
              purpose === p.value
                ? 'bg-white text-navy shadow-sm'
                : 'bg-white/50 text-charcoal-400 hover:bg-white/70 hover:text-charcoal',
            )}
          >
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
          'flex flex-col sm:flex-row gap-0 bg-white rounded-b-xl rounded-tr-xl',
          'shadow-glass-lg border border-white/60',
          compact ? 'p-2' : 'p-3',
        )}
      >
        {/* Keyword */}
        <div className="relative flex-1 flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-charcoal-300 pointer-events-none" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mot-clé, référence…"
            aria-label="Mots-clés"
            className={cn(
              'w-full pl-9 pr-3 py-2.5 text-sm text-charcoal bg-transparent',
              'border-r border-charcoal-100',
              'focus:outline-none placeholder:text-charcoal-300',
            )}
          />
        </div>

        {/* City */}
        <div className="relative flex items-center sm:w-44">
          <MapPin className="absolute left-3 h-4 w-4 text-charcoal-300 pointer-events-none" aria-hidden="true" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ville"
            aria-label="Ville"
            className={cn(
              'w-full pl-9 pr-3 py-2.5 text-sm text-charcoal bg-transparent',
              'border-r border-charcoal-100',
              'focus:outline-none placeholder:text-charcoal-300',
            )}
          />
        </div>

        {/* Property type */}
        <div className="relative flex items-center sm:w-44">
          <Home className="absolute left-3 h-4 w-4 text-charcoal-300 pointer-events-none" aria-hidden="true" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Type de bien"
            className={cn(
              'w-full appearance-none pl-9 pr-8 py-2.5 text-sm text-charcoal bg-transparent',
              'border-r border-charcoal-100',
              'focus:outline-none cursor-pointer',
            )}
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 h-3.5 w-3.5 text-charcoal-300 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={cn(
            'flex items-center justify-center gap-2',
            'bg-navy text-white font-medium text-sm rounded-lg',
            'px-6 py-2.5 transition-all duration-200',
            'hover:bg-navy-600 active:scale-95',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy focus-visible:ring-offset-2',
          )}
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Rechercher</span>
        </button>
      </form>
    </div>
  );
}
