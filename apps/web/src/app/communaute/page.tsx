'use client';

import React, { useState, useEffect } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { api } from '@/lib/api';

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  views: number;
  isPinned: boolean;
  createdAt: string;
  author: { firstName: string; lastName: string; avatar: string | null; city: string | null };
  _count: { likes: number; comments: number };
}

const CATEGORIES = ['Tout', 'Immobilier', 'Investissement', 'Travaux', 'Hôtellerie', 'Général'];

export default function CommunityPage(): React.ReactElement {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20' });
    if (category) params.set('category', category);

    fetch(
      `${process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000'}/api/v1/community/posts?${params.toString()}`,
    )
      .then((r) => r.json())
      .then((data: { data: Post[]; total: number }) => {
        setPosts(data.data ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-navy py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-2 font-serif text-3xl font-bold text-white">Communauté AfriBayit</h1>
          <p className="text-white/70">
            Échangez avec des investisseurs, acheteurs et experts de l&apos;immobilier africain.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main content */}
          <div className="flex-1">
            {/* Category filter */}
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat === 'Tout' ? '' : cat);
                    setPage(1);
                  }}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    (cat === 'Tout' && !category) || category === cat
                      ? 'bg-navy text-white'
                      : 'hover:border-navy/40 border border-gray-200 bg-white text-gray-600'
                  }`}
                >
                  {cat}
                </button>
              ))}

              {session && (
                <Link
                  href="/communaute/nouveau"
                  className="bg-gold text-navy hover:bg-gold/90 ml-auto rounded-full px-4 py-1.5 text-sm font-medium transition-colors"
                >
                  + Nouveau post
                </Link>
              )}
            </div>

            {/* Posts list */}
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl bg-white p-5">
                    <div className="mb-3 h-5 w-3/4 rounded bg-gray-200" />
                    <div className="mb-2 h-3 w-full rounded bg-gray-100" />
                    <div className="h-3 w-2/3 rounded bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-xl bg-white p-12 text-center">
                <p className="text-gray-500">
                  Aucun post pour le moment. Soyez le premier à publier !
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/communaute/${post.slug}`}
                    className="hover:border-navy/30 block rounded-xl border border-gray-100 bg-white p-5 transition-all hover:shadow-sm"
                  >
                    {post.isPinned && (
                      <span className="text-gold bg-gold/10 mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium">
                        📌 Épinglé
                      </span>
                    )}
                    <h2 className="mb-1 line-clamp-2 font-semibold text-gray-900">{post.title}</h2>
                    <p className="mb-3 line-clamp-2 text-sm text-gray-500">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>
                        {post.author.firstName} {post.author.lastName}
                        {post.author.city && ` · ${post.author.city}`}
                      </span>
                      {post.category && (
                        <span className="bg-sky/10 rounded-full px-2 py-0.5 text-sky-700">
                          {post.category}
                        </span>
                      )}
                      <span className="ml-auto flex items-center gap-3">
                        <span>❤️ {post._count.likes}</span>
                        <span>💬 {post._count.comments}</span>
                        <span>👁️ {post.views}</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Précédent
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {page} / {Math.ceil(total / 20)}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / 20)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4 lg:w-72">
            <div className="rounded-xl border border-gray-100 bg-white p-5">
              <h3 className="mb-3 font-semibold text-gray-900">Groupes populaires</h3>
              <Link href="/communaute/groupes" className="text-navy block text-sm hover:underline">
                Voir tous les groupes →
              </Link>
            </div>

            {!session && (
              <div className="bg-navy/5 border-navy/10 rounded-xl border p-5">
                <h3 className="mb-2 font-semibold text-gray-900">Rejoignez la communauté</h3>
                <p className="mb-3 text-sm text-gray-600">
                  Connectez-vous pour publier, commenter et échanger.
                </p>
                <Link
                  href="/connexion"
                  className="bg-navy hover:bg-navy/90 block w-full rounded-lg py-2 text-center text-sm font-medium text-white"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
