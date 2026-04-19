'use client';

import { useMemo } from 'react';
import { getCountryConfig, type CountryConfig } from '@/lib/countries/config';

/**
 * Returns the country config for the current subdomain.
 * Reads from the x-country header injected by middleware (accessible via cookie/context in client).
 * Falls back to 'bj' (Bénin).
 */
export function useCountry(countryCode?: string): CountryConfig {
  // In SSR, countryCode comes from the header via server component props.
  // In CSR, read from the subdomain or a cookie set by middleware.
  const code = countryCode ?? (typeof window !== 'undefined'
    ? window.location.hostname.split('.')[0] ?? 'bj'
    : 'bj');

  return useMemo(() => getCountryConfig(code), [code]);
}
