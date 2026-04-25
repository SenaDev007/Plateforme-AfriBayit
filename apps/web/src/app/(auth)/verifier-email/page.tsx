'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function VerifyContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    api.auth
      .verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-900 border-t-transparent" />
        <p className="text-gray-600">Vérification en cours…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">Email vérifié !</h2>
        <p className="mb-6 text-sm text-gray-600">
          Votre adresse email a été confirmée avec succès.
        </p>
        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
        >
          Accéder à mon espace
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </div>
      <h2 className="mb-2 text-xl font-bold text-gray-900">Lien invalide</h2>
      <p className="mb-6 text-sm text-gray-600">
        Ce lien de vérification est invalide ou a expiré (24h).
      </p>
      <Link href="/connexion" className="text-sm font-medium text-blue-900 hover:underline">
        Retour à la connexion
      </Link>
    </div>
  );
}

export default function VerifyEmailPage(): React.ReactElement {
  return (
    <div className="bg-hero flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" aria-label="AfriBayit — Accueil">
            <span className="font-serif text-4xl font-bold">
              <span className="text-white">Afri</span>
              <span className="text-gold">Bayit</span>
            </span>
          </Link>
          <p className="mt-2 text-sm text-white/60">Vérification de votre email</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <Suspense fallback={<div className="text-center text-gray-500">Chargement…</div>}>
            <VerifyContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
