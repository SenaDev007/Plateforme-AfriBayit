import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HotelDetail } from '@/components/hotels/HotelDetail';

interface Props {
  params: Promise<{ slug: string }>;
}

interface ApiRoom {
  id: string;
  name: string;
  type: string;
  pricePerNight: number | string;
  capacity: number;
  isAvailable: boolean;
  description?: string;
}

interface ApiHotel {
  id: string;
  slug: string;
  name: string;
  type?: string | null;
  starRating: number;
  description: string;
  city: string;
  country: string;
  district?: string | null;
  address: string;
  images?: unknown;
  amenities?: unknown;
  rooms: ApiRoom[];
}

function parseJsonArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map((v) => String(v));
  return [];
}

function parseImages(val: unknown): { url: string; alt: string }[] {
  if (!Array.isArray(val)) return [];
  return val.map((v: unknown) => {
    const obj = v as Record<string, string>;
    return { url: obj['url'] ?? obj['src'] ?? '', alt: obj['alt'] ?? '' };
  });
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  STANDARD: 'Double Standard',
  DELUXE: 'Deluxe',
  SUITE: 'Suite King',
  PRESIDENTIAL: 'Suite Présidentielle',
};

async function fetchHotel(slug: string): Promise<ApiHotel | null> {
  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/hotels/${slug}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return (await res.json()) as ApiHotel;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await fetchHotel(slug);
  return {
    title: hotel ? `${hotel.name} — AfriBayit Hôtels` : `Hôtel — AfriBayit`,
    description: hotel
      ? `${hotel.name} à ${hotel.city}. Réservez cet hébergement en Afrique de l'Ouest via AfriBayit.`
      : "Réservez cet hébergement en Afrique de l'Ouest via AfriBayit.",
  };
}

export default async function HotelDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const hotel = await fetchHotel(slug);

  if (!hotel) notFound();

  const images = parseImages(hotel.images);
  const amenities = parseJsonArray(hotel.amenities);
  const minPrice = hotel.rooms.length
    ? Math.min(...hotel.rooms.map((r) => Number(r.pricePerNight)))
    : 0;

  const detailData = {
    id: hotel.id,
    slug: hotel.slug,
    name: hotel.name,
    type: hotel.type ?? 'HOTEL',
    stars: hotel.starRating,
    description: hotel.description,
    city: hotel.city,
    country: hotel.country,
    ...(hotel.district ? { district: hotel.district } : {}),
    address: hotel.address,
    pricePerNight: minPrice,
    currency: 'XOF',
    rating: 0,
    reviewCount: 0,
    amenities,
    images: images.length
      ? images
      : [
          {
            url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85',
            alt: hotel.name,
          },
        ],
    rooms: hotel.rooms.map((r) => ({
      id: r.id,
      name: r.name,
      bedType: ROOM_TYPE_LABELS[r.type] ?? r.type,
      surface: 0,
      pricePerNight: Number(r.pricePerNight),
      maxGuests: r.capacity,
      available: r.isAvailable,
    })),
    isVerified: false,
    isFeatured: false,
  };

  return <HotelDetail hotel={detailData} />;
}
