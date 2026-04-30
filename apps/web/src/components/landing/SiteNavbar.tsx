'use client';
import type React from 'react';

import { useRouter } from 'next/navigation';
import { Navbar } from '@afribayit/ui';

const NAV_LINKS = [
  { label: 'Acheter', href: '/recherche?but=SALE' },
  { label: 'Louer', href: '/recherche?but=RENT' },
  { label: 'Hôtels', href: '/hotels' },
  { label: 'Artisans', href: '/artisans' },
  { label: 'Formation', href: '/formation' },
  { label: 'Communauté', href: '/communaute' },
];

const COUNTRY_DOMAINS: Record<string, string> = {
  bj: 'bj.afribayit.com',
  ci: 'ci.afribayit.com',
  bf: 'bf.afribayit.com',
  tg: 'tg.afribayit.com',
};

export function SiteNavbar(): React.ReactElement {
  const router = useRouter();

  const handleCountryChange = (code: string): void => {
    const domain = COUNTRY_DOMAINS[code];
    if (domain && typeof window !== 'undefined') {
      // In production, redirect to subdomain. In dev, just update state.
      if (window.location.hostname.includes('afribayit.com')) {
        window.location.href = `https://${domain}`;
      }
    }
  };

  const handleLogin = (): void => {
    router.push('/connexion');
  };

  const handleRegister = (): void => {
    router.push('/inscription');
  };

  return (
    <Navbar
      links={NAV_LINKS}
      onCountryChange={handleCountryChange}
      onLogin={handleLogin}
      onRegister={handleRegister}
      transparentOnTop
    />
  );
}
