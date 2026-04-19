'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, User, Shield, Upload } from 'lucide-react';
import { Button, Input, Card, Badge } from '@afribayit/ui';
import toast from 'react-hot-toast';

const STEPS = [
  { id: 1, title: 'Compte', icon: User },
  { id: 2, title: 'Profil', icon: Shield },
  { id: 3, title: 'KYC', icon: Upload },
];

const ROLES = [
  { value: 'BUYER', label: '🏠 Acheteur', desc: 'Je cherche une propriété' },
  { value: 'SELLER', label: '💼 Vendeur', desc: 'Je veux vendre / louer' },
  { value: 'INVESTOR', label: '📈 Investisseur', desc: 'Je veux investir' },
  { value: 'TOURIST', label: '✈️ Touriste', desc: 'Je cherche un hébergement' },
  { value: 'ARTISAN', label: '🔨 Artisan', desc: 'Je propose mes services' },
];

const step1Schema = z.object({
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, '8 caractères minimum')
    .regex(/[A-Z]/, 'Au moins une majuscule')
    .regex(/[0-9]/, 'Au moins un chiffre'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
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
    <nav aria-label="Étapes d'inscription" className="mb-8">
      <ol className="flex items-center justify-center gap-0">
        {STEPS.map((step, idx) => {
          const isCompleted = step.id < current;
          const isCurrent = step.id === current;
          const Icon = step.icon;
          return (
            <li key={step.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? 'border-emerald bg-emerald text-white'
                      : isCurrent
                      ? 'border-navy bg-navy text-white'
                      : 'border-charcoal-200 bg-white text-charcoal-300'
                  }`}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isCurrent ? 'text-navy' : isCompleted ? 'text-emerald-600' : 'text-charcoal-300'
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={`mx-3 h-0.5 w-12 mb-5 transition-colors ${isCompleted ? 'bg-emerald' : 'bg-charcoal-100'}`}
                  aria-hidden="true"
                />
              )}
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
    // TODO: redirect to dashboard
  };

  return (
    <Card glass className="w-full">
      <StepIndicator current={step} />

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-serif text-xl font-bold text-charcoal mb-5">Créer votre compte</h2>
            <form onSubmit={(e) => { void form1.handleSubmit(onStep1)(e); }} noValidate className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                required
                error={form1.formState.errors.email?.message}
                {...form1.register('email')}
              />
              <Input
                label="Mot de passe"
                type="password"
                autoComplete="new-password"
                required
                error={form1.formState.errors.password?.message}
                hint="8+ caractères, 1 majuscule, 1 chiffre"
                {...form1.register('password')}
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                autoComplete="new-password"
                required
                error={form1.formState.errors.confirmPassword?.message}
                {...form1.register('confirmPassword')}
              />
              <Button type="submit" fullWidth size="lg" loading={form1.formState.isSubmitting}>
                Continuer <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-charcoal-400">
              Déjà un compte ?{' '}
              <a href="/connexion" className="text-navy font-medium hover:underline">Se connecter</a>
            </p>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-serif text-xl font-bold text-charcoal mb-5">Votre profil</h2>
            <form onSubmit={(e) => { void form2.handleSubmit(onStep2)(e); }} noValidate className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Prénom"
                  required
                  autoComplete="given-name"
                  error={form2.formState.errors.firstName?.message}
                  {...form2.register('firstName')}
                />
                <Input
                  label="Nom"
                  required
                  autoComplete="family-name"
                  error={form2.formState.errors.lastName?.message}
                  {...form2.register('lastName')}
                />
              </div>
              <Input
                label="Téléphone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+229 97…"
                error={form2.formState.errors.phone?.message}
                {...form2.register('phone')}
              />

              {/* Role selection */}
              <fieldset>
                <legend className="text-sm font-medium text-charcoal mb-2">
                  Je suis… <span className="text-danger" aria-hidden="true">*</span>
                </legend>
                <div className="grid grid-cols-1 gap-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => {
                        setSelectedRole(role.value);
                        void form2.setValue('role', role.value);
                      }}
                      aria-pressed={selectedRole === role.value}
                      className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                        selectedRole === role.value
                          ? 'border-navy bg-navy/5'
                          : 'border-charcoal-100 hover:border-navy/30'
                      }`}
                    >
                      <span className="text-lg" aria-hidden="true">{role.label.split(' ')[0]}</span>
                      <div>
                        <p className="text-sm font-medium text-charcoal">{role.label.split(' ').slice(1).join(' ')}</p>
                        <p className="text-xs text-charcoal-400">{role.desc}</p>
                      </div>
                      {selectedRole === role.value && (
                        <CheckCircle2 className="ml-auto h-4 w-4 text-navy flex-shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setStep(1)} type="button">
                  Retour
                </Button>
                <Button type="submit" fullWidth loading={form2.formState.isSubmitting}>
                  Continuer <ChevronRight className="h-4 w-4" aria-hidden="true" />
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
            transition={{ duration: 0.25 }}
          >
            <h2 className="font-serif text-xl font-bold text-charcoal mb-2">Vérification KYC</h2>
            <p className="text-sm text-charcoal-400 mb-5">
              Vérifiez votre identité pour accéder à toutes les fonctionnalités.
            </p>

            <div className="space-y-4">
              {/* CNI upload */}
              <div>
                <label className="text-sm font-medium text-charcoal mb-2 block">
                  Pièce d'identité (CNI ou Passeport)
                </label>
                <label
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-charcoal-200 p-6 cursor-pointer hover:border-navy/40 hover:bg-navy/5 transition-all"
                  aria-label="Télécharger votre pièce d'identité"
                >
                  <Upload className="h-8 w-8 text-charcoal-300" aria-hidden="true" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-charcoal">Cliquer pour télécharger</p>
                    <p className="text-xs text-charcoal-400">PNG, JPG jusqu'à 5 Mo</p>
                  </div>
                  <input type="file" accept="image/*,.pdf" className="sr-only" aria-hidden="true" />
                </label>
              </div>

              {/* Selfie */}
              <div>
                <label className="text-sm font-medium text-charcoal mb-2 block">Selfie avec la pièce</label>
                <label
                  className="flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-charcoal-200 p-6 cursor-pointer hover:border-navy/40 hover:bg-navy/5 transition-all"
                  aria-label="Télécharger votre selfie"
                >
                  <Upload className="h-8 w-8 text-charcoal-300" aria-hidden="true" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-charcoal">Selfie + pièce d'identité visible</p>
                    <p className="text-xs text-charcoal-400">Visage et pièce lisibles</p>
                  </div>
                  <input type="file" accept="image/*" className="sr-only" aria-hidden="true" />
                </label>
              </div>

              <div className="rounded-lg bg-gold/10 p-3 flex gap-2">
                <span className="text-gold" aria-hidden="true">ℹ️</span>
                <p className="text-xs text-charcoal-600">
                  Vos documents sont chiffrés et stockés de manière sécurisée.
                  La vérification prend généralement 24h ouvrées.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="ghost" onClick={() => setStep(2)} type="button">
                  Retour
                </Button>
                <Button fullWidth onClick={onFinish}>
                  Terminer l'inscription
                </Button>
              </div>

              <button
                type="button"
                className="w-full text-center text-sm text-charcoal-400 hover:text-navy transition-colors"
                onClick={onFinish}
              >
                Passer — vérifier plus tard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
