'use client';
import { motion } from 'framer-motion';
import { FileText, Users, CreditCard, ShieldCheck, Clock, ArrowRight, PenTool } from 'lucide-react';
import { Card, Badge, Button } from '@afribayit/ui';

export default function NotaryDashboard() {
  return (
    <div className="space-y-10 py-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-gold mb-2 text-[10px] font-bold uppercase tracking-[0.3em]">
            Office Notarial — Espace Certifié
          </p>
          <h1 className="text-charcoal font-serif text-4xl font-bold">Espace Notaire</h1>
        </div>
        <Badge variant="success" className="rounded-full px-4 py-1.5">
          NOTAIRE CERTIFIÉ AFRIBAYIT
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Dossiers Actifs', value: '12', icon: FileText, color: 'navy' },
          { label: 'Signatures en attente', value: '5', icon: PenTool, color: 'gold' },
          { label: 'Escrow Sécurisé', value: '145M FCFA', icon: CreditCard, color: 'navy' },
          { label: 'Actes Authentifiés', value: '128', icon: ShieldCheck, color: 'gold' },
        ].map((stat, i) => (
          <Card key={i} className="border-charcoal-100 rounded-[32px] p-6">
            <div
              className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${
                stat.color === 'navy' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold'
              }`}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-charcoal text-3xl font-bold">{stat.value}</p>
            <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="space-y-6 rounded-[40px] p-8 lg:col-span-2">
          <h3 className="text-charcoal font-serif text-2xl font-bold">
            Dossiers de Transaction — État Escrow
          </h3>
          <div className="space-y-4">
            {[
              {
                id: 'TRX-9921',
                client: 'Koffi Mensah',
                property: 'Villa Cocody',
                amount: '85M FCFA',
                status: 'NOTARY_IN_PROGRESS',
                timer: '12j restants',
              },
              {
                id: 'TRX-8842',
                client: 'Sarah Kone',
                property: 'Appart. Plateau',
                amount: '45M FCFA',
                status: 'FUNDED',
                timer: 'Assignation reçue',
              },
            ].map((tx) => (
              <div
                key={tx.id}
                className="bg-charcoal-50 border-charcoal-100 group flex items-center justify-between rounded-[32px] border p-6 transition-all hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="text-navy flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold shadow-sm">
                    {tx.client[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal font-bold">{tx.client}</span>
                      <Badge variant="outline" className="text-[8px]">
                        {tx.id}
                      </Badge>
                    </div>
                    <p className="text-charcoal-400 text-xs">
                      {tx.property} • {tx.amount}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <Badge variant={tx.status === 'FUNDED' ? 'success' : 'warning'}>
                      {tx.status}
                    </Badge>
                    <p className="text-gold mt-1 text-[10px] font-bold uppercase">{tx.timer}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-8">
          <Card className="bg-navy space-y-6 rounded-[40px] p-8 text-white">
            <h3 className="font-serif text-xl font-bold">Rédaction Assistée IA</h3>
            <p className="text-charcoal-300 text-xs leading-relaxed">
              Modèles d'actes authentiques conformes au droit OHADA et à la réforme foncière
              béninoise de 2023.
            </p>
            <Button
              fullWidth
              className="bg-gold hover:bg-gold-600 h-14 rounded-2xl border-none font-bold text-white"
            >
              OUVRIR L'ÉDITEUR IA
            </Button>
          </Card>

          <Card className="border-charcoal-100 space-y-6 rounded-[40px] p-8">
            <h3 className="text-charcoal font-serif text-xl font-bold">Ancrage Polygon</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald h-2 w-2 animate-pulse rounded-full" />
                <span className="text-charcoal text-xs font-bold uppercase tracking-widest">
                  Hash de l'acte certifié
                </span>
              </div>
              <div className="bg-charcoal-50 text-charcoal-400 break-all rounded-lg p-3 font-mono text-[10px]">
                0x71C7656EC7ab88b098defB751B7401B5f6d8976F
              </div>
              <p className="text-charcoal-400 text-[10px] italic">
                L'acte signé sera ancré sur la blockchain Polygon pour une opposabilité universelle.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
