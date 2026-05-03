'use client';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, Button, Badge, Loader2 } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Play, Database, ArrowRight, CheckCircle2, AlertTriangle, Beaker } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DevDashboard() {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const [loading, setLoading] = useState(false);
  const [lastScenario, setLastScenario] = useState<any>(null);

  const runSeed = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/simulation/seed`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLastScenario(data);
      toast.success('Environnement de test généré !');
    } catch (err) {
      toast.error('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  const advanceTransaction = async (txId: string, status: string) => {
    if (!token) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/simulation/transactions/${txId}/advance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      toast.success(`Transaction avancée vers: ${status}`);
    } catch (err) {
      toast.error('Erreur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        <div>
          <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            Internal Debugging
          </p>
          <h1 className="text-charcoal font-serif text-5xl font-bold">Labo Simulations</h1>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Action Card */}
          <Card className="border-navy/10 bg-white p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-navy/5 text-navy flex h-12 w-12 items-center justify-center rounded-xl">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Initialisation Données</h3>
                <p className="text-charcoal-400 text-xs font-medium">
                  Crée un Acheteur, Vendeur, Notaire et un Terrain.
                </p>
              </div>
            </div>

            <Button
              onClick={runSeed}
              disabled={loading}
              className="bg-navy flex h-14 w-full items-center justify-center gap-2 rounded-2xl font-bold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Play className="h-5 w-5" />
              )}
              GÉNÉRER SCÉNARIO COMPLET
            </Button>
          </Card>

          {/* Status Card */}
          <Card className="border-gold/10 bg-white p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-gold/5 text-gold flex h-12 w-12 items-center justify-center rounded-xl">
                <Beaker className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Testeur de Flux</h3>
                <p className="text-charcoal-400 text-xs font-medium">
                  Forcer l'avancement des étapes transactionnelles.
                </p>
              </div>
            </div>

            {lastScenario ? (
              <div className="space-y-4">
                <div className="bg-charcoal-50 border-charcoal-100 rounded-xl border p-4">
                  <p className="text-charcoal-400 mb-2 text-[10px] font-bold uppercase">
                    Utilisateurs Créés
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-bold">Buyer: {lastScenario.buyer.email}</p>
                    <p className="text-xs font-bold">Seller: {lastScenario.seller.email}</p>
                    <p className="text-xs font-bold">Notary: {lastScenario.notaryUser.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => toast.info('Créez une transaction manuellement pour tester')}
                    className="h-10 text-[10px]"
                  >
                    SIMULER PAIEMENT
                  </Button>
                  <Button variant="outline" className="h-10 text-[10px]">
                    ASSIGNER NOTAIRE
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-charcoal-300 flex flex-col items-center justify-center py-10">
                <AlertTriangle className="mb-4 h-10 w-10 opacity-20" />
                <p className="text-xs font-medium italic">
                  Générez un scénario pour voir les actions.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Instructions */}
        <div className="bg-navy relative overflow-hidden rounded-[32px] p-10 text-white">
          <div className="bg-gold/10 absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
          <h3 className="mb-6 font-serif text-2xl font-bold">Comment tester le flux Notaire ?</h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="bg-gold/20 text-gold flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                1
              </div>
              <p className="text-sm font-medium leading-relaxed text-white/70">
                Générez le scénario. Connectez-vous en tant que <strong>buyer@test.com</strong>.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gold/20 text-gold flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                2
              </div>
              <p className="text-sm font-medium leading-relaxed text-white/70">
                Allez sur le terrain créé, initiez l'achat et simulez le paiement.
              </p>
            </div>
            <div className="space-y-4">
              <div className="bg-gold/20 text-gold flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold">
                3
              </div>
              <p className="text-sm font-medium leading-relaxed text-white/70">
                Connectez-vous avec <strong>notaire@test.com</strong> pour voir le dossier.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
