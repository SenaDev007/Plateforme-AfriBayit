'use client';

import type React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button, Input } from '@afribayit/ui';
import { api } from '@/lib/api';

const CATEGORIES = ['Immobilier', 'Investissement', 'Travaux', 'Hôtellerie', 'Général'];

export default function NouveauPostPage(): React.ReactElement {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'unauthenticated') {
    router.push('/connexion');
    return <></>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Le titre et le contenu sont obligatoires.');
      return;
    }
    if (!session?.accessToken) return;

    setSubmitting(true);
    setError('');
    try {
      const tags = form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      await api.community.createPost(
        {
          title: form.title.trim(),
          content: form.content.trim(),
          category: form.category || 'Général',
          tags,
        },
        session.accessToken as string,
      );
      router.push('/communaute' as Route);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la publication.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-navy py-10">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="/communaute"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            Communauté
          </Link>
          <h1 className="font-serif text-2xl font-bold text-white">Nouveau post</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-5">
          <div className="rounded-xl border border-gray-100 bg-white p-6">
            <div className="flex flex-col gap-4">
              <Input
                label="Titre"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Quel est le sujet de votre post ?"
                required
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Catégorie</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, category: cat }))}
                      className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                        form.category === cat
                          ? 'bg-navy text-white'
                          : 'hover:border-navy/40 border border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Contenu</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                  placeholder="Partagez votre question, expérience ou conseil avec la communauté…"
                  rows={8}
                  required
                  className="focus:ring-navy/30 w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
                />
              </div>

              <Input
                label="Tags (séparés par des virgules)"
                value={form.tags}
                onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                placeholder="Cotonou, investissement, terrain…"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between">
            <Link
              href="/communaute"
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              Annuler
            </Link>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publication…
                </>
              ) : (
                'Publier le post'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
