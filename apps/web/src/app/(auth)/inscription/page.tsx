import type React from 'react';
import type { Metadata } from 'next';
import { RegisterStepper } from '@/components/auth/RegisterStepper';

export const metadata: Metadata = {
  title: 'Créer un compte',
  description: 'Créez votre compte AfriBayit gratuitement.',
  robots: { index: false },
};

export default function RegisterPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <a href="/" aria-label="AfriBayit — Accueil">
            <span className="font-serif text-4xl font-bold">
              <span className="text-white">Afri</span>
              <span className="text-gold">Bayit</span>
            </span>
          </a>
          <p className="mt-2 text-white/60 text-sm">
            Créez votre compte en quelques étapes.
          </p>
        </div>
        <RegisterStepper />
      </div>
    </div>
  );
}
