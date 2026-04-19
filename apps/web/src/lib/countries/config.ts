/** Country configuration for multitenancy — one config per supported country */
export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  currencyLocale: string;
  phone: {
    prefix: string;
    placeholder: string;
    pattern: string;
  };
  languages: string[];
  defaultLanguage: string;
  timezone: string;
  mapCenter: { lat: number; lng: number; zoom: number };
  /** Featured cities for quick search */
  cities: string[];
  /** Local regulations note */
  regulationNote?: string;
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  bj: {
    code: 'bj',
    name: 'Bénin',
    flag: '🇧🇯',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    currencyLocale: 'fr-BJ',
    phone: {
      prefix: '+229',
      placeholder: '97 00 00 00',
      pattern: '^(\\+229)?[0-9]{8}$',
    },
    languages: ['fr'],
    defaultLanguage: 'fr',
    timezone: 'Africa/Porto-Novo',
    mapCenter: { lat: 6.3703, lng: 2.3912, zoom: 12 },
    cities: ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey-Calavi', 'Bohicon'],
  },
  ci: {
    code: 'ci',
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    currencyLocale: 'fr-CI',
    phone: {
      prefix: '+225',
      placeholder: '07 00 00 00 00',
      pattern: '^(\\+225)?[0-9]{10}$',
    },
    languages: ['fr'],
    defaultLanguage: 'fr',
    timezone: 'Africa/Abidjan',
    mapCenter: { lat: 5.3481, lng: -4.0111, zoom: 12 },
    cities: ['Abidjan', 'Bouaké', 'San-Pédro', 'Yamoussoukro', 'Korhogo', 'Grand-Bassam'],
  },
  bf: {
    code: 'bf',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    currencyLocale: 'fr-BF',
    phone: {
      prefix: '+226',
      placeholder: '70 00 00 00',
      pattern: '^(\\+226)?[0-9]{8}$',
    },
    languages: ['fr'],
    defaultLanguage: 'fr',
    timezone: 'Africa/Ouagadougou',
    mapCenter: { lat: 12.3547, lng: -1.5354, zoom: 12 },
    cities: ['Ouagadougou', 'Bobo-Dioulasso', 'Koudougou', 'Banfora', 'Ouahigouya'],
  },
  tg: {
    code: 'tg',
    name: 'Togo',
    flag: '🇹🇬',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    currencyLocale: 'fr-TG',
    phone: {
      prefix: '+228',
      placeholder: '90 00 00 00',
      pattern: '^(\\+228)?[0-9]{8}$',
    },
    languages: ['fr'],
    defaultLanguage: 'fr',
    timezone: 'Africa/Lome',
    mapCenter: { lat: 6.1375, lng: 1.2124, zoom: 12 },
    cities: ['Lomé', 'Sokodé', 'Kara', 'Palimé', 'Atakpamé', 'Aného'],
  },
};

/** Get country config — defaults to Bénin */
export function getCountryConfig(code: string): CountryConfig {
  return COUNTRY_CONFIGS[code.toLowerCase()] ?? COUNTRY_CONFIGS['bj']!;
}

/** Format price with country currency */
export function formatPrice(amount: number, countryCode: string): string {
  const config = getCountryConfig(countryCode);
  if (config.currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} M ${config.currencySymbol}`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)} K ${config.currencySymbol}`;
    return `${amount.toLocaleString('fr-FR')} ${config.currencySymbol}`;
  }
  return new Intl.NumberFormat(config.currencyLocale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
}
