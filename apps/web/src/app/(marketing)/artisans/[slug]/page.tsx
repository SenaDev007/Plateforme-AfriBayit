import type React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, MapPin, Star, CheckCircle2, Phone, Mail, Clock, Award, Briefcase, MessageSquare } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Artisan — ${slug}`, description: 'Profil artisan certifié AfriBayit' };
}

const MOCK_ARTISAN = {
  id: '1',
  slug: 'kouassi-tech-electricite',
  name: 'Kouassi Tech Électricité',
  category: 'ELECTRICIAN',
  categoryLabel: 'Électricien',
  categoryEmoji: '⚡',
  city: 'Abidjan',
  country: 'Côte d\'Ivoire',
  district: 'Marcory',
  phone: '+225 07 00 00 00',
  email: 'contact@kouassi-tech.ci',
  whatsapp: '+225 07 00 00 00',
  rating: 4.9,
  reviewCount: 87,
  jobsDone: 214,
  yearsExperience: 12,
  hourlyRate: 5000,
  currency: 'XOF',
  bio: `Électricien certifié avec 12 ans d'expérience dans l'installation et la maintenance électrique résidentielle et commerciale en Côte d'Ivoire.

Spécialisé dans la mise aux normes des installations électriques, l'installation de tableaux électriques, la pose de prises et interrupteurs, et le dépannage d'urgence 24h/24.

