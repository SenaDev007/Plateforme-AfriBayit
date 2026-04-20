import type React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft, MessageSquare, ThumbsUp, Eye, Share2 } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Discussion — Communauté AfriBayit',
  description: 'Participez à la discussion sur la communauté immobilière AfriBayit.',
};

const MOCK_POST = {
  slug: 'eviter-arnaques-immobilieres-cotonou',
  title: 'Comment éviter les arnaques immobilières à Cotonou en 2026',
  category: 'Conseils',
  author: { name: 'Ayodélé K.', avatar: 'AK', city: 'Cotonou' },
  createdAt: '2026-04-15',
  likes: 284,
  views: 3421,
  replies: 67,
  tags: ['Arnaques', 'Sécurité', 'Cotonou', 'Acheteur'],
  content: `
Après avoir failli me faire escroquer lors de l'achat d'un terrain à Calavi, j'ai décidé de partager mon expérience pour que vous ne fassiez pas les mêmes erreurs.

**Les 7 signaux d'alarme à surveiller :**

1. **Prix trop attractif** — Si c'est trop beau pour être vrai, c'est que ça l'est probablement.
2. **Vendeur pressé** — Un vendeur qui vous pousse à signer rapidement cache souvent quelque chose.
3. **Titre foncier non vérifiable** — Exigez toujours de voir l'original et faites vérifier par un notaire.
4. **Absence de plan cadastral** — Sans plan officiel, impossible de connaître les limites réelles du terrain.
5. **Intermédiaire inconnu** — Passez par des agences reconnues ou utilisez AfriBayit pour la sécurité.
6. **Paiement en dehors des canaux officiels** — Utilisez uniquement l'escrow AfriBayit pour vos transactions.
7. **Refus de visite sur site** — Si le vendeur refuse que vous visitiez, fuyez.

**Mon histoire :**

En janvier 2026, j'ai répondu à une annonce pour un terrain de 500m² à Calavi pour 8 millions XOF, soit 40% en dessous du prix du marché...
  `.trim(),
};

const MOCK_COMMENTS = [
  {
    id: '1',
    author: { name: 'Serge T.', avatar: 'ST', city: 'Lomé' },
    content: "Merci pour ce partage ! J'ai vécu exactement la même chose à Lomé l'année dernière.",
    likes: 42,
    createdAt: '2026-04-16',
  },
  {
    id: '2',
    author: { name: 'Fatou D.', avatar: 'FD', city: 'Abidjan' },
    content: "Le point sur l'escrow AfriBayit est crucial. J'ai utilisé ce service pour mon dernier achat et ça m'a sauvé.",
    likes: 31,
    createdAt: '2026-04-17',
  },
];

export default async function CommunautePostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<React.ReactElement> {
  await params;
  const post = MOCK_POST;

  return (
    <div className="min-h-screen bg-sand-50">
      <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/communaute"
          className="inline-flex items-center gap-1.5 text-sm text-charcoal-400 hover:text-charcoal transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Communauté
        </Link>

        <article className="bg-white rounded-xl border border-charcoal-100 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{post.category}</Badge>
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-charcoal-400 bg-charcoal-50 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 pb-6 mb-6 border-b border-charcoal-100">
            <div className="h-10 w-10 rounded-full bg-navy/10 flex items-center justify-center text-sm font-bold text-navy flex-shrink-0">
              {post.author.avatar}
            </div>
            <div>
              <p className="text-sm font-medium text-charcoal">{post.author.name}</p>
              <p className="text-xs text-charcoal-400">{post.author.city} · {post.createdAt}</p>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs text-charcoal-400">
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.views.toLocaleString()}</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{post.replies}</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-charcoal leading-relaxed whitespace-pre-line">
            {post.content}
          </div>

          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-charcoal-100">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-1.5" />
              {post.likes} J'aime
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1.5" />
              Partager
            </Button>
          </div>
        </article>

        <section className="mt-8">
          <h2 className="font-semibold text-charcoal mb-4">{post.replies} commentaires</h2>

          <div className="space-y-4 mb-6">
            {MOCK_COMMENTS.map((comment) => (
              <div key={comment.id} className="bg-white rounded-xl border border-charcoal-100 p-4">
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-gold/20 flex items-center justify-center text-xs font-bold text-gold-600 flex-shrink-0">
                    {comment.author.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-charcoal">{comment.author.name}</span>
                      <span className="text-xs text-charcoal-400">{comment.author.city} · {comment.createdAt}</span>
                    </div>
                    <p className="text-sm text-charcoal">{comment.content}</p>
                    <button className="mt-2 flex items-center gap-1 text-xs text-charcoal-400 hover:text-navy transition-colors">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {comment.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-charcoal-100 p-4">
            <p className="text-sm font-medium text-charcoal mb-3">Ajouter un commentaire</p>
            <textarea
              placeholder="Partagez votre expérience ou posez une question…"
              rows={3}
              className="w-full text-sm border border-charcoal-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-navy/30 resize-none"
            />
            <div className="flex justify-end mt-3">
              <Button size="sm">Publier</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
