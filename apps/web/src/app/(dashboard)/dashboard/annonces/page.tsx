import type React from 'react';
import type { Metadata } from 'next';
import { AnnoncesManager } from '@/components/dashboard/AnnoncesManager';

export const metadata: Metadata = {
  title: 'Mes annonces',
  description: 'Gérez vos propriétés publiées et brouillons',
};

export default function AnnoncesPage(): React.ReactElement {
  return <AnnoncesManager />;
}
