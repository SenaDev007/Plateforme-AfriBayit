'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Users, ShieldCheck, FileCheck, BarChart3, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface Stats {
  totalUsers: number;
  pendingKyc: number;
}

export default function AdminHomePage(): React.ReactElement {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;

  const [stats, setStats] = useState<Stats>({ totalUsers: 0, pendingKyc: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    Promise.allSettled([api.users.getAdminUsers({}, token), api.users.getPendingKyc(token)])
      .then(([usersRes, kycRes]) => {
        setStats({
          totalUsers:
            usersRes.status === 'fulfilled' ? (usersRes.value.data as unknown[]).length : 0,
          pendingKyc: kycRes.status === 'fulfilled' ? (kycRes.value.data as unknown[]).length : 0,
        });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const STAT_CARDS = [
    {
      label: 'Utilisateurs',
      value: loading ? '…' : stats.totalUsers.toLocaleString('fr-FR'),
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/users',
    },
    {
      label: 'KYC en attente',
      value: loading ? '…' : stats.pendingKyc.toLocaleString('fr-FR'),
      icon: ShieldCheck,
      color: stats.pendingKyc > 0 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600',
      href: '/admin/kyc',
      alert: stats.pendingKyc > 0,
    },
  ];

  const QUICK_LINKS = [
    {
      label: 'Réviser les KYC en attente',
      href: '/admin/kyc',
      icon: FileCheck,
      desc: "Approuver ou rejeter les documents d'identité soumis.",
    },
    {
      label: 'Gérer les utilisateurs',
      href: '/admin/users',
      icon: Users,
      desc: 'Modifier les rôles, bannir ou réactiver des comptes.',
    },
    {
      label: 'Statistiques avancées',
      href: '/admin/stats',
      icon: BarChart3,
      desc: 'Analyser les métriques clés de la plateforme.',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
        <p className="mt-1 text-slate-500">Vue d'ensemble de la plateforme AfriBayit.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div
              className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${card.color}`}
            >
              <card.icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-slate-500">{card.label}</p>
              <div className="flex items-center gap-2">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                ) : (
                  <p className="text-2xl font-bold text-slate-900">{card.value}</p>
                )}
                {card.alert && !loading && (
                  <AlertTriangle
                    className="h-4 w-4 text-amber-500"
                    aria-label="Attention requise"
                  />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Actions rapides</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col gap-2 rounded-xl border bg-white p-5 transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                <link.icon className="h-5 w-5 text-slate-600" aria-hidden="true" />
              </div>
              <p className="font-semibold text-slate-800">{link.label}</p>
              <p className="text-sm text-slate-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
