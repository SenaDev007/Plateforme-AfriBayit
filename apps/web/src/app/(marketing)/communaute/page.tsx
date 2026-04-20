import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Users, TrendingUp, Pin, ThumbsUp, Eye, Plus } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Communauté AfriBayit',
  description: 'Échangez avec la communauté immobilière d\'Afrique de l\'Ouest — conseils, opportunités, actualités.',
};

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; avatar: string; city: string };
  likes: number;
  views: number;
  replies: number;
  isPinned: boolean;
  isTrending: boolean;
  createdAt: string;
  tags: string[];
}

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  category: string;
  emoji: string;
}

const POSTS: Post[] = [
  {
    id: '1', slug: 'eviter-arnaques-immobilieres-cotonou',
    title: 'Comment éviter les arnaques immobilières à Cotonou en 2026',
    excerpt: 'J\'ai faillis me faire escroquer lors de l\'achat d\'un terrain à Calavi. Voici les 7 signaux d\'alarme que j\'aurais dû repérer plus tôt…',
    category: 'Conseils', author: { name: 'Ayodélé K.', avatar: 'AK', city: 'Cotonou' },
    likes: 284, views: 3421, replies: 67, isPinned: true, isTrending: true,
    createdAt: '2026-04-15', tags: ['Arnaques', 'Sécurité', 'Cotonou', 'Acheteur'],
  },
  {
    id: '2', slug: 'investissement-cocody-abidjan-2026',
    title: 'Investir à Cocody Abidjan : analyse complète du marché 2026',
    excerpt: 'Après 3 mois d\'études et 15 visites, voici mon analyse détaillée du marché immobilier de Cocody. Les prix ont évolué de +12% sur 12 mois…',
    category: 'Analyse de marché', author: { name: 'Kwame A.', avatar: 'KA', city: 'Abidjan' },
    likes: 156, views: 2187, replies: 43, isPinned: false, isTrending: true,
    createdAt: '2026-04-12', tags: ['Abidjan', 'Cocody', 'Investissement', 'Analyse'],
  },
  {
    id: '3', slug: 'titre-foncier-burkina-faso-guide',
    title: 'Guide complet : obtenir son titre foncier au Burkina Faso',
    excerpt: 'La procédure d\'obtention du titre foncier au Burkina est complexe mais pas impossible. Voici le parcours étape par étape avec les délais réels…',
    category: 'Juridique', author: { name: 'Aminata S.', avatar: 'AS', city: 'Ouagadougou' },
    likes: 198, views: 1890, replies: 38, isPinned: false, isTrending: false,
    createdAt: '2026-04-08', tags: ['Titre foncier', 'Burkina', 'Juridique', 'Guide'],
  },
  {
    id: '4', slug: 'negociation-prix-propriete-conseils',
    title: 'Mes 5 techniques de négociation qui m\'ont économisé 8 millions FCFA',
    excerpt: 'Acheteur depuis 4 ans en Afrique de l\'Ouest, j\'ai testé de nombreuses stratégies de négociation. Voici celles qui fonctionnent vraiment…',
    category: 'Conseils', author: { name: 'Moussa D.', avatar: 'MD', city: 'Lomé' },
    likes: 312, views: 4102, replies: 89, isPinned: false, isTrending: true,
    createdAt: '2026-04-05', tags: ['Négociation', 'Conseils', 'Achat'],
  },
  {
    id: '5', slug: 'financement-islamique-immobilier',
    title: 'Financement islamique pour l\'immobilier : les options en Afrique de l\'Ouest',
    excerpt: 'La finance islamique offre des alternatives halal au crédit immobilier classique. Tour d\'horizon des produits disponibles dans nos pays…',
    category: 'Financement', author: { name: 'Ibrahim T.', avatar: 'IT', city: 'Abidjan' },
    likes: 143, views: 1567, replies: 52, isPinned: false, isTrending: false,
    createdAt: '2026-04-01', tags: ['Finance islamique', 'Financement', 'Halal'],
  },
];

const GROUPS: Group[] = [
  { id: '1', name: 'Investisseurs Bénin', description: 'Réseau des investisseurs immobiliers au Bénin', memberCount: 847, category: 'Pays', emoji: '🇧🇯' },
  { id: '2', name: 'Primo-accédants Abidjan', description: 'Pour ceux qui achètent leur premier bien à Abidjan', memberCount: 1243, category: 'Thématique', emoji: '🏠' },
  { id: '3', name: 'Diaspora & Immobilier Afrique', description: 'Investir depuis l\'étranger dans l\'immobilier africain', memberCount: 2156, category: 'Diaspora', emoji: '✈️' },
  { id: '4', name: 'Promoteurs & Constructeurs', description: 'Communauté des professionnels de la construction', memberCount: 312, category: 'Pro', emoji: '🏗️' },
];

