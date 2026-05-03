'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Route } from 'next';
import { BookOpen, Loader2, GraduationCap, Award, ClipboardList, ChevronRight } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { cn } from '@afribayit/ui/src/lib/cn';
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
  certificateId?: string | null;
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
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/courses/me/enrollments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setEnrollments(data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
              AfriBayit Academy
            </p>
            <h1 className="text-charcoal font-serif text-5xl font-bold">Mes Formations</h1>
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="border-charcoal-100 h-12 gap-2 rounded-xl text-xs font-bold"
            >
              <Award className="text-gold h-4 w-4" />
              MES CERTIFICATS
            </Button>
            <Link href="/formation">
              <Button className="bg-navy h-12 rounded-xl px-6 text-xs font-bold">
                DÉCOUVRIR LE CATALOGUE
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="border-charcoal-100 flex items-center justify-center rounded-[32px] border bg-white py-20">
            <Loader2 className="text-navy h-10 w-10 animate-spin" />
          </div>
        ) : enrollments.length === 0 ? (
          <div className="border-charcoal-100 flex flex-col items-center justify-center gap-6 rounded-[32px] border bg-white px-6 py-20 text-center">
            <div className="bg-charcoal-50 text-charcoal-200 flex h-20 w-20 items-center justify-center rounded-[32px]">
              <GraduationCap className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-charcoal mb-2 text-xl font-bold">
                Prêt à investir dans votre savoir ?
              </h3>
              <p className="text-charcoal-400 max-w-md text-sm">
                Inscrivez-vous à une formation pour comprendre les rouages de l'investissement
                immobilier en Afrique.
              </p>
            </div>
            <Link href="/formation">
              <Button className="bg-navy h-14 rounded-2xl px-8 font-bold">
                PARCOURIR LE CATALOGUE →
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const c = enrollment.course;
              const isCompleted = enrollment.status === 'COMPLETED';
              return (
                <Link
                  key={enrollment.id}
                  href={`/dashboard/formations/${c.slug}` as Route}
                  className="border-charcoal-100 hover:border-navy/10 group relative flex flex-col overflow-hidden rounded-[32px] border bg-white transition-all duration-500 hover:shadow-2xl"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    {c.thumbnailUrl ? (
                      <img
                        src={c.thumbnailUrl}
                        alt={c.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="bg-navy/10 flex h-full w-full items-center justify-center">
                        <BookOpen className="text-navy/20 h-12 w-12" />
                      </div>
                    )}
                    <div className="from-charcoal/80 absolute inset-0 flex items-end bg-gradient-to-t to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex items-center gap-2 text-xs font-bold text-white">
                        CONTINUER LE COURS <ChevronRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-4 p-8">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={LEVEL_VARIANTS[c.level] ?? 'default'}
                        className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
                      >
                        {LEVEL_LABELS[c.level] ?? c.level}
                      </Badge>
                      <span className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                        {c.category}
                      </span>
                    </div>

                    <h3 className="text-charcoal line-clamp-2 font-serif text-xl font-bold leading-snug">
                      {c.title}
                    </h3>

                    <div className="border-charcoal-50 mt-auto space-y-4 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                          Progression
                        </span>
                        <span className="text-navy text-[10px] font-bold uppercase tracking-widest">
                          {enrollment.progress}%
                        </span>
                      </div>
                      <div className="bg-charcoal-50 h-1.5 w-full overflow-hidden rounded-full">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-1000',
                            isCompleted ? 'bg-emerald-500' : 'bg-navy',
                          )}
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
