'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Route } from 'next';
import { BookOpen, Loader2, GraduationCap } from 'lucide-react';
import { Badge } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';

interface EnrolledCourse {
  id: string;
  progress: number;
  status: string;
  updatedAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    category: string | null;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  };
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};

const LEVEL_VARIANTS: Record<string, 'success' | 'sky' | 'gold'> = {
  BEGINNER: 'success',
  INTERMEDIATE: 'sky',
  ADVANCED: 'gold',
};

export default function FormationsDashboardPage(): React.ReactElement {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;

  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.courses
      .getMyEnrollments(token)
      .then((res) => setEnrollments(res.data as EnrolledCourse[]))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-charcoal font-serif text-2xl font-bold">Mes formations</h1>
          <Link
            href="/formation"
            className="bg-navy hover:bg-navy/90 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Découvrir les formations
          </Link>
        </div>

        {loading ? (
          <div className="border-charcoal-100 flex items-center justify-center rounded-xl border bg-white py-20">
            <Loader2 className="text-navy h-8 w-8 animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="border-charcoal-100 flex flex-col items-center justify-center gap-4 rounded-xl border bg-white py-20 text-center">
            <GraduationCap className="text-charcoal-200 h-12 w-12" />
            <p className="text-charcoal font-medium">Aucune formation en cours</p>
            <p className="text-charcoal-400 text-sm">
              Inscrivez-vous à une formation pour démarrer votre apprentissage.
            </p>
            <Link href="/formation" className="text-navy text-sm font-medium hover:underline">
              Parcourir le catalogue →
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const c = enrollment.course;
              const isCompleted = enrollment.status === 'COMPLETED';
              return (
                <Link
                  key={enrollment.id}
                  href={`/formation/${c.slug}` as Route}
                  className="border-charcoal-100 group flex flex-col overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md"
                >
                  {c.thumbnailUrl ? (
                    <img
                      src={c.thumbnailUrl}
                      alt={c.title}
                      className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="bg-navy/10 flex h-36 items-center justify-center">
                      <BookOpen className="text-navy/40 h-10 w-10" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-4">
                    <div className="flex items-center gap-2">
                      {c.level && (
                        <Badge variant={LEVEL_VARIANTS[c.level] ?? 'default'} className="text-xs">
                          {LEVEL_LABELS[c.level] ?? c.level}
                        </Badge>
                      )}
                      {c.category && (
                        <span className="text-charcoal-400 text-xs">{c.category}</span>
                      )}
                    </div>
                    <h3 className="text-charcoal group-hover:text-navy line-clamp-2 text-sm font-semibold transition-colors">
                      {c.title}
                    </h3>

                    {/* Progress bar */}
                    <div className="mt-auto">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-charcoal-400">
                          {isCompleted ? 'Terminé ✓' : `${enrollment.progress}% complété`}
                        </span>
                      </div>
                      <div className="bg-charcoal-100 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isCompleted ? 'bg-success' : 'bg-navy'
                          }`}
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
