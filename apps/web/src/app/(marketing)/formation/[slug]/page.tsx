'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  ChevronLeft,
  Play,
  BookOpen,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle2,
  Lock,
  Loader2,
} from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { api } from '@/lib/api';

const API_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000';

interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  isFree: boolean;
  order: number;
}

interface ApiCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string | null;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number | null;
  price: string | null;
  currency: string;
  isFree: boolean;
  isFeatured: boolean;
  thumbnailUrl: string | null;
  tags: string[];
  rating: number;
  reviewCount: number;
  enrolledCount: number;
  lessons: Lesson[];
  instructor: {
    firstName: string;
    lastName: string;
    avatar: string | null;
    bio: string | null;
  } | null;
}

const LEVEL_CONFIG = {
  BEGINNER: { label: 'Débutant', variant: 'success' as const },
  INTERMEDIATE: { label: 'Intermédiaire', variant: 'sky' as const },
  ADVANCED: { label: 'Avancé', variant: 'gold' as const },
};

function formatDuration(minutes: number | null): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m > 0 ? String(m).padStart(2, '0') : ''}` : `${m} min`;
}

const MOCK_INSTRUCTOR = {
  name: 'AfriBayit Expert',
  title: 'Expert immobilier',
  avatar: 'AB',
  bio: "Expert en immobilier africain avec plus de 10 ans d'expérience sur les marchés d'Afrique de l'Ouest.",
};

export default function FormationDetailPage(): React.ReactElement {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;

  const [course, setCourse] = useState<ApiCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API_URL}/api/v1/courses/${slug}`)
      .then((r) => r.json())
      .then((data: ApiCourse) => setCourse(data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleEnroll = async () => {
    if (!token || !course) return;
    setEnrolling(true);
    try {
      await api.courses.enroll(course.id, token);
      setEnrolled(true);
    } catch {
      // silent
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-navy h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!course) notFound();

  const level = LEVEL_CONFIG[course.level];
  const instructor = course.instructor
    ? {
        name: `${course.instructor.firstName} ${course.instructor.lastName}`,
        title: 'Formateur AfriBayit',
        avatar: `${course.instructor.firstName[0]}${course.instructor.lastName[0]}`,
        bio: course.instructor.bio ?? '',
      }
    : MOCK_INSTRUCTOR;
  const priceNum = course.price ? parseFloat(course.price) : 0;

  return (
    <div className="bg-charcoal-50 min-h-screen">
      {/* Hero */}
      <section className="from-navy to-navy/80 bg-gradient-to-br px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/formation"
            className="mb-6 flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Retour aux formations
          </Link>
          <div className="grid items-start gap-8 lg:grid-cols-3">
            <div className="flex flex-col gap-4 lg:col-span-2">
              <div className="flex flex-wrap gap-2">
                <Badge variant={level.variant}>{level.label}</Badge>
                {course.category && <Badge variant="sky">{course.category}</Badge>}
                {course.isFree && <Badge variant="success">Gratuit</Badge>}
              </div>
              <h1 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                {course.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-white/70">
                <span className="flex items-center gap-1.5">
                  <Star className="text-gold fill-gold h-4 w-4" />
                  {course.rating.toFixed(1)} ({course.reviewCount} avis)
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {course.enrolledCount.toLocaleString('fr-FR')} apprenants
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {formatDuration(course.duration)}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {course.lessons.length} leçons
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gold text-navy flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold">
                  {instructor.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{instructor.name}</p>
                  <p className="text-xs text-white/60">{instructor.title}</p>
                </div>
              </div>
            </div>

            {/* CTA card (desktop) */}
            <div className="hidden overflow-hidden rounded-xl bg-white shadow-xl lg:block">
              {course.thumbnailUrl && (
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="flex flex-col gap-4 p-5">
                {course.isFree ? (
                  <p className="text-2xl font-bold text-emerald-700">Gratuit</p>
                ) : (
                  <p className="text-navy font-mono text-2xl font-bold">
                    {priceNum.toLocaleString('fr-FR')} FCFA
                  </p>
                )}
                <Button
                  fullWidth
                  size="lg"
                  className="gap-2"
                  onClick={() => void handleEnroll()}
                  disabled={enrolling || enrolled}
                >
                  {enrolling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : enrolled ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      Inscrit !
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                      {course.isFree ? 'Commencer gratuitement' : "S'inscrire"}
                    </>
                  )}
                </Button>
                <p className="text-charcoal-400 text-center text-xs">
                  Accès illimité à vie · Certificat inclus
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* Description */}
            <div className="border-charcoal-100 rounded-xl border bg-white p-6">
              <h2 className="text-charcoal mb-3 font-serif text-lg font-semibold">
                À propos de cette formation
              </h2>
              <p className="text-charcoal-600 whitespace-pre-line leading-relaxed">
                {course.description}
              </p>
            </div>

            {/* Programme */}
            {course.lessons.length > 0 && (
              <div className="border-charcoal-100 rounded-xl border bg-white p-6">
                <h2 className="text-charcoal mb-4 font-serif text-lg font-semibold">
                  Programme ({course.lessons.length} leçons · {formatDuration(course.duration)})
                </h2>
                <div className="flex flex-col gap-1">
                  {course.lessons.map((lesson, idx) => (
                    <div
                      key={lesson.id}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                        lesson.isFree
                          ? 'hover:bg-charcoal-50 cursor-pointer'
                          : 'cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {lesson.isFree ? (
                          <Play
                            className="text-navy h-3.5 w-3.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                        ) : (
                          <Lock
                            className="text-charcoal-300 h-3.5 w-3.5 flex-shrink-0"
                            aria-hidden="true"
                          />
                        )}
                        <span className={`text-charcoal-400 mr-2 text-xs`}>{idx + 1}.</span>
                        <span
                          className={lesson.isFree ? 'text-navy font-medium' : 'text-charcoal-400'}
                        >
                          {lesson.title}
                        </span>
                        {lesson.isFree && (
                          <Badge variant="success" className="text-[10px]">
                            Gratuit
                          </Badge>
                        )}
                      </div>
                      <span className="text-charcoal-400 flex-shrink-0 text-xs">
                        {lesson.duration ? `${lesson.duration} min` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructor */}
            <div className="border-charcoal-100 rounded-xl border bg-white p-6">
              <h2 className="text-charcoal mb-4 font-serif text-lg font-semibold">
                Votre formateur
              </h2>
              <div className="flex items-start gap-4">
                <div className="text-navy bg-navy/10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold">
                  {instructor.avatar}
                </div>
                <div>
                  <p className="text-charcoal font-semibold">{instructor.name}</p>
                  <p className="text-charcoal-400 mb-2 text-sm">{instructor.title}</p>
                  {instructor.bio && <p className="text-charcoal-600 text-sm">{instructor.bio}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA */}
          <div className="border-charcoal-100 flex flex-col gap-4 rounded-xl border bg-white p-5 lg:hidden">
            {course.isFree ? (
              <p className="text-2xl font-bold text-emerald-700">Gratuit</p>
            ) : (
              <p className="text-navy font-mono text-2xl font-bold">
                {priceNum.toLocaleString('fr-FR')} FCFA
              </p>
            )}
            <Button
              fullWidth
              size="lg"
              className="gap-2"
              onClick={() => void handleEnroll()}
              disabled={enrolling || enrolled}
            >
              {enrolling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : enrolled ? (
                <>
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Inscrit !
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                  {course.isFree ? 'Commencer gratuitement' : "S'inscrire"}
                </>
              )}
            </Button>
          </div>

          {/* Desktop sticky sidebar */}
          <div className="hidden lg:block">
            <div className="border-charcoal-100 sticky top-24 flex flex-col gap-4 rounded-xl border bg-white p-5">
              <div className="text-charcoal-600 flex flex-col gap-2 text-sm">
                {[
                  { icon: BookOpen, text: `${course.lessons.length} leçons` },
                  { icon: Clock, text: formatDuration(course.duration) },
                  {
                    icon: Users,
                    text: `${course.enrolledCount.toLocaleString('fr-FR')} apprenants`,
                  },
                  { icon: Award, text: 'Certificat de complétion' },
                  { icon: CheckCircle2, text: 'Accès illimité à vie' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="text-navy h-4 w-4 flex-shrink-0" aria-hidden="true" />
                    {text}
                  </div>
                ))}
              </div>
              {course.tags.length > 0 && (
                <div className="border-charcoal-50 flex flex-wrap gap-1 border-t pt-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-charcoal-400 bg-charcoal-50 rounded-full px-2 py-0.5 text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
