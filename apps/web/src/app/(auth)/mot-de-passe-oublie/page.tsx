'use client';

import React, { useState } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function ForgotPasswordPage(): React.ReactElement {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

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
          <p className="mt-2 text-sm text-white/60">Réinitialisation du mot de passe</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-xl">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Email envoyé !</h2>
              <p className="mb-6 text-sm text-gray-600">
                Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un
                email avec les instructions de réinitialisation.
              </p>
              <Link href="/connexion" className="text-sm font-medium text-blue-900 hover:underline">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-bold text-gray-900">Mot de passe oublié ?</h2>
              <p className="mb-6 text-sm text-gray-600">
                Saisissez votre adresse email et nous vous enverrons un lien de réinitialisation.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aminata@example.com"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-blue-900 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 disabled:opacity-50"
                >
                  {loading ? 'Envoi en cours…' : 'Envoyer le lien'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                <Link href="/connexion" className="font-medium text-blue-900 hover:underline">
                  Retour à la connexion
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
