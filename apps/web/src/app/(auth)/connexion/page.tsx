import type React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Connexion',
  description: 'Connectez-vous à votre compte AfriBayit.',
  robots: { index: false },
};

const AUTH_BG =
  'https://images.unsplash.com/photo-1600607688969-a5bfcd64bd28?q=80&w=2000&auto=format&fit=crop';

export default function LoginPage(): React.ReactElement {
  return (
    <div className="bg-navy relative flex min-h-screen overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img src={AUTH_BG} alt="" className="h-full w-full scale-105 object-cover opacity-40" />
        <div className="from-navy/90 via-navy/60 to-charcoal-900/90 absolute inset-0 bg-gradient-to-br" />
      </div>

      <div className="relative z-10 flex w-full items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[500px]">
          {/* Logo Section */}
          <div className="mb-10 text-center">
            <a
              href="/"
              aria-label="AfriBayit — Accueil"
              className="group inline-flex items-center gap-1"
            >
              <div className="bg-gold/20 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                <svg viewBox="0 0 24 24" fill="none" className="text-gold h-6 w-6">
                  <path
                    d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="font-serif text-3xl font-bold text-white">Afri</span>
              <span className="text-gold font-serif text-3xl font-bold">Bayit</span>
            </a>
            <p className="mt-4 text-sm font-light uppercase tracking-wide text-white/50">
              L'excellence immobilière sécurisée
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              © {new Date().getFullYear()} AFRIBAYIT TECHNOLOGIES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
