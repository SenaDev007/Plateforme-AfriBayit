import type React from 'react';
import type { Metadata } from 'next';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Connexion | AfriBayit',
  description: 'Connectez-vous à votre compte AfriBayit.',
  robots: { index: false },
};

export default function LoginPage(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-serif text-3xl font-bold text-white">Bon retour</h2>
        <p className="text-sm font-light text-white/60">
          L'excellence immobilière à portée de clic
        </p>
      </div>

      <LoginForm />
    </motion.div>
  );
}
