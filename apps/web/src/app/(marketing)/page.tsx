import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar';
import { RecentListings } from '@/components/landing/RecentListings';
import { ModulesSection } from '@/components/landing/ModulesSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteNavbar } from '@/components/landing/SiteNavbar';

export const metadata: Metadata = {
  title: 'Accueil',
  description:
    'AfriBayit — La super-app immobilière de l\'Afrique de l\'Ouest. Trouvez votre propriété idéale au Bénin, Côte d\'Ivoire, Burkina Faso et Togo.',
};

export default function HomePage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <main id="main-content">
        <HeroSection />
        <StatsBar />
        <RecentListings />
        <ModulesSection />
        <TestimonialsSection />
      </main>
      <SiteFooter />
    </div>
  );
}
