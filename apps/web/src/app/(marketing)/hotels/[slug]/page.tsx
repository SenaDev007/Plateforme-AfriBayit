import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HotelDetail } from '@/components/hotels/HotelDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Hôtel ${slug}`,
    description: 'Réservez cet hébergement en Afrique de l\'Ouest via AfriBayit.',
  };
}

const MOCK_HOTEL = {
  id: '1',
  slug: 'hotel-du-lac-nokoue',
  name: 'Hôtel du Lac Nokoué',
  type: 'HOTEL',
  stars: 5,
  description: `L'Hôtel du Lac Nokoué est un établissement 5 étoiles niché au bord du célèbre lac Nokoué à Cotonou. Avec une architecture inspirée de l'authentique architecture lagunaire béninoise, cet hôtel offre une expérience unique alliant luxe moderne et culture locale.

Ses 45 chambres et suites offrent toutes une vue imprenable sur le lac. Le restaurant gastronomique propose une carte mêlant cuisines béninoise et internationale, avec des produits frais issus des marchés locaux.

Idéalement situé à 15 minutes de l'aéroport international de Cotonou et à 5 minutes du quartier d'affaires, l'hôtel est parfait pour les voyageurs d'affaires comme les touristes.`,
  city: 'Cotonou',
  country: 'Bénin',
  district: 'Akpakpa',
  address: 'Boulevard de la Marina, Cotonou',
  latitude: 6.3654,
  longitude: 2.4183,
  pricePerNight: 75000,
  currency: 'XOF',
  rating: 4.8,
  reviewCount: 127,
  stars_count: 5,
  amenities: ['Piscine', 'WiFi', 'Restauration', 'Gym', 'Spa', 'Navette aéroport', 'Climatisation', 'Parking', 'Bar', 'Salle de conférence'],
  images: [
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85', alt: 'Vue extérieure' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85', alt: 'Piscine' },
    { url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=85', alt: 'Chambre deluxe' },
    { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=85', alt: 'Restaurant' },
  ],
  rooms: [
    { id: '1', name: 'Chambre Standard', bedType: 'Double', surface: 28, pricePerNight: 75000, maxGuests: 2, available: true },
    { id: '2', name: 'Chambre Supérieure Vue Lac', bedType: 'King', surface: 35, pricePerNight: 95000, maxGuests: 2, available: true },
    { id: '3', name: 'Suite Junior', bedType: 'King + Salon', surface: 55, pricePerNight: 145000, maxGuests: 3, available: false },
    { id: '4', name: 'Suite Présidentielle', bedType: 'King + 2 chambres', surface: 120, pricePerNight: 280000, maxGuests: 6, available: true },
  ],
  isVerified: true,
  isFeatured: true,
};

export default async function HotelDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  if (!slug) notFound();
  return <HotelDetail hotel={MOCK_HOTEL} />;
}
