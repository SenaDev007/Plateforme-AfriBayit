'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Gavel,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileText,
  User,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { Card, Badge, Button } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';
import { cn } from '@afribayit/ui/src/lib/cn';

interface NotaryAssignment {
  id: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'SIGNED' | 'REGISTERED';
  createdAt: string;
  transaction: {
    reference: string;
    amount: string;
    currency: string;
    property: { title: string; city: string; country: string } | null;
    buyer: { firstName: string; lastName: string };
    seller: { firstName: string; lastName: string };
  };
}

export default function NotaryDashboard() {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const [assignments, setAssignments] = useState<NotaryAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    // Fetch assignments for the notary
    // For now, using a mock if API fails, but the logic is ready
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/notaries/me/assignments`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAssignments(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    if (!token) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/notaries/assignments/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      // Refresh
      setAssignments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: status as any } : a)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return <Clock className="text-gold h-5 w-5" />;
      case 'IN_PROGRESS':
        return <Loader2 className="text-navy h-5 w-5 animate-spin" />;
      case 'SIGNED':
        return <FileCheck className="h-5 w-5 text-emerald-500" />;
      case 'REGISTERED':
        return <ShieldCheck className="text-navy h-5 w-5" />;
      default:
        return <AlertCircle className="text-charcoal-300 h-5 w-5" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-navy mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
              Office Notarial Digital
            </p>
            <h1 className="text-charcoal font-serif text-3xl font-bold md:text-5xl">
              Dossiers Juridiques
            </h1>
          </div>
          <div className="border-charcoal-100 flex rounded-2xl border bg-white p-2 shadow-sm">
            <div className="border-charcoal-100 border-r px-6 py-2 text-center">
              <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase">En attente</p>
              <p className="text-navy font-serif text-xl font-bold">
                {assignments.filter((a) => a.status === 'ASSIGNED').length}
              </p>
            </div>
            <div className="px-6 py-2 text-center">
              <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase">Terminés</p>
              <p className="font-serif text-xl font-bold text-emerald-600">
                {assignments.filter((a) => a.status === 'REGISTERED').length}
              </p>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="text-navy h-10 w-10 animate-spin" />
            </div>
          ) : assignments.length > 0 ? (
            assignments.map((assignment) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-charcoal-100 overflow-hidden rounded-[32px] border bg-white shadow-sm transition-all duration-500 hover:shadow-xl"
              >
                <div className="flex flex-col gap-10 p-8 md:p-10 lg:flex-row">
                  {/* Left: Status & Info */}
                  <div className="flex flex-col gap-6 lg:w-1/3">
                    <div className="flex items-center gap-4">
                      <div className="bg-charcoal-50 flex h-14 w-14 items-center justify-center rounded-2xl">
                        {getStatusIcon(assignment.status)}
                      </div>
                      <div>
                        <Badge className="mb-1">{assignment.status.replace('_', ' ')}</Badge>
                        <p className="text-charcoal-400 text-xs font-bold uppercase tracking-widest">
                          Réf: {assignment.transaction.reference}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="text-charcoal flex items-center gap-3">
                        <Building2 className="text-navy/40 h-5 w-5" />
                        <span className="text-sm font-bold">
                          {assignment.transaction.property?.title || 'Bien non spécifié'}
                        </span>
                      </div>
                      <div className="text-charcoal-400 flex items-center gap-3">
                        <Clock className="text-navy/20 h-5 w-5" />
                        <span className="text-xs font-medium">
                          Reçu le {new Date(assignment.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Parties */}
                  <div className="border-charcoal-50 flex flex-col gap-6 border-y py-6 lg:w-1/3 lg:border-x lg:border-y-0 lg:px-10 lg:py-0">
                    <p className="text-charcoal-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                      Parties Contractantes
                    </p>
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-navy/5 text-navy flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold italic">
                          A
                        </div>
                        <div>
                          <p className="text-charcoal text-xs font-bold">
                            {assignment.transaction.buyer.firstName}{' '}
                            {assignment.transaction.buyer.lastName}
                          </p>
                          <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                            Acheteur
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="bg-gold/10 text-gold flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold italic">
                          V
                        </div>
                        <div>
                          <p className="text-charcoal text-xs font-bold">
                            {assignment.transaction.seller.firstName}{' '}
                            {assignment.transaction.seller.lastName}
                          </p>
                          <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                            Vendeur
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col justify-between gap-6 lg:w-1/3">
                    <div>
                      <p className="text-charcoal-300 mb-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                        Actions de Validation
                      </p>
                      <div className="space-y-3">
                        {assignment.status === 'ASSIGNED' && (
                          <Button
                            onClick={() => updateStatus(assignment.id, 'IN_PROGRESS')}
                            className="bg-navy h-12 w-full rounded-xl text-[11px] font-bold uppercase tracking-widest"
                          >
                            OUVRIR LE DOSSIER
                          </Button>
                        )}
                        {assignment.status === 'IN_PROGRESS' && (
                          <Button
                            onClick={() => updateStatus(assignment.id, 'SIGNED')}
                            className="h-12 w-full rounded-xl bg-emerald-600 text-[11px] font-bold uppercase tracking-widest"
                          >
                            CONFIRMER SIGNATURE ACTE
                          </Button>
                        )}
                        {assignment.status === 'SIGNED' && (
                          <Button
                            onClick={() => updateStatus(assignment.id, 'REGISTERED')}
                            className="bg-navy flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[11px] font-bold uppercase tracking-widest"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            ANCRER SUR POLYGON (ANDF)
                          </Button>
                        )}
                        {assignment.status === 'REGISTERED' && (
                          <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                              DOSSIER CLÔTURÉ
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href="#"
                      className="text-navy hover:text-gold flex items-center gap-2 self-end text-[10px] font-bold uppercase tracking-widest transition-colors"
                    >
                      VOIR DOCUMENTS <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="border-charcoal-100 space-y-6 rounded-[40px] border bg-white p-20 text-center">
              <div className="bg-charcoal-50 text-charcoal-200 mx-auto flex h-20 w-20 items-center justify-center rounded-3xl">
                <Gavel className="h-10 w-10" />
              </div>
              <h3 className="text-charcoal font-serif text-2xl font-bold">
                Aucun dossier en attente
              </h3>
              <p className="text-charcoal-400 mx-auto max-w-sm text-sm">
                Votre file d'attente est vide. Les nouveaux dossiers vous seront attribués
                automatiquement via notre système sécurisé.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
