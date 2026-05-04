'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Unlock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
} from 'lucide-react';
import { Card, Badge, Button, cn } from '@afribayit/ui';

const TRANSACTIONS = [
  {
    id: 'TX-99218',
    type: 'Vente Immobilière',
    property: 'Villa Cocody Riviéra',
    amount: '85 000 000 FCFA',
    commission: '2 550 000 FCFA',
    status: 'IN_PROGRESS',
    conditions: [
      { label: 'Documents Légaux', status: 'VALIDATED' },
      { label: 'Inspection GeoTrust', status: 'VALIDATED' },
      { label: 'Acte Notarié', status: 'PENDING' },
      { label: 'Confirmation Acheteur', status: 'PENDING' },
    ],
    date: '12 Août 2025',
  },
  {
    id: 'TX-88421',
    type: 'Mission Artisan',
    property: 'Installation Solaire - M. Koffi',
    amount: '450 000 FCFA',
    commission: '45 000 FCFA',
    status: 'FUNDED',
    conditions: [
      { label: 'Début Mission', status: 'VALIDATED' },
      { label: 'Livraison Travaux', status: 'PENDING' },
      { label: 'Validation Client', status: 'PENDING' },
    ],
    date: '14 Août 2025',
  },
];

export default function EscrowDashboard() {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  return (
    <div className="space-y-10 py-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            Fintech & Trust Engine
          </p>
          <h1 className="text-charcoal font-serif text-4xl font-bold">Sécurisation Escrow</h1>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="rounded-full px-8">
            HISTORIQUE
          </Button>
          <Button className="bg-navy rounded-full px-8">DÉCLARER UN LITIGE</Button>
        </div>
      </div>

      {/* Wallet Summary - Section 7B.4 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="bg-navy relative overflow-hidden rounded-[40px] p-8 text-white">
          <div className="bg-gold/10 absolute right-0 top-0 h-32 w-32 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
          <p className="text-gold/60 mb-2 text-[10px] font-bold uppercase tracking-widest">
            Disponible pour retrait
          </p>
          <h2 className="mb-8 font-serif text-4xl font-bold">
            12 450 000 <span className="text-sm opacity-40">FCFA</span>
          </h2>
          <Button variant="gold" fullWidth className="h-14 rounded-2xl">
            DEMANDER UN PAYOUT
          </Button>
        </Card>

        <Card className="border-charcoal-100 rounded-[40px] bg-white p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="bg-sky/10 rounded-2xl p-3 text-sky-600">
              <Lock className="h-6 w-6" />
            </div>
            <Badge variant="sky">ESCROW ACTIF</Badge>
          </div>
          <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase tracking-widest">
            Fonds en séquestre
          </p>
          <h2 className="text-charcoal mb-4 text-3xl font-bold">85 450 000 FCFA</h2>
          <p className="text-charcoal-400 text-xs">
            Ces fonds sont sécurisés et en attente des conditions de libération.
          </p>
        </Card>

        <Card className="border-charcoal-100 rounded-[40px] bg-white p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="bg-emerald/10 rounded-2xl p-3 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <Badge variant="success">REVENUS TOTAL</Badge>
          </div>
          <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase tracking-widest">
            Volume traité
          </p>
          <h2 className="text-charcoal mb-4 text-3xl font-bold">145.8M FCFA</h2>
          <p className="text-charcoal-400 text-xs">
            Score de confiance : <span className="text-navy font-bold">98/100</span> (Elite)
          </p>
        </Card>
      </div>

      {/* Escrow State Machine - Section 7B.3 */}
      <Card className="border-charcoal-100 rounded-[40px] p-8">
        <div className="mb-8 flex items-center justify-between">
          <h3 className="font-serif text-2xl font-bold">Transactions sous Escrow</h3>
          <div className="bg-charcoal-50 flex rounded-xl p-1">
            <button
              onClick={() => setActiveTab('active')}
              className={cn(
                'rounded-lg px-6 py-2 text-xs font-bold transition-all',
                activeTab === 'active' ? 'text-navy bg-white shadow-sm' : 'text-charcoal-400',
              )}
            >
              EN COURS (2)
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={cn(
                'rounded-lg px-6 py-2 text-xs font-bold transition-all',
                activeTab === 'history' ? 'text-navy bg-white shadow-sm' : 'text-charcoal-400',
              )}
            >
              TERMINÉES
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {TRANSACTIONS.map((tx) => (
            <div
              key={tx.id}
              className="border-charcoal-100 bg-charcoal-50/30 group rounded-[32px] border p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div className="flex items-center gap-4">
                  <div className="text-navy flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-charcoal font-bold">{tx.property}</span>
                      <Badge variant="outline" className="text-[8px] uppercase">
                        {tx.id}
                      </Badge>
                    </div>
                    <p className="text-charcoal-400 text-xs font-medium uppercase tracking-wider">
                      {tx.type} • {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-navy mb-1 text-2xl font-bold">{tx.amount}</p>
                  <p className="text-gold text-[10px] font-bold uppercase tracking-widest">
                    Comm. AfriBayit: {tx.commission}
                  </p>
                </div>
              </div>

              {/* Release Conditions - Section 7B.3.2 */}
              <div className="border-charcoal-100 rounded-2xl border bg-white p-6">
                <p className="text-charcoal-400 mb-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Conditions de Libération
                </p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {tx.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {cond.status === 'VALIDATED' ? (
                        <div className="bg-emerald/10 text-emerald flex h-6 w-6 items-center justify-center rounded-full">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      ) : (
                        <div className="bg-charcoal-100 text-charcoal-300 flex h-6 w-6 items-center justify-center rounded-full">
                          <Clock className="h-4 w-4" />
                        </div>
                      )}
                      <span
                        className={cn(
                          'text-[11px] font-bold uppercase tracking-wide',
                          cond.status === 'VALIDATED' ? 'text-charcoal' : 'text-charcoal-300',
                        )}
                      >
                        {cond.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <Button variant="ghost" size="sm" className="rounded-xl px-4 text-[10px] font-bold">
                  CONTACTER SUPPORT
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-danger text-danger hover:bg-danger/5 rounded-xl px-4 text-[10px] font-bold"
                >
                  SIGNYLER UN PROBLÈME
                </Button>
                <Button
                  disabled={tx.conditions.some((c) => c.status === 'PENDING')}
                  className="bg-navy rounded-xl px-6 text-[10px] font-bold"
                >
                  LIBÉRER LES FONDS
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Dispute Protocol - Section 7B.3.3 */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="border-charcoal-100 bg-charcoal-900 relative overflow-hidden rounded-[40px] p-8 text-white">
          <div className="bg-danger/5 absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
          <div className="relative z-10 space-y-6">
            <div className="text-danger flex items-center gap-3">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-serif text-xl font-bold text-white">Protocole de Litige</h3>
            </div>
            <p className="text-charcoal-400 text-sm leading-relaxed">
              En cas de désaccord, les fonds sont immédiatement gelés. Notre équipe d'arbitrage pays
              intervient sous 72h pour analyser les preuves et rendre une décision immuable.
            </p>
            <div className="space-y-4">
              {[
                'Gel immédiat des fonds',
                'Collecte de preuves (photos, contrats)',
                'Médiation assistée par IA',
                'Décision finale par Admin Pays',
              ].map((step, i) => (
                <div
                  key={i}
                  className="text-charcoal-300 flex items-center gap-3 text-xs font-medium"
                >
                  <div className="bg-gold h-1.5 w-1.5 rounded-full" />
                  {step}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="border-charcoal-100 space-y-6 rounded-[40px] bg-white p-8">
          <h3 className="text-charcoal font-serif text-xl font-bold">
            Sécurité Financière Multi-Niveaux
          </h3>
          <div className="space-y-4">
            {[
              {
                label: 'KYC/AML Niveaux 0-3',
                desc: "Vérification d'identité rigoureuse conforme BCEAO.",
              },
              {
                label: 'Logs immuables SHA-256',
                desc: 'Chaque mouvement est tracé et protégé contre toute altération.',
              },
              {
                label: 'Double Validation 2FA',
                desc: 'Toute libération de fonds requiert une validation biométrique ou OTP.',
              },
              {
                label: 'Ségrégation des fonds',
                desc: 'Comptes séquestres séparés des fonds opérationnels.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="bg-navy/5 text-navy flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-charcoal text-sm font-bold">{item.label}</p>
                  <p className="text-charcoal-400 text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
