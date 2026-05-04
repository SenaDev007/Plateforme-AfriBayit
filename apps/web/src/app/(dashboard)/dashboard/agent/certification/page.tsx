'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Upload, FileCheck, Search, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Button, Card, Badge } from '@afribayit/ui';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Documents', icon: Upload },
  { id: 2, title: 'Vérification IA', icon: Search },
  { id: 3, title: 'Validation Humaine', icon: FileCheck },
  { id: 4, title: 'Certification', icon: CheckCircle2 },
];

export default function AgentCertificationPage() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<'IDLE' | 'PENDING' | 'VERIFIED'>('IDLE');

  const handleUpload = () => {
    toast.success('Documents téléchargés. Analyse IA en cours...');
    setStep(2);
    setTimeout(() => {
      setStep(3);
      setStatus('PENDING');
      toast.success('Vérification IA réussie. En attente de validation humaine (24-72h).');
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-10">
      <div>
        <h1 className="text-charcoal font-serif text-3xl font-bold">
          Certification Agent Certifié AfriBayit
        </h1>
        <p className="text-charcoal-400">
          Section 5.0.1 — Accédez au badge de confiance et aux outils professionnels.
        </p>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between">
        <div className="bg-charcoal-100 absolute left-0 right-0 top-1/2 -z-10 h-0.5 -translate-y-1/2" />
        {STEPS.map((s) => (
          <div key={s.id} className="flex flex-col items-center gap-2 bg-white px-4">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                step >= s.id
                  ? 'bg-navy border-navy text-white'
                  : 'border-charcoal-200 text-charcoal-300 bg-white'
              }`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-widest ${
                step >= s.id ? 'text-navy' : 'text-charcoal-300'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="space-y-6 rounded-[32px] p-8 md:col-span-2">
          {step === 1 && status === 'IDLE' && (
            <div className="space-y-6">
              <div className="bg-navy/5 flex gap-4 rounded-2xl p-6">
                <Shield className="text-navy h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="text-navy text-sm font-bold">Principe de Confiance</p>
                  <p className="text-charcoal-500 text-xs">
                    Aucun bien ne peut être publié sans certification. Vos documents seront analysés
                    par notre IA GeoTrust.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border-charcoal-200 hover:border-navy cursor-pointer space-y-4 rounded-[32px] border-2 border-dashed p-10 text-center transition-all">
                  <div className="bg-charcoal-50 mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                    <Upload className="text-charcoal-400 h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-charcoal font-bold">
                      Attestation d'Agent Immobilier / Registre Commerce
                    </p>
                    <p className="text-charcoal-400 text-xs">PDF, JPG ou PNG (Max 10MB)</p>
                  </div>
                  <Button variant="outline" onClick={handleUpload}>
                    SÉLECTIONNER LE FICHIER
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-charcoal-50 border-charcoal-100 flex items-center justify-between rounded-2xl border p-4">
                    <span className="text-charcoal text-xs font-medium">Pièce d'Identité</span>
                    <Badge variant="outline">Requis</Badge>
                  </div>
                  <div className="bg-charcoal-50 border-charcoal-100 flex items-center justify-between rounded-2xl border p-4">
                    <span className="text-charcoal text-xs font-medium">Photo Selfie IA</span>
                    <Badge variant="outline">Requis</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'PENDING' && (
            <div className="space-y-6 py-20 text-center">
              <div className="relative mx-auto h-24 w-24">
                <div className="border-gold/20 absolute inset-0 rounded-full border-4" />
                <div className="border-gold absolute inset-0 animate-spin rounded-full border-4 border-t-transparent" />
                <Clock className="text-gold absolute inset-0 m-auto h-10 w-10" />
              </div>
              <div>
                <h3 className="text-charcoal text-2xl font-bold">Vérification en cours</h3>
                <p className="text-charcoal-400 mx-auto max-w-sm">
                  Notre équipe locale au Bénin examine vos documents. Vous recevrez une notification
                  sous 24-72h.
                </p>
              </div>
              <Badge variant="warning" className="px-6 py-2 text-sm">
                EN ATTENTE DE VALIDATION
              </Badge>
            </div>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="bg-charcoal-900 rounded-[32px] border-none p-6 text-white">
            <h4 className="mb-4 font-serif text-xl font-bold">Pourquoi se certifier ?</h4>
            <ul className="space-y-4">
              {[
                'Badge "Agent Certifié" visible',
                "Publication d'annonces illimitées",
                'Accès au dashboard professionnel',
                'Visibilité priorité dans les recherches',
                'Outils de pricing IA',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald mt-1 h-4 w-4 flex-shrink-0" />
                  <span className="text-charcoal-300 text-xs">{item}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border-gold/20 bg-gold/5 rounded-[32px] p-6">
            <div className="mb-3 flex items-center gap-3">
              <AlertCircle className="text-gold h-5 w-5" />
              <h4 className="text-charcoal text-sm font-bold">Documents par Pays</h4>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-navy text-[10px] font-bold uppercase">Bénin</p>
                <p className="text-charcoal-500 text-[10px]">
                  Titre Foncier ou ACD requis pour toute publication.
                </p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm">
                <p className="text-navy text-[10px] font-bold uppercase">Côte d'Ivoire</p>
                <p className="text-charcoal-500 text-[10px]">Lettre d'Attribution ou ACD requis.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
