import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investir en Afrique | AfriBayit',
  description:
    "Investissez dans l'immobilier africain en toute sécurité. Données de marché, zones à fort potentiel, escrow notarial et accompagnement juridique au Bénin, Côte d'Ivoire, Sénégal et Togo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
