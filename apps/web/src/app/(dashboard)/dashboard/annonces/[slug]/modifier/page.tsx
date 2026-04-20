import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { PublishPropertyForm } from '@/components/property/PublishPropertyForm';

export const metadata: Metadata = {
  title: "Modifier l'annonce",
  description: "Modifiez votre propriété sur AfriBayit",
};

export default function ModifierAnnoncePage({
  params,
}: {
  params: { slug: string };
}): React.ReactElement {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/annonces"
          className="flex items-center gap-1 text-sm text-charcoal-400 hover:text-charcoal transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Mes annonces
        </Link>
      </div>

      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Modifier l'annonce</h1>
        <p className="text-sm text-charcoal-400 mt-0.5">
          Réf. <span className="font-mono text-charcoal">{params.slug}</span>
        </p>
      </div>

      <PublishPropertyForm />
    </div>
  );
}
