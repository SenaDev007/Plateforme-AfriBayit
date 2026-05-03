'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Users,
  TrendingUp,
  DollarSign,
  Share2,
  Copy,
  CheckCircle2,
  Gift,
  Award,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { Card, Button, Badge } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import toast from 'react-hot-toast';

export default function AmbassadorDashboard() {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ambassadors/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const generateCode = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ambassadors/code`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStats((prev: any) => ({ ...prev, referralCode: data.referralCode }));
      toast.success('Code généré !');
    } catch (err) {
      toast.error('Erreur');
    }
  };

  const copyLink = () => {
    if (!stats?.referralCode) return;
    const url = `${window.location.origin}/inscription?ref=${stats.referralCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="text-navy h-10 w-10 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
              Programme Ambassadeur
            </p>
            <h1 className="text-charcoal font-serif text-3xl font-bold md:text-5xl">
              Votre Impact
            </h1>
          </div>
          <div className="border-charcoal-100 flex items-center gap-2 rounded-2xl border bg-white p-2 shadow-sm">
            <div className="bg-gold/10 text-gold flex h-10 w-10 items-center justify-center rounded-xl">
              <Award className="h-5 w-5" />
            </div>
            <div className="pr-4">
              <p className="text-charcoal-400 text-[9px] font-bold uppercase">Niveau Actuel</p>
              <p className="text-navy text-xs font-bold">Ambassadeur Bronze</p>
            </div>
          </div>
        </div>

        {/* Hero Stats */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="bg-navy relative overflow-hidden border-none p-8 text-white">
            <div className="bg-gold/10 absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
            <p className="text-gold mb-6 text-[10px] font-bold uppercase tracking-widest">
              Commissions Disponibles
            </p>
            <h2 className="mb-2 font-serif text-4xl font-bold">
              {stats?.earningsPaid?.toLocaleString()}{' '}
              <span className="font-sans text-sm opacity-40">XOF</span>
            </h2>
            <p className="mb-8 text-xs text-white/40">
              {stats?.earningsPending?.toLocaleString()} XOF en attente
            </p>
            <Button
              variant="gold"
              className="h-12 w-full rounded-xl text-[10px] font-bold uppercase tracking-widest"
            >
              DEMANDER UN RETRAIT
            </Button>
          </Card>

          <div className="grid grid-rows-2 gap-6">
            <Card className="border-charcoal-100 flex items-center justify-between bg-white p-6">
              <div>
                <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase">
                  Parrainages
                </p>
                <p className="text-charcoal font-serif text-2xl font-bold">
                  {stats?.referralCount}
                </p>
              </div>
              <div className="bg-navy/5 text-navy flex h-12 w-12 items-center justify-center rounded-2xl">
                <Users className="h-6 w-6" />
              </div>
            </Card>
            <Card className="border-charcoal-100 flex items-center justify-between bg-white p-6">
              <div>
                <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase">
                  Points Fidélité
                </p>
                <p className="text-charcoal font-serif text-2xl font-bold">{stats?.points}</p>
              </div>
              <div className="bg-gold/10 text-gold flex h-12 w-12 items-center justify-center rounded-2xl">
                <Gift className="h-6 w-6" />
              </div>
            </Card>
          </div>

          <Card className="border-charcoal-100 flex flex-col justify-between bg-white p-8">
            <div>
              <p className="text-charcoal-400 mb-4 text-[10px] font-bold uppercase">
                Votre Lien Magique
              </p>
              {stats?.referralCode ? (
                <div
                  className="bg-charcoal-50 border-charcoal-100 group flex cursor-pointer items-center justify-between rounded-xl border p-4"
                  onClick={copyLink}
                >
                  <span className="text-navy text-xs font-bold uppercase tracking-widest">
                    {stats.referralCode}
                  </span>
                  <Copy
                    className={cn(
                      'h-4 w-4 transition-colors',
                      copied ? 'text-emerald-500' : 'text-charcoal-300 group-hover:text-navy',
                    )}
                  />
                </div>
              ) : (
                <Button
                  onClick={generateCode}
                  variant="outline"
                  className="h-14 w-full rounded-xl text-xs font-bold"
                >
                  ACTIVER MON CODE
                </Button>
              )}
            </div>
            <p className="text-charcoal-400 mt-4 text-[10px] leading-relaxed">
              Gagnez <span className="text-navy font-bold">5% de commission</span> sur chaque
              transaction immobilière réalisée par vos filleuls.
            </p>
          </Card>
        </div>

        {/* Content Tabs */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-charcoal font-serif text-2xl font-bold">Filleuls Récents</h2>
              <Button variant="ghost" className="text-[10px] font-bold uppercase tracking-widest">
                VOIR TOUT
              </Button>
            </div>

            <div className="border-charcoal-100 overflow-hidden rounded-[32px] border bg-white shadow-sm">
              {stats?.recentReferrals?.length > 0 ? (
                <div className="divide-charcoal-50 divide-y">
                  {stats.recentReferrals.map((ref: any, i: number) => (
                    <div
                      key={i}
                      className="hover:bg-charcoal-50/50 flex items-center justify-between p-6 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-navy/5 text-navy flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold italic">
                          {ref.firstName[0]}
                        </div>
                        <div>
                          <p className="text-charcoal text-sm font-bold">{ref.firstName}</p>
                          <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                            Inscrit le {new Date(ref.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={ref.kycLevel !== 'NONE' ? 'success' : 'default'}
                        className="text-[9px] font-bold uppercase"
                      >
                        {ref.kycLevel.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 p-20 text-center">
                  <Share2 className="text-charcoal-200 mx-auto h-10 w-10" />
                  <p className="text-charcoal-400 text-sm font-medium italic">
                    Commencez à partager votre lien pour voir vos filleuls ici.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-charcoal font-serif text-2xl font-bold">Objectifs Bronze</h2>
            <div className="space-y-4">
              {[
                {
                  label: '10 Inscriptions',
                  progress: (stats?.referralCount / 10) * 100,
                  done: stats?.referralCount >= 10,
                },
                {
                  label: '1ère Transaction',
                  progress: stats?.earningsPaid > 0 ? 100 : 0,
                  done: stats?.earningsPaid > 0,
                },
                { label: '5 Profils KYC Lvl 2', progress: 20, done: false },
              ].map((goal, i) => (
                <Card key={i} className="border-charcoal-100 bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-charcoal text-xs font-bold uppercase tracking-wider">
                      {goal.label}
                    </span>
                    {goal.done ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <span className="text-charcoal-300 text-[10px] font-bold">
                        {goal.progress.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <div className="bg-charcoal-50 h-1.5 w-full overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      className={cn(
                        'h-full rounded-full',
                        goal.done ? 'bg-emerald-500' : 'bg-navy',
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
