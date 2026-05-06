import type React from 'react';
import type { Metadata } from 'next';
import { KYCStepper } from '@/components/auth/KYCStepper';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: "Vérification d'identité | AfriBayit",
  description: 'Sécurisez votre compte AfriBayit avec la vérification KYC.',
  robots: { index: false },
};

export default function KYCPage(): React.ReactElement {
  return (
    <div className="space-y-6">
      <KYCStepper />
    </div>
  );
}
