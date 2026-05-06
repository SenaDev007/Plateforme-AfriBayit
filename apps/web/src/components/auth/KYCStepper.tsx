'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  FileText,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Smartphone,
  Fingerprint,
} from 'lucide-react';
import { Button, Card } from '@afribayit/ui';
import { cn } from '@afribayit/ui/src/lib/cn';

const KYC_STEPS = [
  { id: 1, title: 'Document', icon: FileText },
  { id: 2, title: 'Téléchargement', icon: Upload },
  { id: 3, title: 'Biométrie', icon: Camera },
  { id: 4, title: 'Validation', icon: ShieldCheck },
];

const DOCUMENT_TYPES = [
  { id: 'PASSPORT', label: 'Passeport International', desc: 'Le plus recommandé pour la diaspora' },
  {
    id: 'ID_CARD',
    label: "Carte d'Identité Nationale",
    desc: 'Document officiel en cours de validité',
  },
  {
    id: 'DRIVER_LICENSE',
    label: 'Permis de Conduire',
    desc: 'Uniquement pour les résidents locaux',
  },
];

export function KYCStepper({ onComplete }: { onComplete?: () => void }): React.ReactElement {
  const [step, setStep] = useState(1);
  const [docType, setDocType] = useState<string | null>(null);
  const [files, setFiles] = useState<{ front: File | null; back: File | null }>({
    front: null,
    back: null,
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleDocTypeSelect = (type: string) => {
    setDocType(type);
    nextStep();
  };

  const handleFileUpload = (side: 'front' | 'back', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [side]: file }));
  };

  const handleVerify = () => {
    setIsVerifying(true);
    // Simulate API call for verification
    setTimeout(() => {
      setIsVerifying(false);
      nextStep();
      if (onComplete) onComplete();
    }, 3000);
  };

  return (
    <div className="mx-auto max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="bg-gold/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <ShieldCheck className="text-gold h-8 w-8" />
        </div>
        <h2 className="mb-2 font-serif text-3xl font-bold text-white">Vérification KYC</h2>
        <p className="text-sm font-light text-white/60">
          Sécurisez vos transactions immobilières avec la vérification d'identité
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-12 flex items-center justify-between px-4">
        <div className="absolute left-4 right-4 top-1/2 -z-10 h-1 -translate-y-1/2 bg-white/10" />
        <div
          className="bg-gold absolute left-4 top-1/2 -z-10 h-1 -translate-y-1/2 transition-all duration-700"
          style={{ width: `${((step - 1) / (KYC_STEPS.length - 1)) * 100}%` }}
        />
        {KYC_STEPS.map((s) => {
          const isActive = s.id === step;
          const isCompleted = s.id < step;
          return (
            <div key={s.id} className="relative flex flex-col items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500',
                  isActive
                    ? 'bg-navy border-gold text-gold scale-125 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                    : isCompleted
                      ? 'bg-gold border-gold text-navy'
                      : 'bg-charcoal-900 border-white/20 text-white/40',
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
              </div>
              <span
                className={cn(
                  'absolute -bottom-6 whitespace-nowrap text-[8px] font-bold uppercase tracking-widest',
                  isActive ? 'text-gold' : 'text-white/40',
                )}
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Steps Content */}
      <div className="min-h-[350px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h3 className="mb-6 text-xl font-bold text-white">Sélectionnez votre document</h3>
              <div className="grid gap-4">
                {DOCUMENT_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleDocTypeSelect(type.id)}
                    className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-all hover:bg-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gold/10 group-hover:bg-gold/20 rounded-xl p-3 transition-colors">
                        <FileText className="text-gold h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-bold text-white">{type.label}</p>
                        <p className="text-xs text-white/40">{type.desc}</p>
                      </div>
                    </div>
                    <ChevronRight className="group-hover:text-gold h-5 w-5 text-white/20 transition-all group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="mb-6 flex items-center gap-2">
                <button
                  onClick={prevStep}
                  className="text-white/40 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-white">Téléchargement du document</h3>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Front Side */}
                <div className="space-y-3">
                  <p className="ml-1 text-xs font-bold uppercase tracking-wider text-white/60">
                    Recto / Face
                  </p>
                  <label
                    className={cn(
                      'hover:border-gold/50 hover:bg-gold/5 flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-white/20 bg-white/5 transition-all',
                      files.front && 'border-emerald-500/50 bg-emerald-500/5',
                    )}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload('front', e)}
                      accept="image/*"
                    />
                    {files.front ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        <span className="text-xs font-medium text-white">{files.front.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Camera className="h-10 w-10 text-white/40" />
                        <span className="text-xs text-white/40">Prendre en photo</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Back Side */}
                <div className="space-y-3">
                  <p className="ml-1 text-xs font-bold uppercase tracking-wider text-white/60">
                    Verso / Dos
                  </p>
                  <label
                    className={cn(
                      'hover:border-gold/50 hover:bg-gold/5 flex h-48 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-white/20 bg-white/5 transition-all',
                      files.back && 'border-emerald-500/50 bg-emerald-500/5',
                    )}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileUpload('back', e)}
                      accept="image/*"
                    />
                    {files.back ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        <span className="text-xs font-medium text-white">{files.back.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <Upload className="h-10 w-10 text-white/40" />
                        <span className="text-xs text-white/40">Uploader le fichier</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={nextStep}
                disabled={!files.front || (docType !== 'PASSPORT' && !files.back)}
                className="h-16 rounded-[24px] text-lg font-bold"
              >
                CONTINUER
              </Button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h3 className="mb-4 text-xl font-bold text-white">Reconnaissance Biométrique</h3>
                <p className="mb-10 text-sm text-white/40">
                  Placez votre visage au centre du cercle pour la validation 3D
                </p>
              </div>

              <div className="relative mx-auto h-64 w-64">
                <div className="animate-spin-slow absolute inset-0 rounded-full border-4 border-dashed border-white/20" />
                <div className="border-gold/50 bg-charcoal-900 absolute inset-4 flex items-center justify-center rounded-full border-2">
                  <Camera className="text-gold h-12 w-12 animate-pulse" />
                </div>
                {/* Visual Scanning Effect */}
                <motion.div
                  className="bg-gold absolute left-0 right-0 top-0 h-1 shadow-[0_0_15px_rgba(212,175,55,1)]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  fullWidth
                  size="lg"
                  loading={isVerifying}
                  onClick={handleVerify}
                  className="h-16 rounded-[24px] text-lg font-bold"
                >
                  DÉMARRER LE SCAN
                </Button>
                <p className="flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-widest text-white/40">
                  <Fingerprint className="h-3 w-3" /> Chiffrement de bout en bout AES-256
                </p>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center"
            >
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>
              <h3 className="mb-4 text-3xl font-bold text-white">Identité Vérifiée !</h3>
              <p className="mx-auto mb-12 max-w-sm text-white/60">
                Votre profil est désormais certifié. Vous pouvez effectuer vos transactions en toute
                sérénité sur AfriBayit.
              </p>
              <Button
                fullWidth
                size="lg"
                variant="gold"
                className="h-16 rounded-[24px] text-lg font-bold"
                onClick={() => (window.location.href = '/dashboard')}
              >
                ACCÉDER À MON TABLEAU DE BORD
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      {step < 4 && (
        <div className="mt-12 flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-4">
          <AlertCircle className="text-gold h-5 w-5 shrink-0" />
          <p className="text-[10px] leading-relaxed text-white/40">
            Vos données sont protégées par le RGPD et stockées sur des serveurs hautement sécurisés.
            AfriBayit ne partage jamais vos documents avec des tiers non autorisés.
          </p>
        </div>
      )}
    </div>
  );
}
