import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { PropertyDetail } from '@/components/property/PropertyDetail';

interface PropertyPageProps {
  params: Promise<{ slug: string }>;
}

// Mock property — replace with real API fetch
async function getProperty(slug: string) {
  // TODO: fetch from API
  if (!slug) return null;
  return {
    id: '1',
    slug,
    title: 'Villa Les Cocotiers — Cotonou Riviera',
    description:
      'Magnifique villa avec piscine en bord de mer. 4 chambres, salon spacieux, cuisine entièrement équipée. Accès direct à la plage de Fidjrossè. Gardiennage 24h/24, groupe électrogène, fosse septique. Titre foncier disponible.',
    type: 'VILLA',
    purpose: 'SALE' as const,
    price: 85000000,
    currency: 'XOF',
    surface: 350,
    bedrooms: 4,
    bathrooms: 3,
    floor: null,
    yearBuilt: 2019,
    country: 'Bénin',
    city: 'Cotonou',
    district: 'Riviera',
    address: 'Rue des Cocotiers, Fidjrossè, Cotonou',
    latitude: 6.3703,
    longitude: 2.3912,
    features: ['Piscine', 'Groupe électrogène', 'Gardiennage', 'Climatisation', 'Jardin', 'Parking 3 véhicules'],
    isVerified: true,
    isFeatured: true,
    images: [
      { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1200&q=85', alt: 'Vue principale' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85', alt: 'Piscine' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=85', alt: 'Salon' },
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85', alt: 'Chambre principale' },
    ],
    agent: {
      name: 'Kodjo Mensah',
      avatar: null,
      phone: '+229 97 00 00 00',
      email: 'kodjo@afribayit.com',
      rating: 4.8,
      reviewCount: 23,
      isVerified: true,
    },
  };
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug);
  if (!property) return { title: 'Propriété introuvable' };
  return {
    title: property.title,
    description: property.description.substring(0, 160),
    openGraph: {
      title: property.title,
      description: property.description.substring(0, 160),
      images: [{ url: property.images[0]?.url ?? '' }],
    },
  };
}

export default async function PropertyPage({ params }: PropertyPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const property = await getProperty(slug);

  if (!property) notFound();

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />
      <main id="main-content" className="pt-16">
        <PropertyDetail property={property} />
      </main>
    </div>
  );
}
