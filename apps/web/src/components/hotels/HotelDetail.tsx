'use client';
import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Wifi, Waves, Car, CheckCircle2, Shield, BedDouble, Users, Expand, Calendar } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import toast from 'react-hot-toast';

interface Room {
  id: string;
  name: string;
  bedType: string;
  surface: number;
  pricePerNight: number;
  maxGuests: number;
  available: boolean;
}

interface HotelDetailData {
  id: string;
  slug: string;
  name: string;
  type: string;
  stars: number;
  description: string;
  city: string;
  country: string;
  district?: string;
  address?: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: { url: string; alt: string }[];
  rooms: Room[];
  isVerified: boolean;
  isFeatured: boolean;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  'Piscine': <Waves className="h-4 w-4" />,
  'WiFi': <Wifi className="h-4 w-4" />,
  'Parking': <Car className="h-4 w-4" />,
};

export function HotelDetail({ hotel }: { hotel: HotelDetailData }): React.ReactElement {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  const nights = checkin && checkout
    ? Math.max(0, Math.ceil((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
    : 1;

  const room = hotel.rooms.find((r) => r.id === selectedRoom);
  const totalPrice = room ? room.pricePerNight * nights : hotel.pricePerNight * nights;

  const handleReserve = (): void => {
    if (!selectedRoom) { toast.error('Sélectionnez une chambre'); return; }
    if (!checkin || !checkout) { toast.error('Sélectionnez vos dates'); return; }
    toast.success('Réservation initiée ! Paiement sécurisé par escrow AfriBayit.');
  };

  return (
    <article className="min-h-screen">
      {/* Gallery */}
      <section aria-label="Galerie photos" className="bg-charcoal-900">
        <div className="mx-auto max-w-7xl">
          <div className="relative aspect-video max-h-[500px] overflow-hidden">
            <img src={hotel.images[activeImage]?.url ?? ''} alt={hotel.images[activeImage]?.alt ?? hotel.name} className="h-full w-full object-cover" />
            {hotel.isFeatured && <Badge variant="gold" className="absolute top-4 left-4">⭐ Premium</Badge>}
            {hotel.isVerified && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm text-emerald-700 font-medium">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Établissement vérifié
              </div>
            )}
          </div>
          {hotel.images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {hotel.images.map((img, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`relative flex-shrink-0 h-16 w-24 overflow-hidden rounded-md transition-all ${idx === activeImage ? 'ring-2 ring-gold' : 'opacity-60 hover:opacity-100'}`}
                  aria-label={`Image ${idx + 1}`} aria-current={idx === activeImage ? 'true' : undefined}>
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="sky">{hotel.type}</Badge>
                <div className="flex" aria-label={`${hotel.stars} étoiles`}>
                  {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />)}
                </div>
                {hotel.isVerified && <Badge variant="trust">✓ Vérifié</Badge>}
              </div>
              <h1 className="font-serif text-3xl font-bold text-charcoal">{hotel.name}</h1>
              <p className="flex items-center gap-1.5 text-charcoal-400 mt-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {hotel.address ?? `${hotel.district ?? ''} ${hotel.city}, ${hotel.country}`.trim()}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                <span className="font-semibold text-charcoal">{hotel.rating}</span>
                <span className="text-sm text-charcoal-400">({hotel.reviewCount} avis)</span>
              </div>
            </div>

            {/* Description */}
            <section aria-labelledby="desc-h">
              <h2 id="desc-h" className="font-serif text-xl font-semibold text-charcoal mb-3">À propos</h2>
              <p className="text-charcoal-600 leading-relaxed whitespace-pre-line">{hotel.description}</p>
            </section>

            {/* Amenities */}
            <section aria-labelledby="amenities-h">
              <h2 id="amenities-h" className="font-serif text-xl font-semibold text-charcoal mb-3">Équipements</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hotel.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-sm text-charcoal-600">
                    <span className="text-navy" aria-hidden="true">{AMENITY_ICONS[a] ?? <CheckCircle2 className="h-4 w-4 text-emerald" />}</span>
                    {a}
                  </div>
                ))}
              </div>
            </section>

            {/* Rooms */}
            <section aria-labelledby="rooms-h">
              <h2 id="rooms-h" className="font-serif text-xl font-semibold text-charcoal mb-4">Chambres disponibles</h2>
              <div className="flex flex-col gap-3">
                {hotel.rooms.map((r) => (
                  <div key={r.id}
                    onClick={() => r.available && setSelectedRoom(r.id)}
                    className={`border-2 rounded-xl p-4 transition-all ${!r.available ? 'opacity-50 cursor-not-allowed border-charcoal-100' : selectedRoom === r.id ? 'border-navy bg-navy/5 cursor-pointer' : 'border-charcoal-100 hover:border-navy/30 cursor-pointer'}`}
                    role="radio" aria-checked={selectedRoom === r.id} tabIndex={r.available ? 0 : -1}
                    onKeyDown={(e) => e.key === 'Enter' && r.available && setSelectedRoom(r.id)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1.5">
                        <p className="font-semibold text-charcoal">{r.name}</p>
                        <div className="flex flex-wrap gap-3 text-sm text-charcoal-400">
                          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" aria-hidden="true" />{r.bedType}</span>
                          <span className="flex items-center gap-1"><Expand className="h-4 w-4" aria-hidden="true" />{r.surface} m²</span>
                          <span className="flex items-center gap-1"><Users className="h-4 w-4" aria-hidden="true" />Max {r.maxGuests} pers.</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono font-bold text-navy">{r.pricePerNight.toLocaleString('fr-FR')} FCFA</p>
                        <p className="text-xs text-charcoal-400">/ nuit</p>
                        {!r.available && <Badge variant="danger" className="mt-1 text-xs">Complet</Badge>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right — Booking widget */}
          <div className="lg:col-span-1">
            <motion.div
              className="lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-xl border border-charcoal-100 p-6 shadow-card flex flex-col gap-4">
                <div>
                  <p className="text-xs text-charcoal-400">À partir de</p>
                  <p className="font-mono text-3xl font-bold text-navy">{hotel.pricePerNight.toLocaleString('fr-FR')} <span className="text-lg">FCFA</span></p>
                  <p className="text-xs text-charcoal-400">/ nuit</p>
                </div>

                {/* Date picker */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> Arrivée
                    </label>
                    <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-charcoal-200 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-navy/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-charcoal mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> Départ
                    </label>
                    <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} min={checkin || new Date().toISOString().split('T')[0]}
                      className="w-full rounded-lg border border-charcoal-200 px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-navy/30" />
                  </div>
                </div>

                {nights > 0 && room && (
                  <div className="bg-charcoal-50 rounded-lg p-3 text-sm space-y-1">
                    <div className="flex justify-between"><span className="text-charcoal-400">{room.pricePerNight.toLocaleString('fr-FR')} × {nights} nuit{nights > 1 ? 's' : ''}</span><span className="font-medium">{totalPrice.toLocaleString('fr-FR')} FCFA</span></div>
                    <div className="flex justify-between text-xs text-charcoal-400"><span>Frais de service</span><span>Inclus</span></div>
                    <div className="flex justify-between font-bold text-navy border-t border-charcoal-100 pt-1 mt-1"><span>Total</span><span>{totalPrice.toLocaleString('fr-FR')} FCFA</span></div>
                  </div>
                )}

                <Button onClick={handleReserve} fullWidth size="lg">
                  {selectedRoom ? 'Réserver maintenant' : 'Choisir une chambre'}
                </Button>

                <p className="text-center text-xs text-charcoal-400 flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" aria-hidden="true" /> Paiement sécurisé par escrow AfriBayit
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </article>
  );
}
