'use client';
import type React from 'react';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  BedDouble,
  Bath,
  Expand,
  Calendar,
  CheckCircle2,
  Share2,
  Heart,
  Phone,
  Mail,
  Shield,
  Star,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { cn } from '@afribayit/ui/src/lib/cn';
import { TaxCalculator } from './TaxCalculator';

interface PropertyImage {
  url: string;
  alt: string;
}

interface Agent {
  name: string;
  avatar: string | null;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
}

interface PropertyDetailData {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  purpose: 'SALE' | 'RENT' | 'SHORT_TERM_RENT' | 'INVESTMENT';
  price: number;
  currency: string;
  surface?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  floor?: number | null;
  yearBuilt?: number | null;
  country: string;
  city: string;
  district?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  features?: string[];
  isVerified: boolean;
  isFeatured: boolean;
  images: PropertyImage[];
  agent: Agent;
}

interface PropertyDetailProps {
  property: PropertyDetailData;
}

function formatPrice(amount: number, currency: string): string {
  if (currency === 'XOF') {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toLocaleString('fr-FR')} M FCFA`;
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount);
}

export function PropertyDetail({ property }: PropertyDetailProps): React.ReactElement {
  const [activeImage, setActiveImage] = useState(0);
  const [favorited, setFavorited] = useState(false);

  const purposeLabel: Record<string, string> = {
    SALE: 'À vendre',
    RENT: 'À louer',
    SHORT_TERM_RENT: 'Court séjour',
    INVESTMENT: 'Investissement',
  };

  const nextImage = () => setActiveImage((prev) => (prev + 1) % property.images.length);
  const prevImage = () =>
    setActiveImage((prev) => (prev - 1 + property.images.length) % property.images.length);

  return (
    <article aria-label={property.title} className="bg-white pb-24 lg:pb-32">
      {/* Header Info (Breadcrumbs / Back button style) */}
      <div className="bg-charcoal-900 pb-8 pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="gold" className="px-4 py-1.5 font-bold uppercase tracking-wider">
                  {property.type}
                </Badge>
                <Badge variant="outline" className="border-white/20 px-4 py-1.5 text-white">
                  {purposeLabel[property.purpose]}
                </Badge>
                {property.isVerified && (
                  <Badge
                    variant="success"
                    className="bg-emerald/20 border-none px-4 py-1.5 text-emerald-400"
                  >
                    ✓ VÉRIFIÉ
                  </Badge>
                )}
              </div>
              <h1 className="font-serif text-3xl font-bold leading-tight text-white md:text-5xl">
                {property.title}
              </h1>
              <p className="flex items-center gap-2 text-base text-white/50">
                <MapPin className="text-gold h-5 w-5" aria-hidden="true" />
                {property.address ??
                  `${property.district ?? ''} ${property.city}, ${property.country}`.trim()}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setFavorited(!favorited)}
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full border border-white/10 transition-all',
                  favorited
                    ? 'bg-danger border-danger text-white'
                    : 'text-white/60 hover:bg-white/5',
                )}
              >
                <Heart className={cn('h-5 w-5', favorited && 'fill-current')} />
              </button>
              <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all hover:bg-white/5">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <section className="bg-charcoal-900 pb-16">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
          <div className="grid aspect-[21/9] min-h-[500px] grid-cols-1 gap-4 md:grid-cols-4">
            {/* Main Large Image */}
            <div className="group relative overflow-hidden rounded-3xl md:col-span-3">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  src={property.images[activeImage]?.url}
                  alt={property.images[activeImage]?.alt}
                  className="h-full w-full object-cover"
                />
              </AnimatePresence>

              {/* Navigation arrows overlay */}
              <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={prevImage}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>

              {/* Photo count / Maximize */}
              <div className="absolute bottom-6 right-6 flex gap-3">
                <span className="rounded-full bg-black/50 px-4 py-2 text-xs font-bold text-white backdrop-blur-md">
                  {activeImage + 1} / {property.images.length} PHOTOS
                </span>
                <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md hover:bg-black/70">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sidebar Thumbnails (Desktop) */}
            <div className="custom-scrollbar hidden flex-col gap-4 overflow-y-auto pr-2 md:flex">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'relative aspect-video flex-shrink-0 overflow-hidden rounded-2xl transition-all duration-300',
                    idx === activeImage
                      ? 'ring-gold ring-offset-charcoal-900 ring-4 ring-offset-4'
                      : 'opacity-40 hover:opacity-100',
                  )}
                >
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Layout */}
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* Main Info */}
          <div className="space-y-12 lg:col-span-2">
            {/* Key Specifications Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { label: 'Surface', value: `${property.surface} m²`, icon: Expand },
                { label: 'Chambres', value: property.bedrooms, icon: BedDouble },
                { label: 'Douches', value: property.bathrooms, icon: Bath },
                { label: 'Construction', value: property.yearBuilt ?? 'Récent', icon: Calendar },
              ].map((spec, i) => (
                <div
                  key={i}
                  className="bg-charcoal-50 border-charcoal-100/50 flex flex-col items-center gap-2 rounded-3xl border p-6 text-center"
                >
                  <spec.icon className="text-navy mb-1 h-6 w-6" />
                  <span className="text-charcoal text-xl font-bold">{spec.value || '-'}</span>
                  <span className="text-charcoal-400 text-xs font-bold uppercase tracking-widest">
                    {spec.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-charcoal flex items-center gap-3 font-serif text-3xl font-bold">
                <div className="bg-gold h-8 w-1.5 rounded-full" />
                Présentation du bien
              </h2>
              <div className="prose prose-lg text-charcoal-600 max-w-none whitespace-pre-line font-light leading-relaxed">
                {property.description}
              </div>
            </div>

            {/* Features / Amenities */}
            {property.features && property.features.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-charcoal font-serif text-3xl font-bold">
                  Équipements d'exception
                </h2>
                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                  {property.features.map((feature) => (
                    <div key={feature} className="group flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 transition-all group-hover:bg-emerald-500 group-hover:text-white">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-charcoal-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Price & Contact */}
          <aside className="space-y-8">
            {/* Sticky Price Card */}
            <div className="sticky top-24 space-y-6">
              <motion.div
                className="border-charcoal-100 shadow-navy/5 relative overflow-hidden rounded-[32px] border bg-white p-8 shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
              >
                {/* Background accent */}
                <div className="bg-gold/5 absolute right-0 top-0 h-32 w-32 rounded-full blur-3xl" />

                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-charcoal-400 text-xs font-bold uppercase tracking-[0.2em]">
                      PRIX DIRECT PROPRIÉTAIRE
                    </span>
                    {property.isVerified && (
                      <Badge
                        variant="success"
                        className="border-none bg-emerald-50 text-emerald-600"
                      >
                        Escrow OK
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-navy font-serif text-4xl font-bold">
                      {formatPrice(property.price, property.currency)}
                    </p>
                    <p className="text-charcoal-400 text-xs font-medium">
                      Taxes et frais de mutation non inclus*
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button
                      size="lg"
                      className="shadow-navy/20 h-14 rounded-full text-base font-bold shadow-lg"
                    >
                      INITIER L'ACHAT SÉCURISÉ
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-charcoal-200 h-14 rounded-full"
                    >
                      FAIRE UNE OFFRE
                    </Button>
                  </div>

                  <div className="border-charcoal-100 flex items-center gap-3 border-t pt-4">
                    <div className="bg-navy/5 flex h-10 w-10 items-center justify-center rounded-full">
                      <Shield className="text-navy h-5 w-5" />
                    </div>
                    <p className="text-charcoal-500 text-[11px] leading-snug">
                      Votre transaction est protégée par notre protocole **SecureTrade Escrow**.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Tax Calculator Integration */}
              {(property.purpose === 'SALE' || property.purpose === 'INVESTMENT') && (
                <TaxCalculator
                  price={property.price}
                  currency={property.currency}
                  country={property.country}
                />
              )}

              {/* Agent Profile */}
              <div className="bg-charcoal-50 border-charcoal-100/50 space-y-6 rounded-[32px] border p-8">
                <h3 className="text-charcoal flex items-center gap-2 font-bold">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Conseiller Dédié
                </h3>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {property.agent.avatar ? (
                      <img
                        src={property.agent.avatar}
                        alt=""
                        className="h-16 w-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="bg-navy flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white">
                        {property.agent.name.charAt(0)}
                      </div>
                    )}
                    {property.agent.isVerified && (
                      <div className="border-charcoal-50 absolute -bottom-2 -right-2 rounded-full border-2 bg-emerald-500 p-1 text-white">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-charcoal text-lg font-bold">{property.agent.name}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Star className="fill-gold text-gold h-3.5 w-3.5" />
                      <span className="text-charcoal text-xs font-bold">
                        {property.agent.rating}
                      </span>
                      <span className="text-charcoal-400 text-[10px] font-bold uppercase tracking-wider">
                        ({property.agent.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="border-charcoal-200 hover:border-navy group flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 transition-all"
                  >
                    <Phone className="text-charcoal-400 group-hover:text-navy h-4 w-4" />
                    <span className="text-charcoal text-[10px] font-bold uppercase">Appeler</span>
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="border-charcoal-200 hover:border-navy group flex flex-col items-center gap-1 rounded-2xl border bg-white p-3 transition-all"
                  >
                    <Mail className="text-charcoal-400 group-hover:text-navy h-4 w-4" />
                    <span className="text-charcoal text-[10px] font-bold uppercase">Message</span>
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile Floating Bar */}
      <div className="border-charcoal-100 fixed inset-x-0 bottom-0 z-50 flex items-center justify-between border-t bg-white p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] lg:hidden">
        <div>
          <p className="text-navy text-2xl font-bold">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="text-charcoal-400 text-[10px] font-bold uppercase">
            {purposeLabel[property.purpose]}
          </p>
        </div>
        <Button className="h-12 rounded-full px-8 font-bold">CONTACTER</Button>
      </div>
    </article>
  );
}
