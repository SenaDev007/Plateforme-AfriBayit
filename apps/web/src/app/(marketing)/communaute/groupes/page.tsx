import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Users } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Groupes — Communauté AfriBayit',
  description: "Rejoignez des groupes thématiques sur l'immobilier en Afrique de l'Ouest.",
};

interface ApiGroup {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: string | null;
  isPrivate: boolean;
  _count: { members: number; posts: number };
}

const FALLBACK_GROUPS = [
  {
    id: '1',
    slug: 'investisseurs-benin',
    name: 'Investisseurs Bénin',
    description: "Opportunités d'investissement immobilier au Bénin.",
    category: 'Investissement',
    isPrivate: false,
    _count: { members: 1240, posts: 89 },
  },
  {
    id: '2',
    slug: 'primo-accedants-ci',
    name: 'Primo-accédants CI',
    description: "Conseils pour les primo-accédants en Côte d'Ivoire.",
    category: 'Achat',
    isPrivate: false,
    _count: { members: 890, posts: 134 },
  },
  {
    id: '3',
    slug: 'agents-west-africa',
    name: 'Agents immobiliers West Africa',
    description: "Réseau des professionnels de l'immobilier en Afrique de l'Ouest.",
    category: 'Professionnel',
    isPrivate: false,
    _count: { members: 2100, posts: 312 },
  },
  {
    id: '4',
    slug: 'location-lome',
    name: 'Location Lomé',
    description: 'Offres et demandes de location à Lomé et alentours.',
    category: 'Location',
    isPrivate: false,
    _count: { members: 430, posts: 67 },
  },
  {
    id: '5',
    slug: 'immobilier-burkina',
    name: 'Immobilier Burkina',
    description: 'Marché immobilier du Burkina Faso — analyses et opportunités.',
    category: 'Investissement',
    isPrivate: false,
    _count: { members: 560, posts: 45 },
  },
  {
    id: '6',
    slug: 'diaspora-immo',
    name: 'DiasporaImmo',
    description: 'Pour les Africains de la diaspora qui souhaitent investir au pays.',
    category: 'Diaspora',
    isPrivate: false,
    _count: { members: 3400, posts: 521 },
  },
];

async function fetchGroups(): Promise<ApiGroup[]> {
  try {
    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/v1/community/groups`, { next: { revalidate: 120 } });
    if (!res.ok) return FALLBACK_GROUPS;
    const data = (await res.json()) as ApiGroup[];
    return data.length > 0 ? data : FALLBACK_GROUPS;
  } catch {
    return FALLBACK_GROUPS;
  }
}

export default async function GroupesPage(): Promise<React.ReactElement> {
  const groups = await fetchGroups();

  return (
    <div className="bg-sand-50 min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/communaute"
          className="text-charcoal-400 hover:text-charcoal mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Communauté
        </Link>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-charcoal font-serif text-3xl font-bold">Groupes</h1>
            <p className="text-charcoal-400 mt-1">
              Rejoignez des communautés thématiques sur l&apos;immobilier en Afrique.
            </p>
          </div>
          <Link
            href="/communaute/groupes/nouveau"
            className="bg-navy hover:bg-navy/90 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            + Créer un groupe
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <div
              key={group.id}
              className="border-charcoal-100 rounded-xl border bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start gap-3">
                <div className="bg-navy/10 text-navy flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                  {group.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-charcoal truncate font-semibold">{group.name}</h3>
                  {group.category && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {group.category}
                    </Badge>
                  )}
                </div>
              </div>
              {group.description && (
                <p className="text-charcoal-400 mb-4 line-clamp-2 text-sm">{group.description}</p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-charcoal-400 flex items-center gap-1.5 text-xs">
                  <Users className="h-3.5 w-3.5" />
                  {group._count.members.toLocaleString('fr-FR')} membres
                </span>
                <Button variant="outline" size="sm">
                  Rejoindre
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
