import type React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { Star, MapPin, CheckCircle2, Clock, Phone, Wrench } from 'lucide-react';
import { Badge } from '@afribayit/ui';

interface ApiArtisan {
  id: string;
  slug: string;
  companyName: string;
  category: string;
  bio: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  hourlyRate: number | null;
  currency: string;
  isAvailable: boolean;
  isCertified: boolean;
  phone: string;
  specialties?: string[];
  services?: Array<{ name: string }>;
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

function ArtisanCard({ artisan }: { artisan: ApiArtisan }): React.ReactElement {
  const meta = CATEGORY_META[artisan.category] ?? { label: artisan.category, emoji: '🔨' };
  const specialties = artisan.specialties ?? artisan.services?.map((s) => s.name) ?? [];

  return (
    <div className="border-charcoal-100 flex flex-col gap-4 rounded-xl border bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div
          className="bg-navy/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl"
          aria-hidden="true"
        >
          {meta.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-charcoal font-semibold leading-tight">{artisan.companyName}</h3>
            {artisan.isCertified && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" /> Certifié
              </span>
            )}
          </div>
          <Badge variant="sky" className="mt-1 text-xs">
            {meta.label}
          </Badge>
          <p className="text-charcoal-400 mt-1 flex items-center gap-1 text-xs">
            <MapPin className="h-3 w-3" aria-hidden="true" /> {artisan.city}, {artisan.country}
          </p>
        </div>
        <div
          className={`flex flex-shrink-0 items-center gap-1 text-xs font-medium ${artisan.isAvailable ? 'text-emerald-700' : 'text-charcoal-400'}`}
        >
          <Clock className="h-3 w-3" aria-hidden="true" />
          {artisan.isAvailable ? 'Disponible' : 'Occupé'}
        </div>
      </div>

      <p className="text-charcoal-600 line-clamp-2 text-sm">{artisan.bio}</p>

      {specialties.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specialties.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-charcoal-500 bg-charcoal-50 rounded-full px-2 py-0.5 text-xs"
            >
              {s}
            </span>
          ))}
          {specialties.length > 3 && (
            <span className="text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5 text-xs">
              +{specialties.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="text-charcoal-400 flex items-center gap-3">
          <span className="flex items-center gap-0.5">
            <Star className="text-gold fill-gold h-3.5 w-3.5" aria-hidden="true" />
            <span className="text-charcoal font-semibold">{artisan.rating.toFixed(1)}</span>
            <span className="text-xs">({artisan.reviewCount})</span>
          </span>
          <span className="text-xs">{artisan.jobsDone} missions</span>
        </div>
        {artisan.hourlyRate && (
          <p className="text-navy font-mono font-semibold">
            {artisan.hourlyRate.toLocaleString('fr-FR')} FCFA
            <span className="text-charcoal-400 text-xs font-normal">/h</span>
          </p>
        )}
      </div>

      <div className="border-charcoal-50 flex gap-2 border-t pt-1">
        <Link href={`/artisans/${artisan.slug}` as Route} className="flex-1">
          <button className="border-navy text-navy hover:bg-navy/5 w-full rounded-lg border py-2 text-sm font-medium transition-colors">
            Voir le profil
          </button>
        </Link>
        <a
          href={`tel:${artisan.phone}`}
          className="bg-navy hover:bg-navy/90 flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          aria-label={`Appeler ${artisan.companyName}`}
        >
          <Phone className="h-3.5 w-3.5" aria-hidden="true" /> Appeler
        </a>
      </div>
    </div>
  );
}

interface ArtisansListProps {
  searchParams: Record<string, string | undefined>;
}

export async function ArtisansList({
  searchParams,
}: ArtisansListProps): Promise<React.ReactElement> {
  let artisans: ApiArtisan[] = [];
  let total = 0;

  try {
    const params = new URLSearchParams();
    if (searchParams['ville']) params.set('ville', searchParams['ville']);
    if (searchParams['categorie']) params.set('categorie', searchParams['categorie']);
    if (searchParams['noteMin']) params.set('noteMin', searchParams['noteMin']);
    if (searchParams['disponible']) params.set('disponible', searchParams['disponible']);
    if (searchParams['certifie']) params.set('certifie', searchParams['certifie']);
    params.set('page', searchParams['page'] ?? '1');
    params.set('limit', '12');

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/artisans?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = (await res.json()) as { data: ApiArtisan[]; total: number };
      artisans = data.data ?? [];
      total = data.total ?? artisans.length;
    }
  } catch {
    // API unavailable — empty state shown
  }

  if (artisans.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <Wrench className="text-charcoal-200 h-12 w-12" aria-hidden="true" />
        <p className="text-charcoal text-lg font-semibold">Aucun artisan trouvé</p>
        <p className="text-charcoal-400 text-sm">Modifiez vos critères de recherche.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-charcoal-400 text-sm">
        <span className="text-charcoal font-semibold">{total}</span> artisan{total > 1 ? 's' : ''}{' '}
        trouvé{total > 1 ? 's' : ''}
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {artisans.map((artisan) => (
          <ArtisanCard key={artisan.id} artisan={artisan} />
        ))}
      </div>
    </div>
  );
}
