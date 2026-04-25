'use client';

import { useTransition } from 'react';
import type { Locale } from '@/i18n/config';

export function useLocale() {
  const [isPending, startTransition] = useTransition();

  function setLocale(locale: Locale) {
    startTransition(() => {
      document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      window.location.reload();
    });
  }

  return { setLocale, isPending };
}
