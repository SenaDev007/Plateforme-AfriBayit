import type React from 'react';
import Link from 'next/link';
import { Star, MapPin, Wifi, Car, Waves, CheckCircle2 } from 'lucide-react';
import { Badge } from '@afribayit/ui';

interface Hotel {
  id: string;
  slug: string;
  name: string;
  type: string;
  stars: number;
  city: string;
  country: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  amenities: string[];
  isVerified: boolean;
  isFeatured: boolean;
}

const MOCK_HOTELS: Hotel[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  slug: `hotel-${i + 1}`,
  name: ['Hôtel du Lac Nokoué', 'Résidence Les Cocotiers', 'Grand Bassam Resort', 'Hôtel Silmandé', 'Villa Kounio'][i % 5] ?? 'Hôtel',
  type: ['HOTEL', 'RESIDENCE', 'GUESTHOUSE', 'VILLA', 'HOTEL'][i % 5] ?? 'HOTEL',
  stars: [5, 4, 3, 4, 3][i % 5] ?? 3,
  city: ['Cotonou', 'Abidjan', 'Grand-Bassam', 'Ouagadougou', 'Lomé'][i % 5] ?? 'Cotonou',
  country: ['Bénin', 'Côte d\'Ivoire', 'Côte d\'Ivoire', 'Burkina Faso', 'Togo'][i % 5] ?? 'Bénin',
  pricePerNight: [75000, 45000, 25000, 55000, 18000][i % 5] ?? 30000,
  currency: 'XOF',
  rating: [4.8, 4.5, 4.2, 4.7, 4.0][i % 5] ?? 4.0,
  reviewCount: [127, 84, 43, 201, 29][i % 5] ?? 50,
  imageUrl: `https://images.unsplash.com/photo-${['1566073771259-6a8506099945', '1582719478250-c89cae4dc85b', '1551882547-ff40c4a49f73', '1564501049412-61d2ad2d4cfd', '1578683010236-d716f9a3f461'][i % 5]}?w=600&q=80`,
  amenities: [
    ['Piscine', 'WiFi', 'Restauration', 'Gym'],
    ['WiFi', 'Climatisation', 'Parking', 'Restauration'],
    ['WiFi', 'Climatisation', 'Parking'],
    ['Piscine', 'WiFi', 'Restauration', 'Navette aéroport'],
    ['WiFi', 'Climatisation'],
  ][i % 5] ?? ['WiFi'],
  isVerified: i % 3 !== 0,
  isFeatured: i % 4 === 0,
}));

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Piscine': <Waves className="h-3 w-3" />,
  'WiFi': <Wifi className="h-3 w-3" />,
  'Parking': <Car className="h-3 w-3" />,
};

function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }): React.ReactElement {
  return (
    <div className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
      <span className="text-sm font-semibold text-charcoal">{rating}</span>
      <span className="text-xs text-charcoal-400">({reviewCount} avis)</span>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }): React.ReactElement {
  return (
    <Link href={`/hotels/${hotel.slug}`} className="group block bg-white rounded-xl border border-charcoal-100 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
      <div className="relative h-48 overflow-hidden">
        <img src={hotel.imageUrl} alt={hotel.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {hotel.isFeatured && (
          <Badge variant="gold" className="absolute top-2 left-2 text-xs">⭐ Premium</Badge>
        )}
        {hotel.isVerified && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur rounded-full px-2 py-0.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Vérifié
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex">
          {Array.from({ length: hotel.stars }).map((_, i) => (
            <Star key={i} className="h-3 w-3 fill-gold text-gold" aria-hidden="true" />
          ))}
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div>
          <Badge variant="sky" className="text-xs mb-1">{hotel.type}</Badge>
          <h3 className="font-semibold text-charcoal leading-tight group-hover:text-navy transition-colors">{hotel.name}</h3>
          <p className="flex items-center gap-1 text-xs text-charcoal-400 mt-0.5">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {hotel.city}, {hotel.country}
          </p>
        </div>

        <StarRating rating={hotel.rating} reviewCount={hotel.reviewCount} />

        <div className="flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 3).map((a) => (
            <span key={a} className="flex items-center gap-0.5 text-xs text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5">
              {AMENITY_ICONS[a]} {a}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5">+{hotel.amenities.length - 3}</span>
          )}
        </div>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-charcoal-50">
          <div>
            <p className="font-mono text-lg font-bold text-navy">
              {hotel.pricePerNight.toLocaleString('fr-FR')} FCFA
            </p>
            <p className="text-xs text-charcoal-400">/ nuit</p>
          </div>
          <span className="text-xs font-medium text-navy bg-navy/10 rounded-pill px-3 py-1">Réserver</span>
        </div>
      </div>
    </Link>
  );
}

interface HotelsListProps {
  searchParams: Record<string, string | undefined>;
}

export async function HotelsList({ searchParams }: HotelsListProps): Promise<React.ReactElement> {
  const hotels = MOCK_HOTELS;
  const total = hotels.length;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-charcoal-400">
        <span className="font-semibold text-charcoal">{total}</span> hébergements trouvés
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
}
