'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Route } from 'next';
import { Loader2, CheckCircle, XCircle, Award, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  order: number;
}

interface QuizData {
  id: string;
  title: string;
  passingScore: number;
  questions: QuizQuestion[];
  myBestAttempt: { score: number; passed: boolean } | null;
}

interface AttemptResult {
  score: number;
  passed: boolean;
  correct: number;
  total: number;
  passingScore: number;
  certificateId: string | null;
}

export default function QuizPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { data: session } = useSession();
  const router = useRouter();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);

  useEffect(() => {
    const token = session?.accessToken as string | undefined;
    if (!token || !courseId) return;
    api.courses
      .getQuiz(courseId, token)
      .then((res) => {
        const q = res.data as QuizData;
        setQuiz(q);
        setAnswers(new Array<number | null>(q.questions.length).fill(null));
      })
      .catch(() => router.push('/dashboard/formations' as Route))
      .finally(() => setLoading(false));
  }, [courseId, session, router]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const handleSubmit = async () => {
    const token = session?.accessToken as string | undefined;
    if (!token || !quiz) return;
    if (answers.some((a) => a === null)) return;

    setSubmitting(true);
    try {
      const { data } = await api.courses.submitQuizAttempt(courseId, answers as number[], token);
      setResult(data);
    } catch {
      // Keep form visible on error
    } finally {
      setSubmitting(false);
    }
  };

  const unanswered = answers.filter((a) => a === null).length;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="text-navy h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) return null;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <Link
            href="/dashboard/formations"
            className="text-charcoal-400 mb-3 inline-flex items-center gap-1 text-sm hover:underline"
          >
            ← Mes formations
          </Link>
          <h1 className="text-charcoal font-serif text-2xl font-bold">{quiz.title}</h1>
          <p className="text-charcoal-400 text-sm">
            {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''} — Score minimum:{' '}
            <strong>{quiz.passingScore}%</strong>
          </p>
          {quiz.myBestAttempt && (
            <p className="mt-1 text-sm">
              Meilleur score précédent :{' '}
              <span
                className={
                  quiz.myBestAttempt.passed
                    ? 'font-semibold text-green-600'
                    : 'font-semibold text-red-500'
                }
              >
                {quiz.myBestAttempt.score}%{quiz.myBestAttempt.passed ? ' ✓' : ''}
              </span>
            </p>
          )}
        </div>

        {/* Result panel */}
        {result ? (
          <div
            className={`rounded-2xl border-2 p-8 text-center ${
              result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            {result.passed ? (
              <CheckCircle className="mx-auto mb-3 h-14 w-14 text-green-500" />
            ) : (
              <XCircle className="mx-auto mb-3 h-14 w-14 text-red-400" />
            )}
            <p className="text-2xl font-bold">{result.score}%</p>
            <p className="mt-1 font-semibold">
              {result.correct}/{result.total} bonne{result.correct > 1 ? 's' : ''} réponse
              {result.correct > 1 ? 's' : ''}
            </p>
            <p className="text-charcoal-500 mt-1 text-sm">
              {result.passed
                ? 'Félicitations, vous avez réussi !'
                : `Score minimum requis : ${result.passingScore}%. Réessayez !`}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {result.passed && result.certificateId && (
                <Link
                  href={`/dashboard/formations/certificats/${result.certificateId}` as Route}
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                  <Award className="h-4 w-4" />
                  Voir mon certificat
                </Link>
              )}
              <button
                onClick={() => {
                  setResult(null);
                  setAnswers(new Array<number | null>(quiz.questions.length).fill(null));
                }}
                className="border-charcoal-200 text-charcoal hover:bg-charcoal-50 rounded-full border px-5 py-2.5 text-sm font-semibold"
              >
                {result.passed ? 'Réessayer' : 'Retenter le quiz'}
              </button>
            </div>
          </div>
        ) : (
          /* Questions */
          <div className="space-y-5">
            {quiz.questions.map((q, qi) => (
              <div
                key={q.id}
                className="border-charcoal-100 rounded-2xl border bg-white p-5 shadow-sm"
              >
                <p className="text-charcoal mb-4 font-semibold">
                  <span className="text-charcoal-400 mr-2 text-sm">Q{qi + 1}.</span>
                  {q.text}
                </p>
                <div className="space-y-2">
                  {(q.options as string[]).map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    return (
                      <label
                        key={oi}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                          selected
                            ? 'border-navy bg-navy/5 font-medium'
                            : 'border-charcoal-100 hover:border-charcoal-200 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          value={oi}
                          checked={selected}
                          onChange={() => handleAnswer(qi, oi)}
                          className="accent-navy mt-0.5 shrink-0"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={() => void handleSubmit()}
              disabled={submitting || unanswered > 0}
              className="bg-navy hover:bg-navy/90 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {unanswered > 0
                    ? `${unanswered} réponse${unanswered > 1 ? 's' : ''} manquante${unanswered > 1 ? 's' : ''}`
                    : 'Soumettre mes réponses'}
                  {unanswered === 0 && <ChevronRight className="h-4 w-4" />}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
