import type React from 'react';
import type { Metadata } from 'next';
import type { Route } from 'next';
import Link from 'next/link';
import {
  MessageSquare,
  Users,
  TrendingUp,
  Pin,
  ThumbsUp,
  Eye,
  Plus,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { cn } from '@afribayit/ui/src/lib/cn';

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

function PostCard({ post }: { post: ApiPost }): React.ReactElement {
  return (
    <article className="border-charcoal-100 hover:border-navy/10 group relative overflow-hidden rounded-[32px] border bg-white p-6 transition-all duration-500 hover:shadow-2xl md:p-8">
      {post.isPinned && (
        <div className="absolute right-0 top-0">
          <div className="bg-gold text-navy flex items-center gap-1.5 rounded-bl-2xl px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest">
            <Pin className="h-3 w-3" /> ÉPINGLÉ
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          {post.category && (
            <Badge
              variant="sky"
              className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider"
            >
              {post.category}
            </Badge>
          )}
          <span className="text-charcoal-400 text-[11px] font-medium">
            {new Date(post.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <Link href={`/communaute/${post.slug}` as Route} className="group block">
          <h3 className="text-charcoal group-hover:text-navy decoration-navy/0 group-hover:decoration-navy/30 font-serif text-2xl font-bold leading-tight underline underline-offset-4 transition-colors">
            {post.title}
          </h3>
        </Link>

        <p className="text-charcoal-500 line-clamp-2 text-sm font-light leading-relaxed md:text-base">
          {post.content.replace(/\n+/g, ' ').trim()}
        </p>

        <div className="border-charcoal-50 flex items-center justify-between border-t pt-6">
          <div className="flex items-center gap-3">
            <div className="bg-navy shadow-navy/10 flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg">
              {post.author.firstName[0]}
              {post.author.lastName[0]}
            </div>
            <div>
              <p className="text-charcoal text-sm font-bold">
                {post.author.firstName} {post.author.lastName}
              </p>
              <p className="text-charcoal-400 text-[11px] font-medium">
                {post.author.city || 'Afrique'}
              </p>
            </div>
          </div>

          <div className="text-charcoal-400 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="h-4 w-4" />
              <span className="text-xs font-bold">{post._count.likes}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs font-bold">{post._count.comments}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              <span className="text-xs font-bold">{post.views.toLocaleString()}</span>
            </div>
          </div>
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
    <div className="min-h-screen bg-[#FDFDFD]">
      <header className="bg-navy relative overflow-hidden pb-20 pt-32">
        {/* Background Pattern */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-6 text-center">
            <Badge
              variant="gold"
              className="px-6 py-2 text-[10px] font-bold uppercase tracking-[0.25em]"
            >
              L'Intelligence Collective
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-[1.1] text-white md:text-7xl">
              Bâtissons ensemble <br />
              <span className="text-gold italic">l'immobilier de demain</span>
            </h1>
            <p className="max-w-2xl text-lg font-light text-white/60 md:text-xl">
              Rejoignez 15,000+ membres pour échanger conseils, opportunités et actualités sur le
              marché immobilier africain.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link href={'/communaute/nouveau' as Route}>
                <Button
                  variant="gold"
                  size="lg"
                  className="shadow-gold/20 flex h-14 items-center gap-2 rounded-full px-10 text-base font-bold shadow-xl"
                >
                  <Plus className="h-5 w-5" />
                  CRÉER UNE DISCUSSION
                </Button>
              </Link>
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="border-navy bg-charcoal-200 h-14 w-14 rounded-full border-4"
                  />
                ))}
                <div className="border-navy bg-gold flex h-14 w-14 items-center justify-center rounded-full border-4 text-xs font-bold">
                  +15k
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row">
          {/* Main feed */}
          <main className="min-w-0 flex-1 space-y-10">
            {/* Category filter */}
            <div className="border-charcoal-100 no-scrollbar flex items-center justify-between gap-6 overflow-x-auto border-b pb-4">
              <div className="flex gap-2">
                {CATEGORIES.map((cat) => {
                  const isActive = cat === 'Toutes' ? !activeCategory : activeCategory === cat;
                  const href =
                    cat === 'Toutes' ? '/communaute' : `/communaute?cat=${encodeURIComponent(cat)}`;
                  return (
                    <Link
                      key={cat}
                      href={href as Route}
                      className={cn(
                        'whitespace-nowrap rounded-full px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300',
                        isActive
                          ? 'bg-navy shadow-navy/20 text-white shadow-lg'
                          : 'text-charcoal-400 hover:bg-charcoal-50',
                      )}
                    >
                      {cat}
                    </Link>
                  );
                })}
              </div>
            </div>

            {posts.length > 0 ? (
              <div className="flex flex-col gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <div className="bg-charcoal-50 border-charcoal-200 space-y-6 rounded-[48px] border-2 border-dashed py-32 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-xl">
                  <MessageSquare className="text-charcoal-200 h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-charcoal font-serif text-2xl font-bold">
                    Silence à l'horizon
                  </h3>
                  <p className="text-charcoal-400 mx-auto mt-2 max-w-xs text-sm">
                    Soyez le premier à lancer la discussion dans cette catégorie.
                  </p>
                </div>
                <Button className="rounded-full px-8">CRÉER LE PREMIER POST</Button>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="flex-shrink-0 space-y-10 lg:w-80">
            {/* Groups Card */}
            <div className="border-charcoal-100 rounded-[32px] border bg-white p-8 shadow-sm">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-charcoal font-serif text-xl font-bold">Cercle d'experts</h2>
                <Link
                  href={'/communaute/groupes' as Route}
                  className="text-navy hover:text-gold text-[10px] font-bold uppercase tracking-widest transition-colors"
                >
                  VOIR TOUS
                </Link>
              </div>
              <div className="space-y-6">
                {groups.slice(0, 4).map((group) => (
                  <div key={group.id} className="group flex cursor-pointer items-center gap-4">
                    <div className="bg-charcoal-50 text-navy group-hover:bg-navy flex h-12 w-12 items-center justify-center rounded-2xl font-bold transition-all group-hover:rotate-6 group-hover:text-white">
                      {group.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-charcoal group-hover:text-navy truncate text-sm font-bold leading-tight transition-colors">
                        {group.name}
                      </p>
                      <p className="text-charcoal-400 mt-1 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
                        <Users className="h-3 w-3" />
                        {group._count.members.toLocaleString()} MEMBRES
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-10 h-12 w-full rounded-full text-xs font-bold"
              >
                REJOINDRE UN GROUPE
              </Button>
            </div>

            {/* Tags Card */}
            <div className="bg-navy rounded-[32px] p-8 text-white">
              <h2 className="mb-6 font-serif text-xl font-bold">Tendances</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Investissement',
                  'Cotonou',
                  'Droit Foncier',
                  'Financement',
                  'Escrow',
                  'Diaspora',
                ].map((tag) => (
                  <span
                    key={tag}
                    className="cursor-pointer rounded-full border border-white/5 bg-white/10 px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-white/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Newsletter card */}
            <div className="bg-gold/10 border-gold/20 space-y-4 rounded-[32px] border p-8">
              <TrendingUp className="text-gold h-8 w-8" />
              <h3 className="text-charcoal font-serif text-xl font-bold">Veille Immobilière</h3>
              <p className="text-charcoal-600 text-xs font-medium leading-relaxed">
                Recevez chaque semaine une synthèse des discussions et opportunités du marché.
              </p>
              <div className="pt-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="focus:ring-gold mb-3 h-12 w-full rounded-xl border-none bg-white px-4 text-xs font-medium focus:ring-2"
                />
                <Button
                  variant="gold"
                  className="h-12 w-full rounded-xl text-xs font-bold uppercase tracking-widest"
                >
                  S'ABONNER
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
