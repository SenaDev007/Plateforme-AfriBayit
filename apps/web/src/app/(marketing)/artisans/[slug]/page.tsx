import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronLeft,
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Clock,
  Award,
  Briefcase,
  MessageSquare,
} from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

interface ApiService {
  id: string;
  name: string;
  description: string | null;
  basePrice: number | null;
  unit: string | null;
}

interface ApiReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: { firstName: string; lastName: string };
}

interface ApiArtisan {
  id: string;
  slug: string;
  companyName: string;
  category: string;
  bio: string;
  city: string;
  country: string;
  district: string | null;
  phone: string;
  whatsapp: string | null;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  hourlyRate: number | null;
  currency: string;
  isAvailable: boolean;
  isCertified: boolean;
  specialties: string[];
  services: ApiService[];
  reviews: ApiReview[];
}

const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  ELECTRICIAN: { label: 'Électricien', emoji: '⚡' },
  PLUMBER: { label: 'Plombier', emoji: '🔧' },
  MASON: { label: 'Maçon', emoji: '🧱' },
  PAINTER: { label: 'Peintre', emoji: '🎨' },
  CARPENTER: { label: 'Menuisier', emoji: '🪚' },
  LANDSCAPER: { label: 'Paysagiste', emoji: '🌿' },
  CLEANER: { label: 'Agent de ménage', emoji: '🧹' },
  SECURITY: { label: 'Sécurité', emoji: '🔒' },
  MOVER: { label: 'Déménageur', emoji: '📦' },
  ARCHITECT: { label: 'Architecte', emoji: '📐' },
};

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

