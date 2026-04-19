'use client';
import type React from 'react';

import { useEffect } from 'react';
import { Button } from '@afribayit/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps): React.ReactElement {
  useEffect(() => {
    // Log to Sentry in production
    if (process.env['NODE_ENV'] === 'production') {
      console.error('Global error:', error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-hero text-white p-4">
      <div className="text-center">
        <p className="text-5xl mb-4" aria-hidden="true">⚠️</p>
        <h1 className="font-serif text-3xl font-bold mb-2">Une erreur s'est produite</h1>
        <p className="text-white/60 max-w-sm">
          Quelque chose s'est mal passé. Veuillez réessayer.
        </p>
        {error.digest && (
          <p className="font-mono text-xs text-white/30 mt-2">Ref: {error.digest}</p>
        )}
      </div>
      <div className="flex gap-3">
        <Button variant="gold" onClick={reset}>Réessayer</Button>
        <Button variant="ghost" onClick={() => { window.location.href = '/'; }}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  );
}
