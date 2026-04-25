import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { Star, MapPin, Wifi, Car, Waves, CheckCircle2 } from 'lucide-react';
import { Badge } from '@afribayit/ui';

interface HotelRoomPreview {
  pricePerNight: unknown;
  currency: string;
  type: string;
}

interface Hotel {
  id: string;
  slug: string;
  name: string;
  type: string | null;
  starRating: number;
  city: string;
  country: string;
  images: unknown;
  isPublished: boolean;
  rooms: HotelRoomPreview[];
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  Piscine: <Waves className="h-3 w-3" />,
  WiFi: <Wifi className="h-3 w-3" />,
  Parking: <Car className="h-3 w-3" />,
};

function getMinPrice(rooms: HotelRoomPreview[]): number {
  if (!rooms.length) return 0;
  return Math.min(...rooms.map((r) => Number(r.pricePerNight)));
}

function getFirstImage(images: unknown): string {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0] as Record<string, string>;
    return first['url'] ?? first['src'] ?? '';
  }
  return `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80`;
}

function StarRating({ count }: { count: number }): React.ReactElement {
  return (
    <div className="flex" aria-label={`${count} étoiles`}>
      {Array.from({ length: Math.min(5, count) }).map((_, i) => (
        <Star key={i} className="fill-gold text-gold h-3 w-3" aria-hidden="true" />
      ))}
    </div>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }): React.ReactElement {
  const minPrice = getMinPrice(hotel.rooms);
  const imageUrl = getFirstImage(hotel.images);

  return (
    <Link
      href={`/hotels/${hotel.slug}` as Route}
      className="border-charcoal-100 group block overflow-hidden rounded-xl border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="bg-charcoal-100 relative h-48 overflow-hidden">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={hotel.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute bottom-2 left-2">
          <StarRating count={hotel.starRating} />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
        <div>
          {hotel.type && (
            <Badge variant="sky" className="mb-1 text-xs">
              {hotel.type}
            </Badge>
          )}
          <h3 className="text-charcoal group-hover:text-navy font-semibold leading-tight transition-colors">
            {hotel.name}
          </h3>
          <p className="text-charcoal-400 mt-0.5 flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {hotel.city}
          </p>
        </div>

        <div className="border-charcoal-50 mt-auto flex items-end justify-between border-t pt-2">
          <div>
            {minPrice > 0 ? (
              <>
                <p className="text-navy font-mono text-lg font-bold">
                  {minPrice.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-charcoal-400 text-xs">/ nuit</p>
              </>
            ) : (
              <p className="text-charcoal-400 text-sm">Prix sur demande</p>
            )}
          </div>
          <span className="text-navy bg-navy/10 rounded-pill px-3 py-1 text-xs font-medium">
            Réserver
          </span>
        </div>
      </div>
    </Link>
  );
}

const FALLBACK_HOTELS: Hotel[] = Array.from({ length: 6 }, (_, i) => ({
  id: String(i + 1),
  slug: `hotel-exemple-${i + 1}`,
  name:
    [
      'Hôtel du Lac Nokoué',
      'Résidence Les Cocotiers',
      'Grand Bassam Resort',
      'Hôtel Silmandé',
      'Villa Kounio',
      'Hôtel Azalaï',
    ][i] ?? 'Hôtel',
  type: ['HOTEL', 'RESIDENCE', 'GUESTHOUSE', 'VILLA', 'HOTEL', 'HOTEL'][i] ?? 'HOTEL',
  starRating: [5, 4, 3, 4, 3, 4][i] ?? 3,
  city: ['Cotonou', 'Abidjan', 'Grand-Bassam', 'Ouagadougou', 'Lomé', 'Dakar'][i] ?? 'Cotonou',
  country: ['BJ', 'CI', 'CI', 'BF', 'TG', 'SN'][i] ?? 'BJ',
  images: null,
  isPublished: true,
  rooms: [
    {
      pricePerNight: [75000, 45000, 25000, 55000, 18000, 60000][i] ?? 30000,
      currency: 'XOF',
      type: 'STANDARD',
    },
  ],
}));

interface HotelsListProps {
  searchParams: Record<string, string | undefined>;
}

export async function HotelsList({ searchParams }: HotelsListProps): Promise<React.ReactElement> {
  let hotels: Hotel[] = FALLBACK_HOTELS;
  let total = FALLBACK_HOTELS.length;

  try {
    const params = new URLSearchParams();
    if (searchParams['city']) params.set('city', searchParams['city']);
    if (searchParams['type']) params.set('type', searchParams['type']);
    if (searchParams['starRating']) params.set('starRating', searchParams['starRating']);
    if (searchParams['minPrice']) params.set('minPrice', searchParams['minPrice']);
    if (searchParams['maxPrice']) params.set('maxPrice', searchParams['maxPrice']);
    if (searchParams['checkIn']) params.set('checkIn', searchParams['checkIn']);
    if (searchParams['checkOut']) params.set('checkOut', searchParams['checkOut']);
    params.set('limit', searchParams['limit'] ?? '12');
    params.set('page', searchParams['page'] ?? '1');

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/hotels?${params.toString()}`, {
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = (await res.json()) as { data: Hotel[]; total: number };
      if (data.data && data.data.length > 0) {
        hotels = data.data;
        total = data.total;
      }
    }
  } catch {
    // fall back to static data
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-charcoal-400 text-sm">
        <span className="text-charcoal font-semibold">{total}</span> hébergements trouvés
      </p>
      {hotels.length === 0 ? (
        <div className="border-charcoal-100 rounded-xl border bg-white p-12 text-center">
          <p className="text-charcoal-400">Aucun hôtel ne correspond à vos critères.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      )}
    </div>
  );
}
