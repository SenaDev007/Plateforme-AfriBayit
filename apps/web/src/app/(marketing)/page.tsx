import type React from 'react';
import type { Metadata } from 'next';
import EtherealBeamsHero from '@/components/ui/ethereal-beams-hero';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { TrustSection } from '@/components/landing/TrustSection';
import { ModulesSection } from '@/components/landing/ModulesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CountriesSection } from '@/components/landing/CountriesSection';
import { ProfessionalsSection } from '@/components/landing/ProfessionalsSection';
import { RebeccaSection } from '@/components/landing/RebeccaSection';
import { AcademySection } from '@/components/landing/AcademySection';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteNavbar } from '@/components/landing/SiteNavbar';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    "AfriBayit — La plateforme de référence pour l'investissement immobilier sécurisé en Afrique de l'Ouest. Trouvez votre propriété idéale au Bénin, Côte d'Ivoire, Sénégal et Togo.",
};

export default function HomePage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <main id="main-content">
        <EtherealBeamsHero />
        <TrustedBy />
        <TrustSection />
        <ModulesSection />
        <TestimonialsSection />
        <CountriesSection />
        <ProfessionalsSection />
        <RebeccaSection />
        <AcademySection />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
