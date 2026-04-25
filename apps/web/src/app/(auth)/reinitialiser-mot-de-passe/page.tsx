'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

function ResetForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('Lien invalide ou expiré.');
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (newPassword !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    setLoading(true);
    try {
      await api.auth.resetPassword(token, newPassword);
      setSuccess(true);
      setTimeout(() => router.push('/connexion'), 3000);
    } catch {
      setError('Lien invalide ou expiré. Veuillez faire une nouvelle demande.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
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
        <h2 className="mb-2 text-xl font-bold text-gray-900">Mot de passe réinitialisé !</h2>
        <p className="text-sm text-gray-600">Redirection vers la connexion…</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="mb-2 text-xl font-bold text-gray-900">Nouveau mot de passe</h2>
      <p className="mb-6 text-sm text-gray-600">
        Choisissez un mot de passe fort (min. 8 caractères, 1 majuscule, 1 chiffre).
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
            Nouveau mot de passe
          </label>
          <input
            id="password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        <div>
          <label htmlFor="confirm" className="mb-1 block text-sm font-medium text-gray-700">
            Confirmer le mot de passe
          </label>
          <input
            id="confirm"
            type="password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading || !token}
          className="w-full rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? 'Enregistrement…' : 'Réinitialiser le mot de passe'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage(): React.ReactElement {
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
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <Suspense fallback={<div className="text-center text-gray-500">Chargement…</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