const CATEGORIES_POST = ['Toutes', 'Conseils', 'Analyse de marché', 'Juridique', 'Financement', 'Témoignages'];

function PostCard({ post }: { post: Post }): React.ReactElement {
  return (
    <article className="bg-white rounded-xl border border-charcoal-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="sky" className="text-xs">{post.category}</Badge>
            {post.isPinned && (
              <span className="flex items-center gap-0.5 text-xs text-charcoal-400 font-medium">
                <Pin className="h-3 w-3" aria-hidden="true" /> Épinglé
              </span>
            )}
            {post.isTrending && (
              <span className="flex items-center gap-0.5 text-xs text-emerald-700 font-medium">
                <TrendingUp className="h-3 w-3" aria-hidden="true" /> Tendance
              </span>
            )}
          </div>

          <Link href={`/communaute/${post.slug}`} className="block group">
            <h3 className="font-semibold text-charcoal leading-snug group-hover:text-navy transition-colors mb-1.5">
              {post.title}
            </h3>
          </Link>

          <p className="text-sm text-charcoal-400 line-clamp-2 mb-3">{post.excerpt}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-charcoal-400 hover:text-navy cursor-pointer">#{tag}</span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-charcoal-400">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-white text-[10px] font-semibold" aria-hidden="true">
                {post.author.avatar}
              </div>
              <span className="font-medium text-charcoal">{post.author.name}</span>
              <span>· {post.author.city}</span>
              <span>· {new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" aria-hidden="true" />{post.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" aria-hidden="true" />{post.replies}</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" aria-hidden="true" />{post.views.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function CommunautePage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-charcoal-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gold/80 to-navy py-16 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm font-medium text-gold uppercase tracking-widest mb-3">Communauté</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            L'intelligence collective de l'immobilier africain
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Partagez, apprenez et connectez-vous avec des milliers d'investisseurs, agents et propriétaires.
          </p>
          <Button variant="gold" size="lg" className="gap-2">
            <Plus className="h-4 w-4" aria-hidden="true" /> Créer un post
          </Button>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main feed */}
          <main className="flex-1 min-w-0">
            {/* Filter tabs */}
            <div className="flex gap-1 border-b border-charcoal-100 mb-6 overflow-x-auto">
              {CATEGORIES_POST.map((cat) => (
                <button key={cat}
                  className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${cat === 'Toutes' ? 'border-navy text-navy' : 'border-transparent text-charcoal-400 hover:text-charcoal'}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-4">
              {POSTS.map((post) => <PostCard key={post.id} post={post} />)}
            </div>

            <div className="mt-6 text-center">
              <Button variant="ghost">Charger plus de posts</Button>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 flex flex-col gap-6">
            {/* Stats */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-5">
              <h2 className="font-semibold text-charcoal mb-4">La communauté en chiffres</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: '12 500', label: 'Membres' },
                  { value: '3 400', label: 'Posts' },
                  { value: '28 000', label: 'Commentaires' },
                  { value: '4', label: 'Pays' },
                ].map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="font-mono font-bold text-xl text-navy">{value}</p>
                    <p className="text-xs text-charcoal-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Groups */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-charcoal">Groupes actifs</h2>
                <Link href="/communaute/groupes" className="text-xs text-navy hover:underline">Voir tous</Link>
              </div>
              <div className="flex flex-col gap-3">
                {GROUPS.map((group) => (
                  <div key={group.id} className="flex items-center gap-3 cursor-pointer hover:bg-charcoal-50 rounded-lg p-2 -mx-2 transition-colors">
                    <div className="text-2xl" aria-hidden="true">{group.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal text-sm leading-tight">{group.name}</p>
                      <p className="text-xs text-charcoal-400 flex items-center gap-1 mt-0.5">
                        <Users className="h-3 w-3" aria-hidden="true" /> {group.memberCount.toLocaleString()} membres
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="text-xs flex-shrink-0">Rejoindre</Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending tags */}
            <div className="bg-white rounded-xl border border-charcoal-100 p-5">
              <h2 className="font-semibold text-charcoal mb-4">Tags tendance</h2>
              <div className="flex flex-wrap gap-2">
                {['#Investissement', '#Cotonou', '#Abidjan', '#TitreFoncier', '#Financement', '#Escrow', '#FCFA', '#Diaspora', '#Rénovation'].map((tag) => (
                  <span key={tag} className="text-sm text-navy hover:underline cursor-pointer">{tag}</span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
