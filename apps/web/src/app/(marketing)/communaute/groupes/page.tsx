import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, Users, Plus } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Groupes — Communauté AfriBayit',
  description: 'Rejoignez des groupes thématiques sur l'immobilier en Afrique de l'Ouest.',
};

const GROUPS = [
  {
    id: '1', name: 'Investisseurs Bénin', emoji: '🇧🇯', memberCount: 1240,
    category: 'Investissement', description: 'Opportunités d'investissement immobilier au Bénin.',
  },
  {
    id: '2', name: 'Primo-accédants CI', emoji: '🇨🇮', memberCount: 890,
    category: 'Achat', description: 'Conseils pour les primo-accédants en Côte d'Ivoire.',
  },
  {
    id: '3', name: 'Agents immobiliers West Africa', emoji: '🏢', memberCount: 2100,
    category: 'Professionnel', description: 'Réseau des professionnels de l'immobilier en Afrique de l'Ouest.',
  },
  {
    id: '4', name: 'Location Lomé', emoji: '🇹🇬', memberCount: 430,
    category: 'Location', description: 'Offres et demandes de location à Lomé et alentours.',
  },
  {
    id: '5', name: 'Immobilier Burkina', emoji: '🇧🇫', memberCount: 560,
    category: 'Investissement', description: 'Marché immobilier du Burkina Faso — analyses et opportunités.',
  },
  {
    id: '6', name: 'DiasporaImmo', emoji: '✈️', memberCount: 3400,
    category: 'Diaspora', description: 'Pour les Africains de la diaspora qui souhaitent investir au pays.',
  },
];

export default function GroupesPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/communaute"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-charcoal transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Communauté
        </Link>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-charcoal">Groupes</h1>
            <p className="text-charcoal-400 mt-1">Rejoignez des communautés thématiques sur l'immobilier en Afrique.</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-1.5" />
            Créer un groupe
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GROUPS.map((group) => (
            <div key={group.id} className="bg-white rounded-xl border border-charcoal-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{group.emoji}</span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-charcoal truncate">{group.name}</h3>
                  <Badge variant="outline" className="mt-1 text-xs">{group.category}</Badge>
                </div>
              </div>
              <p className="text-sm text-charcoal-400 mb-4 line-clamp-2">{group.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-charcoal-400">
                  <Users className="h-3.5 w-3.5" />
                  {group.memberCount.toLocaleString()} membres
                </span>
                <Button variant="outline" size="sm">Rejoindre</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
