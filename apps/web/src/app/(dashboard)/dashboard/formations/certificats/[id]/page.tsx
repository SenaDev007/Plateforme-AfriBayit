'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Loader2, Printer, Award } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { api } from '@/lib/api';

interface CertData {
  id: string;
  score: number;
  issuedAt: string;
  user: { firstName: string; lastName: string };
  course: { title: string; level: string; category: string | null };
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Niveau Débutant',
  INTERMEDIATE: 'Niveau Intermédiaire',
  ADVANCED: 'Niveau Avancé',
};

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.courses
      .getCertificate(id)
      .then((res) => setCert(res.data as CertData))
      .catch(() => setCert(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold text-slate-700">Certificat introuvable.</p>
        <Link
          href={'/dashboard/formations/certificats' as Route}
          className="text-sm text-blue-600 hover:underline"
        >
          Retour à mes certificats
        </Link>
      </div>
    );
  }

  const issued = new Date(cert.issuedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; background: white; }
          .certificate-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; }
        }
      `}</style>

      <div className="certificate-page min-h-screen bg-slate-100 p-6">
        {/* Toolbar */}
        <div className="no-print mx-auto mb-6 flex max-w-3xl items-center justify-between">
          <Link
            href={'/dashboard/formations/certificats' as Route}
            className="text-sm text-slate-500 hover:underline"
          >
            ← Mes certificats
          </Link>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full bg-slate-800 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <Printer className="h-4 w-4" />
            Imprimer / Télécharger PDF
          </button>
        </div>

        {/* Certificate */}
        <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Top gold band */}
          <div className="h-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600" />

          <div className="px-12 py-10">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between border-b pb-6">
              <div>
                <span className="font-serif text-3xl font-bold">
                  <span className="text-[#003087]">Afri</span>
                  <span className="text-[#D4AF37]">Bayit</span>
                </span>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-400">
                  Académie de l'immobilier africain
                </p>
              </div>
              <Award className="h-12 w-12 text-yellow-500" />
            </div>

            {/* Body */}
            <div className="mb-8 text-center">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-400">
                Certificat de réussite
              </p>
              <p className="mt-4 text-sm text-slate-500">Ce certificat est décerné à</p>
              <p className="mt-2 font-serif text-4xl font-bold text-[#003087]">
                {cert.user.firstName} {cert.user.lastName}
              </p>
              <p className="mt-4 text-sm text-slate-500">
                pour avoir réussi avec succès la formation
              </p>
              <p className="mt-2 text-xl font-bold text-slate-800">{cert.course.title}</p>
              <p className="mt-1 text-sm text-slate-400">
                {cert.course.category && `${cert.course.category} · `}
                {LEVEL_LABELS[cert.course.level] ?? cert.course.level}
              </p>
            </div>

            {/* Score & Date */}
            <div className="mb-8 flex items-center justify-center gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{cert.score}%</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Score obtenu
                </p>
              </div>
              <div className="h-10 w-px bg-slate-200" />
              <div className="text-center">
                <p className="text-lg font-semibold text-slate-700">{issued}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Date d'émission
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-end justify-between border-t pt-6">
              <div>
                <div className="mb-1 h-px w-40 bg-slate-300" />
                <p className="text-xs text-slate-400">Signature AfriBayit</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[10px] text-slate-300">ID: {cert.id}</p>
                <p className="text-[10px] text-slate-300">afribayit.com</p>
              </div>
            </div>
          </div>

          {/* Bottom gold band */}
          <div className="h-3 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500" />
        </div>
      </div>
    </>
  );
}
