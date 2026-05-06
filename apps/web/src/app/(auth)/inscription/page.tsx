import type React from 'react';
import type { Metadata } from 'next';
import { RegisterStepper } from '@/components/auth/RegisterStepper';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Inscription | AfriBayit',
  description: 'Créez votre compte AfriBayit et commencez votre projet immobilier.',
  robots: { index: false },
};

export default function RegisterPage(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-serif text-3xl font-bold text-white">Inscription</h2>
        <p className="text-sm font-light text-white/60">
          Rejoignez l'écosystème immobilier de demain
        </p>
      </div>

      <RegisterStepper />
    </motion.div>
  );
}