Mon équipe de 4 techniciens qualifiés intervient dans tout le Grand Abidjan. Devis gratuit en 24h.`,
  isAvailable: true,
  isCertified: true,
  certifications: ['Certification CNEC Côte d\'Ivoire', 'Habilitation B2V BR BC', 'Certification AfriBayit Pro'],
  specialties: ['Installation électrique neuve', 'Dépannage urgence', 'Mise aux normes', 'Éclairage LED', 'Climatisation', 'Domotique', 'Groupe électrogène'],
  services: [
    { id: '1', name: 'Diagnostic électrique', description: 'Inspection complète de l\'installation', price: 15000, unit: 'forfait' },
    { id: '2', name: 'Installation tableau électrique', description: 'Remplacement ou installation neuve', price: 85000, unit: 'à partir de' },
    { id: '3', name: 'Pose de prise / interrupteur', description: 'Par unité, matériel inclus', price: 8000, unit: '/unité' },
    { id: '4', name: 'Dépannage urgence', description: 'Intervention en moins de 2h', price: 25000, unit: 'déplacement' },
  ],
  reviews: [
    { id: '1', author: 'Mme Konan A.', rating: 5, comment: 'Travail impeccable, très professionnel. Équipe ponctuelle et propre. Je recommande vivement !', date: '2026-03-15', job: 'Rénovation électrique complète villa' },
    { id: '2', author: 'M. Traoré B.', rating: 5, comment: 'Dépannage rapide le dimanche. Prix raisonnable pour une urgence. Merci !', date: '2026-02-28', job: 'Dépannage panne générale' },
    { id: '3', author: 'Résidence Les Palmiers', rating: 5, comment: 'Installation électrique de 12 appartements. Délais respectés, travail aux normes.', date: '2026-01-20', job: 'Installation immeuble résidentiel' },
  ],
};

export default async function ArtisanDetailPage({ params }: Props): Promise<React.ReactElement> {
  const { slug } = await params;
  if (!slug) notFound();

  const artisan = MOCK_ARTISAN;

  return (
    <div className="min-h-screen bg-charcoal-50">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/artisans" className="flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-charcoal mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux artisans
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left — Main info */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Profile header */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-navy/10 text-3xl flex-shrink-0" aria-hidden="true">
                  {artisan.categoryEmoji}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="font-serif text-2xl font-bold text-charcoal">{artisan.name}</h1>
                    {artisan.isCertified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium bg-emerald/10 rounded-full px-2 py-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Certifié AfriBayit
                      </span>
                    )}
                  </div>
                  <Badge variant="sky">{artisan.categoryLabel}</Badge>
                  <p className="flex items-center gap-1.5 text-sm text-charcoal-400 mt-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" /> {artisan.district}, {artisan.city}, {artisan.country}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-charcoal-600">
                    <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-gold text-gold" />{artisan.rating} ({artisan.reviewCount} avis)</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-4 w-4 text-navy" />{artisan.jobsDone} missions</span>
                    <span className="flex items-center gap-1"><Award className="h-4 w-4 text-sky" />{artisan.yearsExperience} ans d'expérience</span>
                    <span className={`flex items-center gap-1 font-medium ${artisan.isAvailable ? 'text-emerald-700' : 'text-charcoal-400'}`}>
                      <Clock className="h-4 w-4" />{artisan.isAvailable ? 'Disponible' : 'Occupé'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-3">À propos</h2>
              <p className="text-charcoal-600 leading-relaxed whitespace-pre-line">{artisan.bio}</p>
            </div>

            {/* Specialties */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-3">Spécialités</h2>
              <div className="flex flex-wrap gap-2">
                {artisan.specialties.map((s) => (
                  <span key={s} className="flex items-center gap-1.5 text-sm text-charcoal-600 bg-charcoal-50 rounded-full px-3 py-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald flex-shrink-0" aria-hidden="true" /> {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Services & Tarifs */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">Services & Tarifs</h2>
              <div className="flex flex-col gap-3">
                {artisan.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-charcoal-50">
                    <div>
                      <p className="font-medium text-charcoal text-sm">{service.name}</p>
                      <p className="text-xs text-charcoal-400">{service.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-mono font-semibold text-navy">{service.price.toLocaleString('fr-FR')} FCFA</p>
                      <p className="text-xs text-charcoal-400">{service.unit}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-3">Certifications</h2>
              <div className="flex flex-col gap-2">
                {artisan.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2 text-sm text-charcoal-600">
                    <Award className="h-4 w-4 text-gold flex-shrink-0" aria-hidden="true" /> {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-6">
              <h2 className="font-serif text-lg font-semibold text-charcoal mb-4">
                Avis clients <span className="text-charcoal-400 font-normal text-base">({artisan.reviewCount})</span>
              </h2>
              <div className="flex flex-col gap-4">
                {artisan.reviews.map((review) => (
                  <div key={review.id} className="flex flex-col gap-2 pb-4 border-b border-charcoal-50 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-charcoal text-sm">{review.author}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
                        ))}
                        <span className="text-xs text-charcoal-400 ml-1">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                    <p className="text-sm text-charcoal-600 italic">"{review.comment}"</p>
                    <p className="text-xs text-charcoal-400">Mission : {review.job}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Contact card */}
          <div>
            <div className="sticky top-24 bg-white rounded-xl border border-charcoal-100 p-5 flex flex-col gap-4">
              <div>
                <p className="text-xs text-charcoal-400">Tarif horaire</p>
                <p className="font-mono text-2xl font-bold text-navy">{artisan.hourlyRate.toLocaleString('fr-FR')} <span className="text-base font-normal text-charcoal-400">FCFA/h</span></p>
              </div>

              <div className="flex flex-col gap-2">
                <a href={`tel:${artisan.phone}`} className="flex items-center gap-2 rounded-lg bg-navy text-white px-4 py-3 text-sm font-medium hover:bg-navy/90 transition-colors">
                  <Phone className="h-4 w-4" aria-hidden="true" /> {artisan.phone}
                </a>
                <a href={`https://wa.me/${artisan.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg border border-emerald text-emerald px-4 py-3 text-sm font-medium hover:bg-emerald/5 transition-colors">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" /> WhatsApp
                </a>
                <a href={`mailto:${artisan.email}`} className="flex items-center gap-2 rounded-lg border border-charcoal-200 text-charcoal px-4 py-3 text-sm font-medium hover:border-navy hover:text-navy transition-colors">
                  <Mail className="h-4 w-4" aria-hidden="true" /> Envoyer un email
                </a>
              </div>

              <div className="bg-charcoal-50 rounded-lg p-3 text-xs text-charcoal-400 text-center">
                🔒 Artisan vérifié KYC par AfriBayit
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