async function fetchArtisan(slug: string): Promise<ApiArtisan | null> {
  try {
    const res = await fetch(`${API_URL}/api/v1/artisans/${slug}`, {
      next: { revalidate: 60 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return (await res.json()) as ApiArtisan;
  } catch {
    return null;
  }
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artisan = await fetchArtisan(slug);
  if (!artisan) return { title: 'Artisan introuvable' };
  const meta = CATEGORY_META[artisan.category];
  return {
    title: `${artisan.companyName} — ${meta?.label ?? artisan.category} · AfriBayit`,
    description: artisan.bio.slice(0, 155),
  };
}

export default async function ArtisanDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  const artisan = await fetchArtisan(slug);
  if (!artisan) notFound();

  const meta = CATEGORY_META[artisan.category] ?? { label: artisan.category, emoji: '🔨' };

  return (
    <div className="bg-charcoal-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/artisans"
          className="text-charcoal-400 hover:text-charcoal mb-6 flex items-center gap-1.5 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux artisans
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left — Main info */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Profile header */}
            <div className="border-charcoal-100 rounded-xl border bg-white p-6">
              <div className="flex items-start gap-4">
                <div
                  className="bg-navy/10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl text-3xl"
                  aria-hidden="true"
                >
                  {meta.emoji}
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h1 className="text-charcoal font-serif text-2xl font-bold">
                      {artisan.companyName}
                    </h1>
                    {artisan.isCertified && (
                      <span className="bg-emerald/10 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Certifié
                        AfriBayit
                      </span>
                    )}
                  </div>
                  <Badge variant="sky">{meta.label}</Badge>
                  <p className="text-charcoal-400 mt-2 flex items-center gap-1.5 text-sm">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {artisan.district ? `${artisan.district}, ` : ''}
                    {artisan.city}, {artisan.country}
                  </p>
                  <div className="text-charcoal-600 mt-3 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Star className="fill-gold text-gold h-4 w-4" aria-hidden="true" />
                      {artisan.rating.toFixed(1)} ({artisan.reviewCount} avis)
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="text-navy h-4 w-4" aria-hidden="true" />
                      {artisan.jobsDone} missions
                    </span>
                    <span
                      className={`flex items-center gap-1 font-medium ${artisan.isAvailable ? 'text-emerald-700' : 'text-charcoal-400'}`}
                    >
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {artisan.isAvailable ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="border-charcoal-100 rounded-xl border bg-white p-6">
              <h2 className="text-charcoal mb-3 font-serif text-lg font-semibold">À propos</h2>
              <p className="text-charcoal-600 whitespace-pre-line leading-relaxed">{artisan.bio}</p>
            </div>

            {/* Specialties */}
            {artisan.specialties.length > 0 && (
              <div className="border-charcoal-100 rounded-xl border bg-white p-6">
                <h2 className="text-charcoal mb-3 font-serif text-lg font-semibold">Spécialités</h2>
                <div className="flex flex-wrap gap-2">
                  {artisan.specialties.map((s) => (
                    <span
                      key={s}
                      className="text-charcoal-600 bg-charcoal-50 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm"
                    >
                      <CheckCircle2
                        className="text-emerald h-3.5 w-3.5 flex-shrink-0"
                        aria-hidden="true"
                      />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Services & Tarifs */}
            {artisan.services.length > 0 && (
              <div className="border-charcoal-100 rounded-xl border bg-white p-6">
                <h2 className="text-charcoal mb-4 font-serif text-lg font-semibold">
                  Services & Tarifs
                </h2>
                <div className="flex flex-col gap-3">
                  {artisan.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-charcoal-50 flex items-center justify-between gap-4 rounded-lg p-3"
                    >
                      <div>
                        <p className="text-charcoal text-sm font-medium">{service.name}</p>
                        {service.description && (
                          <p className="text-charcoal-400 text-xs">{service.description}</p>
                        )}
                      </div>
                      {service.basePrice != null && (
                        <div className="flex-shrink-0 text-right">
                          <p className="text-navy font-mono font-semibold">
                            {service.basePrice.toLocaleString('fr-FR')} FCFA
                          </p>
                          {service.unit && (
                            <p className="text-charcoal-400 text-xs">{service.unit}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="border-charcoal-100 rounded-xl border bg-white p-6">
              <h2 className="text-charcoal mb-4 font-serif text-lg font-semibold">
                Avis clients{' '}
                <span className="text-charcoal-400 text-base font-normal">
                  ({artisan.reviewCount})
                </span>
              </h2>
              {artisan.reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {artisan.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-charcoal-50 flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-charcoal text-sm font-medium">
                          {review.reviewer.firstName} {review.reviewer.lastName}
                        </p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star
                              key={i}
                              className="fill-gold text-gold h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          ))}
                          <span className="text-charcoal-400 ml-1 text-xs">
                            {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </div>
                      <p className="text-charcoal-600 text-sm italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-charcoal-400 text-sm">Aucun avis pour le moment.</p>
              )}
            </div>
          </div>

          {/* Right — Contact card */}
          <div>
            <div className="border-charcoal-100 sticky top-24 flex flex-col gap-4 rounded-xl border bg-white p-5">
              {artisan.hourlyRate != null && (
                <div>
                  <p className="text-charcoal-400 text-xs">Tarif horaire</p>
                  <p className="text-navy font-mono text-2xl font-bold">
                    {artisan.hourlyRate.toLocaleString('fr-FR')}{' '}
                    <span className="text-charcoal-400 text-base font-normal">FCFA/h</span>
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${artisan.phone}`}
                  className="bg-navy hover:bg-navy/90 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition-colors"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" /> {artisan.phone}
                </a>
                {artisan.whatsapp && (
                  <a
                    href={`https://wa.me/${artisan.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-emerald text-emerald hover:bg-emerald/5 flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-colors"
                  >
                    <MessageSquare className="h-4 w-4" aria-hidden="true" /> WhatsApp
                  </a>
                )}
              </div>

              {artisan.isCertified && (
                <div className="bg-charcoal-50 text-charcoal-400 rounded-lg p-3 text-center text-xs">
                  <Award className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
                  Artisan vérifié KYC par AfriBayit
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
