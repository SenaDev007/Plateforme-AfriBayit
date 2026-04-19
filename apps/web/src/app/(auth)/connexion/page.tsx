import type React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte AfriBayit.',
  robots: { index: false },
};

export default function LoginPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" aria-label="AfriBayit — Accueil">
            <span className="font-serif text-4xl font-bold">
              <span className="text-white">Afri</span>
              <span className="text-gold">Bayit</span>
            </span>
          </a>
          <p className="mt-2 text-white/60 text-sm">
            Bienvenue ! Connectez-vous pour continuer.
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
