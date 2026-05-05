import type React from 'react';
import type { Metadata } from 'next';
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';
import { StatsBar } from '@/components/landing/StatsBar';
import { RecentListings } from '@/components/landing/RecentListings';
import { ModulesSection } from '@/components/landing/ModulesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { TrustedBy } from '@/components/landing/TrustedBy';
import { FinalCTA } from '@/components/landing/FinalCTA';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteNavbar } from '@/components/landing/SiteNavbar';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    "AfriBayit — La super-app immobilière de l'Afrique de l'Ouest. Trouvez votre propriété idéale au Bénin, Côte d'Ivoire, Burkina Faso et Togo.",
};

export default function HomePage(): React.ReactElement {
  return (
    <div className="bg-navy min-h-screen">
      <SiteNavbar />
      <main id="main-content">
        <ScrollExpandMedia
          mediaType="image"
          mediaSrc="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"
          bgImageSrc="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop"
          title="AfriBayit Réinventé"
          date="L'Excellence Africaine"
          scrollToExpand="Faites défiler pour explorer"
          textBlend
        >
          <div className="bg-white">
            <TrustedBy />
            <StatsBar />
            <RecentListings />
            <ModulesSection />
            <TestimonialsSection />
            <FinalCTA />
          </div>
        </ScrollExpandMedia>
      </main>
      <SiteFooter />
    </div>
  );
}
