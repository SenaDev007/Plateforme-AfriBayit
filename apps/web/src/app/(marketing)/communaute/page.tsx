import type React from 'react';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import { MessageSquare, Users, TrendingUp, Pin, ThumbsUp, Eye, Plus } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';

export const metadata: Metadata = {
  title: 'Communauté AfriBayit',
  description:
    "Échangez avec la communauté immobilière d'Afrique de l'Ouest — conseils, opportunités, actualités.",
};

interface ApiPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  views: number;
  isPinned: boolean;
  createdAt: string;
  author: { id: string; firstName: string; lastName: string; city?: string | null };
  _count: { likes: number; comments: number };
}

interface ApiGroup {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  _count: { members: number };
}

const CATEGORIES = [
  'Toutes',
  'Conseils',
  'Analyse de marché',
  'Juridique',
  'Financement',
  'Témoignages',
];

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

async function fetchPosts(category?: string): Promise<{ data: ApiPost[]; total: number }> {
  try {
    const params = new URLSearchParams({ limit: '10' });
    if (category) params.set('category', category);
    const res = await fetch(`${API_URL}/api/v1/community/posts?${params.toString()}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { data: [], total: 0 };
    return (await res.json()) as { data: ApiPost[]; total: number };
  } catch {
    return { data: [], total: 0 };
  }
}

async function fetchGroups(): Promise<ApiGroup[]> {
  try {
    const res = await fetch(`${API_URL}/api/v1/community/groups`, {
      next: { revalidate: 120 },
    });
    if (!res.ok) return [];
    return (await res.json()) as ApiGroup[];
  } catch {
    return [];
  }
}

function getExcerpt(content: string): string {
  const plain = content.replace(/\n+/g, ' ').trim();
  return plain.length > 160 ? `${plain.slice(0, 160)}…` : plain;
}

function PostCard({ post }: { post: ApiPost }): React.ReactElement {
  return (
    <article className="border-charcoal-100 rounded-xl border bg-white p-5 transition-shadow hover:shadow-md">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        {post.category && (
          <Badge variant="sky" className="text-xs">
            {post.category}
          </Badge>
        )}
        {post.isPinned && (
          <span className="text-charcoal-400 flex items-center gap-0.5 text-xs font-medium">
            <Pin className="h-3 w-3" aria-hidden="true" /> Épinglé
          </span>
        )}
      </div>

      <Link href={`/communaute/${post.slug}` as Route} className="group block">
        <h3 className="text-charcoal group-hover:text-navy mb-1.5 font-semibold leading-snug transition-colors">
          {post.title}
        </h3>
      </Link>

      <p className="text-charcoal-400 mb-3 line-clamp-2 text-sm">{getExcerpt(post.content)}</p>

      {post.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-charcoal-400 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="text-charcoal-400 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div
            className="bg-navy flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold text-white"
            aria-hidden="true"
          >
            {post.author.firstName[0]}
            {post.author.lastName[0]}
          </div>
          <span className="text-charcoal font-medium">
            {post.author.firstName} {post.author.lastName}
          </span>
          {post.author.city && <span>· {post.author.city}</span>}
          <span>· {new Date(post.createdAt).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" aria-hidden="true" />
            {post._count.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" aria-hidden="true" />
            {post._count.comments}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {post.views.toLocaleString()}
          </span>
        </div>
      </div>
    </article>
  );
}

interface Props {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function CommunautePage({ searchParams }: Props): Promise<React.ReactElement> {
  const sp = await searchParams;
  const activeCategory = sp['cat'];

  const [{ data: posts, total }, groups] = await Promise.all([
    fetchPosts(activeCategory),
    fetchGroups(),
  ]);

  return (
    <div className="bg-charcoal-50 min-h-screen">
      {/* Hero */}
      <section className="from-gold/80 to-navy bg-gradient-to-br px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-gold mb-3 text-sm font-medium uppercase tracking-widest">Communauté</p>
          <h1 className="mb-4 font-serif text-3xl font-bold text-white sm:text-5xl">
            L&apos;intelligence collective de l&apos;immobilier africain
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/70">
            Partagez, apprenez et connectez-vous avec des milliers d&apos;investisseurs, agents et
            propriétaires.
          </p>
          <Link href={'/communaute/nouveau' as Route}>
            <Button variant="gold" size="lg" className="gap-2">
              <Plus className="h-4 w-4" aria-hidden="true" /> Créer un post
            </Button>
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Main feed */}
          <main className="min-w-0 flex-1">
            {/* Category filter — URL-driven links */}
            <div className="border-charcoal-100 mb-6 flex gap-1 overflow-x-auto border-b">
              {CATEGORIES.map((cat) => {
                const isActive = cat === 'Toutes' ? !activeCategory : activeCategory === cat;
                const href =
                  cat === 'Toutes' ? '/communaute' : `/communaute?cat=${encodeURIComponent(cat)}`;
                return (
                  <Link
                    key={cat}
                    href={href as Route}
                    className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-navy text-navy'
                        : 'text-charcoal-400 hover:text-charcoal border-transparent'
                    }`}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>

            {posts.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                {total > posts.length && (
                  <div className="mt-6 text-center">
                    <p className="text-charcoal-400 text-sm">
                      {posts.length} / {total} posts affichés
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <MessageSquare className="text-charcoal-200 h-12 w-12" aria-hidden="true" />
                <p className="text-charcoal text-lg font-semibold">Aucun post pour le moment</p>
                <p className="text-charcoal-400 text-sm">
                  Soyez le premier à partager votre expérience.
                </p>
                <Link href={'/communaute/nouveau' as Route}>
                  <Button className="mt-2 gap-2">
                    <Plus className="h-4 w-4" aria-hidden="true" /> Créer un post
                  </Button>
                </Link>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="flex flex-shrink-0 flex-col gap-6 lg:w-80">
            {/* Groups */}
            {groups.length > 0 && (
              <div className="border-charcoal-100 rounded-xl border bg-white p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-charcoal font-semibold">Groupes actifs</h2>
                  <Link
                    href={'/communaute/groupes' as Route}
                    className="text-navy text-xs hover:underline"
                  >
                    Voir tous
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {groups.slice(0, 4).map((group) => (
                    <div
                      key={group.id}
                      className="hover:bg-charcoal-50 -mx-2 flex items-center gap-3 rounded-lg p-2 transition-colors"
                    >
                      <div className="bg-navy/10 text-navy flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {group.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-charcoal truncate text-sm font-medium leading-tight">
                          {group.name}
                        </p>
                        <p className="text-charcoal-400 mt-0.5 flex items-center gap-1 text-xs">
                          <Users className="h-3 w-3" aria-hidden="true" />
                          {group._count.members.toLocaleString('fr-FR')} membres
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <Link href={'/communaute/groupes' as Route} className="mt-3 block">
                  <Button variant="outline" size="sm" className="w-full">
                    Voir tous les groupes
                  </Button>
                </Link>
              </div>
            )}

            {/* Trending tags */}
            <div className="border-charcoal-100 rounded-xl border bg-white p-5">
              <h2 className="text-charcoal mb-4 font-semibold">Tags tendance</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  '#Investissement',
                  '#Cotonou',
                  '#Abidjan',
                  '#TitreFoncier',
                  '#Financement',
                  '#Escrow',
                  '#FCFA',
                  '#Diaspora',
                  '#Rénovation',
                ].map((tag) => (
                  <span key={tag} className="text-navy cursor-pointer text-sm hover:underline">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
