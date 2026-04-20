import type React from 'react';
import Link from 'next/link';
import { Star, MapPin, CheckCircle2, Clock, Phone } from 'lucide-react';
import { Badge } from '@afribayit/ui';

interface Artisan {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  categoryEmoji: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  hourlyRate?: number;
  currency: string;
  bio: string;
  avatar?: string;
  isAvailable: boolean;
  isCertified: boolean;
  specialties: string[];
}

const MOCK_ARTISANS: Artisan[] = [
  {
    id: '1', slug: 'kouassi-tech-electricite', name: 'Kouassi Tech Électricité',
    category: 'ELECTRICIAN', categoryLabel: 'Électricien', categoryEmoji: '⚡',
    city: 'Abidjan', country: 'Côte d\'Ivoire',
    rating: 4.9, reviewCount: 87, jobsDone: 214,
    hourlyRate: 5000, currency: 'XOF',
    bio: 'Électricien certifié avec 12 ans d\'expérience. Installations, dépannages, mise aux normes.',
    isAvailable: true, isCertified: true,
    specialties: ['Installation électrique', 'Dépannage', 'Mise aux normes', 'Éclairage LED'],
  },
  {
    id: '2', slug: 'bako-plomberie-cotonou', name: 'Bako Plomberie',
    category: 'PLUMBER', categoryLabel: 'Plombier', categoryEmoji: '🔧',
    city: 'Cotonou', country: 'Bénin',
    rating: 4.7, reviewCount: 63, jobsDone: 158,
    hourlyRate: 4000, currency: 'XOF',
    bio: 'Plombier professionnel, disponible 7j/7. Fuites, installations sanitaires, chauffe-eau.',
    isAvailable: true, isCertified: true,
    specialties: ['Plomberie sanitaire', 'Fuites', 'Chauffe-eau solaire', 'Fosse septique'],
  },
  {
    id: '3', slug: 'constructions-sawadogo', name: 'Constructions Sawadogo',
    category: 'MASON', categoryLabel: 'Maçon', categoryEmoji: '🧱',
    city: 'Ouagadougou', country: 'Burkina Faso',
    rating: 4.8, reviewCount: 112, jobsDone: 89,
    hourlyRate: undefined, currency: 'XOF',
    bio: 'Entreprise de maçonnerie et gros œuvre. Constructions neuves, rénovations, clôtures.',
    isAvailable: false, isCertified: true,
    specialties: ['Gros œuvre', 'Rénovation', 'Clôture', 'Carrelage'],
  },
  {
    id: '4', slug: 'atelier-couleurs-lome', name: 'Atelier Couleurs',
    category: 'PAINTER', categoryLabel: 'Peintre', categoryEmoji: '🎨',
    city: 'Lomé', country: 'Togo',
    rating: 4.6, reviewCount: 44, jobsDone: 127,
    hourlyRate: 3000, currency: 'XOF',
    bio: 'Peintre décorateur, intérieur et extérieur. Travail soigné et matériaux de qualité.',
    isAvailable: true, isCertified: false,
    specialties: ['Peinture intérieure', 'Peinture façade', 'Décoration murale', 'Imperméabilisation'],
  },
  {
    id: '5', slug: 'menuiserie-diallo', name: 'Menuiserie Diallo & Fils',
    category: 'CARPENTER', categoryLabel: 'Menuisier', categoryEmoji: '🪚',
    city: 'Abidjan', country: 'Côte d\'Ivoire',
    rating: 4.9, reviewCount: 91, jobsDone: 203,
    hourlyRate: 6000, currency: 'XOF',
    bio: 'Menuiserie bois et aluminium. Portes, fenêtres, cuisines équipées, placards sur mesure.',
    isAvailable: true, isCertified: true,
    specialties: ['Menuiserie bois', 'Aluminium', 'Cuisine équipée', 'Placards sur mesure'],
  },
  {
    id: '6', slug: 'jardins-tropicaux-cotonou', name: 'Jardins Tropicaux',
    category: 'LANDSCAPER', categoryLabel: 'Paysagiste', categoryEmoji: '🌿',
    city: 'Cotonou', country: 'Bénin',
    rating: 4.5, reviewCount: 28, jobsDone: 67,
    hourlyRate: 3500, currency: 'XOF',
    bio: 'Création et entretien de jardins tropicaux. Gazon, arbustes, arrosage automatique.',
    isAvailable: true, isCertified: false,
    specialties: ['Création de jardin', 'Entretien', 'Arrosage automatique', 'Gazon naturel/synthétique'],
  },
];

function ArtisanCard({ artisan }: { artisan: Artisan }): React.ReactElement {
  return (
    <div className="bg-white rounded-xl border border-charcoal-100 p-5 flex flex-col gap-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-navy/10 text-2xl flex-shrink-0" aria-hidden="true">
          {artisan.categoryEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-charcoal leading-tight">{artisan.name}</h3>
            {artisan.isCertified && (
              <span className="flex items-center gap-0.5 text-xs text-emerald-700 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Certifié
              </span>
            )}
          </div>
          <Badge variant="sky" className="text-xs mt-1">{artisan.categoryLabel}</Badge>
          <p className="flex items-center gap-1 text-xs text-charcoal-400 mt-1">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {artisan.city}, {artisan.country}
          </p>
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${artisan.isAvailable ? 'text-emerald-700' : 'text-charcoal-400'}`}>
          <Clock className="h-3 w-3" aria-hidden="true" />
          {artisan.isAvailable ? 'Disponible' : 'Occupé'}
        </div>
      </div>

      <p className="text-sm text-charcoal-600 line-clamp-2">{artisan.bio}</p>

      <div className="flex flex-wrap gap-1">
        {artisan.specialties.slice(0, 3).map((s) => (
          <span key={s} className="text-xs text-charcoal-500 bg-charcoal-50 rounded-full px-2 py-0.5">{s}</span>
        ))}
        {artisan.specialties.length > 3 && (
          <span className="text-xs text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5">+{artisan.specialties.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-charcoal-400">
          <span className="flex items-center gap-0.5">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
            <span className="font-semibold text-charcoal">{artisan.rating}</span>
            <span className="text-xs">({artisan.reviewCount})</span>
          </span>
          <span className="text-xs">{artisan.jobsDone} missions</span>
        </div>
        {artisan.hourlyRate && (
          <p className="font-mono font-semibold text-navy">
            {artisan.hourlyRate.toLocaleString('fr-FR')} FCFA<span className="text-xs font-normal text-charcoal-400">/h</span>
          </p>
        )}
      </div>

      <div className="flex gap-2 pt-1 border-t border-charcoal-50">
        <Link href={`/artisans/${artisan.slug}`} className="flex-1">
          <button className="w-full rounded-lg border border-navy text-navy text-sm font-medium py-2 hover:bg-navy/5 transition-colors">
            Voir le profil
          </button>
        </Link>
        <a href={`tel:+22900000000`} className="flex items-center gap-1.5 rounded-lg bg-navy text-white text-sm font-medium px-4 py-2 hover:bg-navy/90 transition-colors" aria-label={`Appeler ${artisan.name}`}>
          <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Appeler
        </a>
      </div>
    </div>
  );
}

interface ArtisansListProps {
  searchParams: Record<string, string | undefined>;
}

export async function ArtisansList({ searchParams: _ }: ArtisansListProps): Promise<React.ReactElement> {
  const artisans = MOCK_ARTISANS;
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-charcoal-400">
        <span className="font-semibold text-charcoal">{artisans.length}</span> artisans trouvés
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {artisans.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>
    </div>
  );
}
