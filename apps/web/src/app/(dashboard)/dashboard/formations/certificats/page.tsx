'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import type { Route } from 'next';
import { Award, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';

interface Certificate {
  id: string;
  score: number;
  issuedAt: string;
  course: {
    title: string;
    slug: string;
    level: string;
    category: string | null;
  };
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
};

export default function CertificatsPage() {
  const { data: session } = useSession();
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = session?.accessToken as string | undefined;
    if (!token) return;
    api.courses
      .getMyCertificates(token)
      .then((res) => setCerts(res.data as Certificate[]))
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-charcoal font-serif text-2xl font-bold">Mes certificats</h1>
            <p className="text-charcoal-400 text-sm">
              Certificats obtenus après réussite des évaluations.
            </p>
          </div>
          <Link href="/dashboard/formations" className="text-charcoal-400 text-sm hover:underline">
            ← Mes formations
          </Link>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Loader2 className="text-navy h-8 w-8 animate-spin" />
          </div>
        ) : certs.length === 0 ? (
          <div className="border-charcoal-100 flex flex-col items-center justify-center gap-4 rounded-2xl border bg-white py-20 text-center">
            <Award className="text-charcoal-200 h-14 w-14" />
            <p className="text-charcoal font-semibold">Aucun certificat pour l'instant</p>
            <p className="text-charcoal-400 text-sm">
              Réussissez l'évaluation d'une formation pour obtenir votre certificat.
            </p>
            <Link
              href="/dashboard/formations"
              className="bg-navy hover:bg-navy/90 mt-2 rounded-full px-5 py-2 text-sm font-semibold text-white"
            >
              Voir mes formations
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certs.map((cert) => (
              <Link
                key={cert.id}
                href={`/dashboard/formations/certificats/${cert.id}` as Route}
                className="border-charcoal-100 group flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-gold/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <Award className="text-gold h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-charcoal group-hover:text-navy line-clamp-2 text-sm font-semibold transition-colors">
                      {cert.course.title}
                    </p>
                    <p className="text-charcoal-400 text-xs">
                      {cert.course.category && `${cert.course.category} · `}
                      {LEVEL_LABELS[cert.course.level] ?? cert.course.level}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{cert.score}%</p>
                    <p className="text-charcoal-400 text-xs">Score</p>
                  </div>
                  <div className="text-right">
                    <p className="text-charcoal text-sm font-medium">
                      {new Date(cert.issuedAt).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-charcoal-400 text-xs">Émis le</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
