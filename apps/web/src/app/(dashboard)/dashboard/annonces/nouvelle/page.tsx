import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PublishPropertyForm } from '@/components/property/PublishPropertyForm';

export const metadata: Metadata = {
  title: 'Nouvelle annonce',
  description: 'Publiez une nouvelle propriété sur AfriBayit',
};

export default function NouvelleAnnoncePage(): React.ReactElement {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard/annonces"
          className="flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-charcoal transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Retour aux annonces
        </Link>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Créer une annonce</h1>
        <p className="text-sm text-charcoal-400 mt-1">
          Renseignez les informations de votre propriété pour la publier sur AfriBayit.
        </p>
      </div>
      <PublishPropertyForm />
    </div>
  );
}
