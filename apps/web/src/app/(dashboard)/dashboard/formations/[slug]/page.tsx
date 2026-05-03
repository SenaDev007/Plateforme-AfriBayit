'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  PlayCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Clock,
  Award,
  Lock,
  Loader2,
} from 'lucide-react';
import { Card, Button, Badge } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { cn } from '@afribayit/ui/src/lib/cn';
import toast from 'react-hot-toast';

export default function CourseViewer() {
  const { slug } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!token || !slug) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/courses/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourse(data);
        // Find first uncompleted lesson
        if (data.completedLessonIds && data.lessons) {
          const firstPending = data.lessons.findIndex(
            (l: any) => !data.completedLessonIds.includes(l.id),
          );
          if (firstPending !== -1) setActiveLessonIdx(firstPending);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token, slug]);

  const activeLesson = course?.lessons?.[activeLessonIdx];
  const isCompleted = course?.completedLessonIds?.includes(activeLesson?.id);

  const handleComplete = async () => {
    if (!token || !activeLesson || completing) return;
    setCompleting(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/courses/lessons/${activeLesson.id}/complete`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setCourse((prev: any) => ({
        ...prev,
        completedLessonIds: [...(prev.completedLessonIds || []), activeLesson.id],
      }));

      toast.success('Leçon terminée !');

      // Move to next if available
      if (activeLessonIdx < course.lessons.length - 1) {
        setActiveLessonIdx((prev) => prev + 1);
      }
    } catch (err) {
      toast.error('Erreur');
    } finally {
      setCompleting(false);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="text-navy h-10 w-10 animate-spin" />
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout hideSidebarOnMobile>
      <div className="flex h-[calc(100vh-140px)] flex-col gap-6 lg:flex-row">
        {/* Main Content Area */}
        <div className="custom-scrollbar flex flex-1 flex-col gap-6 overflow-y-auto pr-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-charcoal-400 hover:text-navy gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              <Badge variant="sky">{course.category}</Badge>
              <div className="text-charcoal-400 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                <Clock className="h-3 w-3" />
                {activeLesson?.duration} min
              </div>
            </div>
          </div>

          {/* Video Player Placeholder */}
          <div className="bg-charcoal-900 group relative aspect-video overflow-hidden rounded-[32px] shadow-2xl">
            {activeLesson?.videoUrl ? (
              <iframe
                src={activeLesson.videoUrl}
                className="h-full w-full border-none"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-white/20">
                <PlayCircle className="mb-4 h-20 w-20 opacity-20" />
                <p className="font-serif italic">Contenu Vidéo non disponible</p>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <h1 className="text-charcoal font-serif text-3xl font-bold">{activeLesson?.title}</h1>
              {!isCompleted && (
                <Button
                  onClick={handleComplete}
                  disabled={completing}
                  className="bg-navy flex h-14 items-center gap-2 rounded-2xl px-8 font-bold"
                >
                  {completing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-5 w-5" />
                  )}
                  MARQUER COMME TERMINÉ
                </Button>
              )}
              {isCompleted && (
                <Badge variant="success" className="flex h-10 items-center gap-2 rounded-xl px-6">
                  <CheckCircle2 className="h-4 w-4" />
                  TERMINÉ
                </Badge>
              )}
            </div>
            <div className="prose prose-charcoal text-charcoal-500 max-w-none leading-relaxed">
              {activeLesson?.content || 'Aucun contenu écrit pour cette leçon.'}
            </div>
          </div>
        </div>

        {/* Sidebar: Lesson List */}
        <div className="flex w-full flex-col gap-6 lg:w-80">
          <Card className="border-charcoal-100 flex flex-1 flex-col overflow-hidden rounded-[32px] bg-white">
            <div className="border-charcoal-50 border-b p-6">
              <h3 className="text-charcoal flex items-center gap-2 font-bold">
                <BookOpen className="text-gold h-5 w-5" />
                Sommaire du cours
              </h3>
              <div className="bg-charcoal-50 mt-4 h-1.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-navy h-full transition-all duration-1000"
                  style={{
                    width: `${Math.round(((course?.completedLessonIds?.length || 0) / (course?.lessons?.length || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-charcoal-400 mt-2 text-right text-[10px] font-bold uppercase tracking-widest">
                {course?.completedLessonIds?.length || 0} / {course?.lessons?.length} leçons
              </p>
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto">
              {course?.lessons?.map((lesson: any, idx: number) => {
                const lessonCompleted = course.completedLessonIds?.includes(lesson.id);
                const isActive = activeLessonIdx === idx;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonIdx(idx)}
                    className={cn(
                      'border-charcoal-50 group flex w-full items-center gap-4 border-b p-5 text-left transition-all',
                      isActive ? 'bg-navy/5' : 'hover:bg-charcoal-50/50',
                    )}
                  >
                    <div
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                        lessonCompleted
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : isActive
                            ? 'border-navy text-navy font-bold'
                            : 'border-charcoal-100 text-charcoal-300',
                      )}
                    >
                      {lessonCompleted ? <CheckCircle2 className="h-4 w-4" /> : idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-xs font-bold',
                          isActive ? 'text-navy' : 'text-charcoal',
                        )}
                      >
                        {lesson.title}
                      </p>
                      <p className="text-charcoal-400 text-[9px] font-medium">
                        {lesson.duration} min
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quiz Call to Action */}
            <div className="bg-gold/5 border-gold/10 border-t p-6">
              <p className="text-gold mb-3 text-[10px] font-bold uppercase tracking-[0.2em]">
                Certification
              </p>
              <Button
                variant="gold"
                className="h-12 w-full gap-2 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                disabled={course?.completedLessonIds?.length < course?.lessons?.length}
              >
                {course?.completedLessonIds?.length < course?.lessons?.length ? (
                  <Lock className="h-3.5 w-3.5" />
                ) : (
                  <Award className="h-4 w-4" />
                )}
                PASSER LE QUIZ
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
