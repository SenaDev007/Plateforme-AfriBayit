'use client';
import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ChevronRight,
  User,
  Shield,
  Upload,
  Mail,
  Lock,
  Phone,
  Map,
  Building2,
  Briefcase,
  Camera,
} from 'lucide-react';
import { Button, Input } from '@afribayit/ui';
import toast from 'react-hot-toast';
import { cn } from '@afribayit/ui/src/lib/cn';

const STEPS = [
  { id: 1, title: 'Compte', icon: User },
  { id: 2, title: 'Profil', icon: Briefcase },
  { id: 3, title: 'KYC', icon: Shield },
];

const ROLES = [
  { value: 'BUYER', label: 'Acheteur', icon: Home, desc: 'Je cherche une propriété' },
  { value: 'SELLER', label: 'Vendeur', icon: Building2, desc: 'Je veux vendre / louer' },
  { value: 'INVESTOR', label: 'Investisseur', icon: Briefcase, desc: 'Je veux investir' },
  { value: 'ARTISAN', label: 'Artisan', icon: Map, desc: 'Je propose mes services' },
];

const step1Schema = z
  .object({
    email: z.string().email('Email invalide'),
    password: z
      .string()
      .min(8, '8 caractères minimum')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[0-9]/, 'Au moins un chiffre'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

const step2Schema = z.object({
  firstName: z.string().min(2, '2 caractères minimum'),
  lastName: z.string().min(2, '2 caractères minimum'),
  phone: z.string().min(8, 'Numéro invalide'),
  country: z.string().min(1, 'Pays requis'),
  role: z.string().min(1, 'Rôle requis'),
});

type Step1Data = z.infer<typeof step1Schema>;
type Step2Data = z.infer<typeof step2Schema>;

function StepIndicator({ current }: { current: number }): React.ReactElement {
  return (
    <nav aria-label="Étapes d'inscription" className="mb-12">
      <ol className="relative mx-auto flex max-w-md items-center justify-between">
        <div className="bg-charcoal-100 absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2" />
        {STEPS.map((step, idx) => {
          const isCompleted = step.id < current;
          const isCurrent = step.id === current;
          const Icon = step.icon;
          return (
            <li key={step.id} className="relative flex flex-col items-center gap-3">
              <motion.div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-2xl border-2 transition-all duration-500',
                  isCompleted
                    ? 'border-emerald bg-emerald shadow-emerald/20 text-white shadow-lg'
                    : isCurrent
                      ? 'border-navy bg-navy shadow-navy/20 scale-110 text-white shadow-xl'
                      : 'border-charcoal-200 text-charcoal-300 bg-white',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isCompleted ? <CheckCircle2 className="h-6 w-6" /> : <Icon className="h-5 w-5" />}
              </motion.div>
              <span
                className={cn(
                  'absolute -bottom-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest',
                  isCurrent ? 'text-navy' : isCompleted ? 'text-emerald-600' : 'text-charcoal-300',
                )}
              >
                {step.title}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function RegisterStepper(): React.ReactElement {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState('BUYER');

  const form1 = useForm<Step1Data>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Data>({ resolver: zodResolver(step2Schema) });

  const onStep1 = async (_data: Step1Data): Promise<void> => {
    setStep(2);
  };

  const onStep2 = async (_data: Step2Data): Promise<void> => {
    setStep(3);
  };

  const onFinish = (): void => {
    toast.success('Compte créé ! Bienvenue sur AfriBayit 🎉');
  };

  return (
    <div className="rounded-[40px] border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">Identifiants</h2>
              <p className="text-charcoal-400 text-sm">Commençons par sécuriser votre accès.</p>
            </div>

            <form
              onSubmit={(e) => {
                void form1.handleSubmit(onStep1)(e);
              }}
              noValidate
              className="space-y-5"
            >
              <div className="space-y-1">
                <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="nom@exemple.com"
                  className="bg-charcoal-50 h-14 rounded-2xl border-none focus:bg-white"
                  leftIcon={<Mail className="text-charcoal-300 h-5 w-5" />}
                  error={form1.formState.errors.email?.message}
                  {...form1.register('email')}
                />
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                    Mot de passe
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-charcoal-50 h-14 rounded-2xl border-none focus:bg-white"
                    leftIcon={<Lock className="text-charcoal-300 h-5 w-5" />}
                    error={form1.formState.errors.password?.message}
                    {...form1.register('password')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                    Confirmer
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-charcoal-50 h-14 rounded-2xl border-none focus:bg-white"
                    leftIcon={<CheckCircle2 className="text-charcoal-300 h-5 w-5" />}
                    error={form1.formState.errors.confirmPassword?.message}
                    {...form1.register('confirmPassword')}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  fullWidth
                  className="shadow-navy/20 h-14 rounded-2xl text-base font-bold shadow-xl"
                >
                  SUIVANT <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>

            <p className="text-charcoal-400 text-center text-sm font-medium">
              Déjà membre ?{' '}
              <a
                href="/connexion"
                className="text-navy hover:text-gold decoration-navy font-bold decoration-2 underline-offset-4 transition-colors"
              >
                SE CONNECTER
              </a>
            </p>
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
            <div>
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">Votre Profil</h2>
              <p className="text-charcoal-400 text-sm">Parlez-nous un peu de vous.</p>
            </div>

            <form
              onSubmit={(e) => {
                void form2.handleSubmit(onStep2)(e);
              }}
              noValidate
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                    Prénom
                  </label>
                  <Input
                    className="bg-charcoal-50 h-14 rounded-2xl border-none focus:bg-white"
                    error={form2.formState.errors.firstName?.message}
                    {...form2.register('firstName')}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                    Nom
                  </label>
                  <Input
                    className="bg-charcoal-50 h-14 rounded-2xl border-none focus:bg-white"
                    error={form2.formState.errors.lastName?.message}
                    {...form2.register('lastName')}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                  Téléphone
                </label>
                <Input
                  className="bg-charcoal-50 h-14 rounded-2xl border-none focus:bg-white"
                  leftIcon={<Phone className="text-charcoal-300 h-5 w-5" />}
                  placeholder="+229 97 00 00 00"
                  error={form2.formState.errors.phone?.message}
                  {...form2.register('phone')}
                />
              </div>

              <div className="space-y-3">
                <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                  Je suis un(e)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.value);
                        void form2.setValue('role', role.value);
                      }}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all duration-300',
                        selectedRole === role.value
                          ? 'border-navy bg-navy/5 shadow-inner'
                          : 'border-charcoal-100 hover:border-navy/30 bg-white',
                      )}
                    >
                      <role.icon
                        className={cn(
                          'h-6 w-6',
                          selectedRole === role.value ? 'text-navy' : 'text-charcoal-300',
                        )}
                      />
                      <span
                        className={cn(
                          'text-xs font-bold uppercase tracking-wider',
                          selectedRole === role.value ? 'text-navy' : 'text-charcoal-500',
                        )}
                      >
                        {role.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="ghost"
                  onClick={() => setStep(1)}
                  className="h-14 rounded-2xl px-8"
                >
                  Retour
                </Button>
                <Button
                  type="submit"
                  fullWidth
                  className="shadow-navy/20 h-14 rounded-2xl font-bold shadow-xl"
                >
                  CONTINUER
                </Button>
              </div>
            </form>
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
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Sécurité GeoTrust
              </h2>
              <p className="text-charcoal-400 mx-auto max-w-xs text-sm">
                Vérifiez votre identité pour débloquer les transactions escrow.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <label className="text-charcoal-400 ml-1 text-[10px] font-bold uppercase tracking-widest">
                  PIÈCE D'IDENTITÉ
                </label>
                <label className="border-charcoal-100 hover:bg-charcoal-50 group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 transition-all">
                  <div className="bg-charcoal-50 flex h-12 w-12 items-center justify-center rounded-full transition-all group-hover:bg-white group-hover:shadow-md">
                    <Upload className="text-charcoal-300 h-5 w-5" />
                  </div>
                  <span className="text-charcoal-400 text-[11px] font-bold uppercase">
                    CNI / Passeport
                  </span>
                  <input type="file" className="sr-only" />
                </label>
              </div>
              <div className="space-y-3">
                <label className="text-charcoal-400 ml-1 text-[10px] font-bold uppercase tracking-widest">
                  SELFIE VÉRIFICATION
                </label>
                <label className="border-charcoal-100 hover:bg-charcoal-50 group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed p-8 transition-all">
                  <div className="bg-charcoal-50 flex h-12 w-12 items-center justify-center rounded-full transition-all group-hover:bg-white group-hover:shadow-md">
                    <Camera className="text-charcoal-300 h-5 w-5" />
                  </div>
                  <span className="text-charcoal-400 text-[11px] font-bold uppercase">
                    Prendre un selfie
                  </span>
                  <input type="file" className="sr-only" />
                </label>
              </div>
            </div>

            <div className="bg-gold/5 border-gold/10 flex gap-4 rounded-2xl border p-4">
              <div className="bg-gold/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                <Shield className="text-gold h-5 w-5" />
              </div>
              <p className="text-charcoal-500 text-[11px] leading-relaxed">
                Vos données sont protégées par le standard AES-256. La vérification prend environ
                24h.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                fullWidth
                size="lg"
                className="shadow-navy/20 h-14 rounded-2xl text-base font-bold shadow-xl"
                onClick={onFinish}
              >
                TERMINER L'INSCRIPTION
              </Button>
              <button
                onClick={onFinish}
                className="text-charcoal-300 hover:text-navy text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Vérifier plus tard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
