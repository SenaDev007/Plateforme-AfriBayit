'use client';
import type React from 'react';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
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
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} M FCFA`;
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

  return (
    <article aria-label={property.title} className="pb-24 lg:pb-0">
      {/* Gallery */}
      <section aria-label="Galerie photos" className="bg-charcoal-900">
        <div className="mx-auto max-w-7xl">
          {/* Main image */}
          <div className="relative aspect-video max-h-[500px] overflow-hidden">
            <img
              src={property.images[activeImage]?.url ?? ''}
              alt={property.images[activeImage]?.alt ?? property.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {property.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3" role="list" aria-label="Miniatures">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  role="listitem"
                  aria-label={`Image ${idx + 1}: ${img.alt}`}
                  aria-current={idx === activeImage ? 'true' : undefined}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md transition-all ${
                    idx === activeImage ? 'ring-gold ring-2' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left — Main info */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Header */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">{property.type}</Badge>
                <Badge variant="sky">{purposeLabel[property.purpose] ?? property.purpose}</Badge>
                {property.isVerified && <Badge variant="trust">✓ Vérifié</Badge>}
                {property.isFeatured && <Badge variant="verified">⭐ Premium</Badge>}
              </div>

              <h1 className="text-charcoal font-serif text-2xl font-bold sm:text-3xl lg:text-4xl">
                {property.title}
              </h1>

              <p className="text-charcoal-400 flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {property.address ??
                  `${property.district ?? ''} ${property.city}, ${property.country}`.trim()}
              </p>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setFavorited((v) => !v)}
                  className="rounded-pill border-charcoal-200 hover:border-danger hover:text-danger flex items-center gap-1.5 border px-4 py-2 text-sm transition-colors"
                  aria-pressed={favorited}
                  aria-label={favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart
                    className={`h-4 w-4 ${favorited ? 'fill-danger text-danger' : ''}`}
                    aria-hidden="true"
                  />
                  {favorited ? 'Sauvegardé' : 'Sauvegarder'}
                </button>
                <button
                  className="rounded-pill border-charcoal-200 hover:border-sky hover:text-sky flex items-center gap-1.5 border px-4 py-2 text-sm transition-colors"
                  aria-label="Partager cette annonce"
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Partager
                </button>
              </div>
            </div>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.surface != null && (
                <div className="bg-charcoal-50 flex flex-col items-center gap-1 rounded-lg p-4">
                  <Expand className="text-navy h-5 w-5" aria-hidden="true" />
                  <span className="text-charcoal font-mono font-semibold">
                    {property.surface} m²
                  </span>
                  <span className="text-charcoal-400 text-xs">Surface</span>
                </div>
              )}
              {property.bedrooms != null && (
                <div className="bg-charcoal-50 flex flex-col items-center gap-1 rounded-lg p-4">
                  <BedDouble className="text-navy h-5 w-5" aria-hidden="true" />
                  <span className="text-charcoal font-mono font-semibold">{property.bedrooms}</span>
                  <span className="text-charcoal-400 text-xs">Chambres</span>
                </div>
              )}
              {property.bathrooms != null && (
                <div className="bg-charcoal-50 flex flex-col items-center gap-1 rounded-lg p-4">
                  <Bath className="text-navy h-5 w-5" aria-hidden="true" />
                  <span className="text-charcoal font-mono font-semibold">
                    {property.bathrooms}
                  </span>
                  <span className="text-charcoal-400 text-xs">Salles de bain</span>
                </div>
              )}
              {property.yearBuilt != null && (
                <div className="bg-charcoal-50 flex flex-col items-center gap-1 rounded-lg p-4">
                  <Calendar className="text-navy h-5 w-5" aria-hidden="true" />
                  <span className="text-charcoal font-mono font-semibold">
                    {property.yearBuilt}
                  </span>
                  <span className="text-charcoal-400 text-xs">Année</span>
                </div>
              )}
            </div>

            {/* Description */}
            <section aria-labelledby="desc-title">
              <h2 id="desc-title" className="text-charcoal mb-3 font-serif text-xl font-semibold">
                Description
              </h2>
              <p className="text-charcoal-600 whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </section>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <section aria-labelledby="features-title">
                <h2
                  id="features-title"
                  className="text-charcoal mb-3 font-serif text-xl font-semibold"
                >
                  Équipements &amp; caractéristiques
                </h2>
                <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {property.features.map((feature) => (
                    <li key={feature} className="text-charcoal-600 flex items-center gap-2 text-sm">
                      <CheckCircle2
                        className="text-emerald h-4 w-4 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Right — Price box + Agent */}
          <div className="flex flex-col gap-5">
            {/* Price box — sticky on desktop */}
            <motion.div
              className="flex flex-col gap-5 lg:sticky lg:top-24"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Price card */}
              <div className="border-charcoal-100 shadow-card rounded-xl border p-6">
                <div className="mb-1 flex items-start justify-between">
                  <p className="text-charcoal-400 text-xs">Prix</p>
                  {property.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600">
                      <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                      Escrow disponible
                    </span>
                  )}
                </div>
                <p className="text-navy mb-4 font-mono text-3xl font-bold">
                  {formatPrice(property.price, property.currency)}
                </p>

                <div className="flex flex-col gap-2">
                  <Button fullWidth size="lg">
                    Initier la transaction
                  </Button>
                  <Button variant="ghost" fullWidth>
                    Faire une offre
                  </Button>
                </div>

                <p className="text-charcoal-400 mt-3 text-center text-xs">
                  🔒 Transaction sécurisée par escrow AfriBayit
                </p>
              </div>

              {/* Tax calculator — SALE and INVESTMENT only */}
              {(property.purpose === 'SALE' || property.purpose === 'INVESTMENT') && (
                <TaxCalculator
                  price={property.price}
                  currency={property.currency}
                  country={property.country}
                />
              )}

              {/* Agent card */}
              <div className="border-charcoal-100 rounded-xl border p-5">
                <h3 className="text-charcoal mb-4 font-semibold">Agent</h3>
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="bg-navy flex h-12 w-12 items-center justify-center rounded-full font-semibold text-white"
                    aria-hidden="true"
                  >
                    {property.agent.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-charcoal font-medium">{property.agent.name}</p>
                    <div className="text-charcoal-400 flex items-center gap-1 text-xs">
                      <Star className="fill-gold text-gold h-3 w-3" aria-hidden="true" />
                      <span>{property.agent.rating}</span>
                      <span>({property.agent.reviewCount} avis)</span>
                      {property.agent.isVerified && (
                        <Badge variant="trust" className="ml-1">
                          Pro
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="border-charcoal-200 text-charcoal hover:border-navy hover:text-navy flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {property.agent.phone}
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="border-charcoal-200 text-charcoal hover:border-navy hover:text-navy flex items-center gap-2 rounded-md border px-4 py-2.5 text-sm font-medium transition-colors"
                  >
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    Envoyer un message
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div
        className="border-charcoal-100 fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t bg-white p-4 lg:hidden"
        aria-label="Actions rapides"
      >
        <div className="flex-1">
          <p className="text-navy font-mono text-lg font-bold">
            {formatPrice(property.price, property.currency)}
          </p>
          <p className="text-charcoal-400 text-xs">
            {purposeLabel[property.purpose] ?? property.purpose}
          </p>
        </div>
        <Button size="lg" className="flex-shrink-0">
          Contacter l'agent
        </Button>
      </div>
    </article>
  );
}
