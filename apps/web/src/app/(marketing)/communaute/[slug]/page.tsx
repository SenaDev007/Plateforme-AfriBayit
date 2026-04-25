'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { notFound, useParams } from 'next/navigation';
import { ChevronLeft, MessageSquare, ThumbsUp, Eye, Share2, Loader2 } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { api } from '@/lib/api';

interface Author {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
  city: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Pick<Author, 'id' | 'firstName' | 'lastName' | 'avatar'>;
}

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
  author: Author;
  comments: Comment[];
  _count: { likes: number; comments: number };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 30) return new Date(dateStr).toLocaleDateString('fr-FR');
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `Il y a ${hours}h`;
  return "À l'instant";
}

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

export default function CommunautePostPage(): React.ReactElement {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: session } = useSession();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/api/v1/community/posts/${slug}`)
      .then((r) => r.json())
      .then((data: Post) => {
        setPost(data);
        setLikeCount(data._count.likes);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (!session?.accessToken || !post) return;
    const token = session.accessToken as string;
    const prev = liked;
    setLiked(!prev);
    setLikeCount((c) => c + (prev ? -1 : 1));
    try {
      await api.community.toggleLike(post.id, token);
    } catch {
      setLiked(prev);
      setLikeCount((c) => c + (prev ? 1 : -1));
    }
  };

  const handleComment = async () => {
    if (!session?.accessToken || !post || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.community.addComment(
        post.id,
        comment.trim(),
        session.accessToken as string,
      );
      const newComment = res.data as Comment;
      setPost((p) => (p ? { ...p, comments: [...p.comments, newComment] } : p));
      setComment('');
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-navy h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) notFound();

  return (
    <div className="bg-sand-50 min-h-screen">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/communaute"
          className="text-charcoal-400 hover:text-charcoal mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Communauté
        </Link>

        <article className="border-charcoal-100 rounded-xl border bg-white p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            {post.category && <Badge variant="outline">{post.category}</Badge>}
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5 text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-charcoal mb-4 font-serif text-2xl font-bold leading-tight sm:text-3xl">
            {post.title}
          </h1>

          <div className="border-charcoal-100 mb-6 flex items-center gap-4 border-b pb-6">
            <div className="bg-navy/10 text-navy flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {post.author.firstName[0]}
              {post.author.lastName[0]}
            </div>
            <div>
              <p className="text-charcoal text-sm font-medium">
                {post.author.firstName} {post.author.lastName}
              </p>
              <p className="text-charcoal-400 text-xs">
                {post.author.city && `${post.author.city} · `}
                {timeAgo(post.createdAt)}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {post.views.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {post._count.comments}
              </span>
            </div>
          </div>

          <div className="text-charcoal max-w-none whitespace-pre-line text-sm leading-relaxed sm:text-base">
            {post.content}
          </div>

          <div className="border-charcoal-100 mt-8 flex items-center gap-3 border-t pt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleLike()}
              className={liked ? 'border-navy text-navy' : ''}
            >
              <ThumbsUp className="mr-1.5 h-4 w-4" />
              {likeCount} J&apos;aime
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void navigator.clipboard?.writeText(window.location.href);
              }}
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              Partager
            </Button>
          </div>
        </article>

        <section className="mt-8">
          <h2 className="text-charcoal mb-4 font-semibold">{post._count.comments} commentaires</h2>

          <div className="mb-6 space-y-4">
            {post.comments.map((c) => (
              <div key={c.id} className="border-charcoal-100 rounded-xl border bg-white p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-gold/20 text-gold-600 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                    {c.author.firstName[0]}
                    {c.author.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-charcoal text-sm font-medium">
                        {c.author.firstName} {c.author.lastName}
                      </span>
                      <span className="text-charcoal-400 text-xs">{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-charcoal text-sm">{c.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {session ? (
            <div className="border-charcoal-100 rounded-xl border bg-white p-4">
              <p className="text-charcoal mb-3 text-sm font-medium">Ajouter un commentaire</p>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre expérience ou posez une question…"
                rows={3}
                className="border-charcoal-200 focus:ring-navy/30 w-full resize-none rounded-lg border px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
              />
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  onClick={() => void handleComment()}
                  disabled={submitting || !comment.trim()}
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publier'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-navy/10 bg-navy/5 rounded-xl border p-4 text-center">
              <p className="text-charcoal-400 mb-2 text-sm">
                <Link href="/connexion" className="text-navy hover:underline">
                  Connectez-vous
                </Link>{' '}
                pour commenter.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
