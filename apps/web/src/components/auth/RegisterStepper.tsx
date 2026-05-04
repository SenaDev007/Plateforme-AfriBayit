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
  Home,
  Bell,
  Sparkles,
  Target,
  Globe,
  MessageSquare,
  Eye,
} from 'lucide-react';
import { Button, Input } from '@afribayit/ui';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { cn } from '@afribayit/ui/src/lib/cn';

const STEPS = [
  { id: 1, title: 'Bienvenue', icon: Home },
  { id: 2, title: 'Profil', icon: User },
  { id: 3, title: 'Cibles', icon: Map },
  { id: 4, title: 'Budget', icon: Briefcase },
  { id: 5, title: 'Alertes', icon: Bell },
  { id: 6, title: 'Tour', icon: Eye },
  { id: 7, title: 'IA', icon: Sparkles },
];

const ROLES = [
  { value: 'BUYER', label: 'Acheteur', icon: Home, desc: 'Je cherche une propriété' },
  { value: 'SELLER', label: 'Vendeur', icon: Building2, desc: 'Je veux vendre / louer' },
  { value: 'INVESTOR', label: 'Investisseur', icon: Briefcase, desc: 'Je veux investir' },
  { value: 'TOURIST', label: 'Touriste', icon: Map, desc: 'Je voyage en Afrique' },
  { value: 'ARTISAN', label: 'Artisan', icon: Briefcase, desc: 'Je propose mes services' },
  {
    value: 'GUESTHOUSE_OWNER',
    label: 'Guesthouse',
    icon: Building2,
    desc: 'Je gère une guesthouse',
  },
];

const COUNTRIES = [
  { id: 'bj', label: 'Bénin', flag: '🇧🇯' },
  { id: 'ci', label: "Côte d'Ivoire", flag: '🇨🇮' },
  { id: 'sn', label: 'Sénégal', flag: '🇸🇳' },
  { id: 'tg', label: 'Togo', flag: '🇹🇬' },
  { id: 'bf', label: 'Burkina Faso', flag: '🇧🇫' },
];

const schema = z.object({
  // Step 1
  email: z.string().email('Email invalide'),
  password: z
    .string()
    .min(8, '8 caractères minimum')
    .regex(/[A-Z]/, 'Une majuscule')
    .regex(/[0-9]/, 'Un chiffre'),
  // Step 2
  firstName: z.string().min(2, 'Trop court'),
  lastName: z.string().min(2, 'Trop court'),
  phone: z.string().optional(),
  role: z.string().default('BUYER'),
  // Step 3
  geoPreferences: z.array(z.string()).min(1, 'Sélectionnez au moins un pays'),
  // Step 4
  budgetMin: z.number().optional(),
  budgetMax: z.number().optional(),
  objectives: z.string().optional(),
  // Step 5
  emailAlerts: z.boolean().default(true),
  whatsappAlerts: z.boolean().default(false),
  // Step 7
  aiAssistantEnabled: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

function StepIndicator({ current }: { current: number }): React.ReactElement {
  return (
    <nav aria-label="Onboarding" className="mb-12">
      <ol className="relative mx-auto flex max-w-2xl items-center justify-between">
        <div className="bg-charcoal-100 absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2" />
        {STEPS.map((step) => {
          const isCompleted = step.id < current;
          const isCurrent = step.id === current;
          const Icon = step.icon;
          return (
            <li key={step.id} className="relative flex flex-col items-center">
              <motion.div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl border-2 transition-all duration-500',
                  isCompleted
                    ? 'bg-emerald border-emerald text-white'
                    : isCurrent
                      ? 'bg-navy border-navy scale-110 text-white shadow-lg'
                      : 'border-charcoal-200 text-charcoal-300 bg-white',
                )}
              >
                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
              </motion.div>
              <span
                className={cn(
                  'absolute -bottom-6 hidden text-[8px] font-bold uppercase tracking-widest md:block',
                  isCurrent ? 'text-navy' : 'text-charcoal-300',
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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      geoPreferences: ['bj'],
      role: 'BUYER',
      emailAlerts: true,
      aiAssistantEnabled: true,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedRole = watch('role');
  const selectedGeos = watch('geoPreferences');

  const onNext = () => setStep((s) => s + 1);
  const onPrev = () => setStep((s) => s - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await api.auth.register({
        ...data,
        country: data.geoPreferences[0], // Primary country
      });

      toast.success('Bienvenue sur AfriBayit ! Votre profil est prêt.');

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.ok) window.location.href = '/dashboard';
      else window.location.href = '/connexion';
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-[40px] border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
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
            <div className="text-center">
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Bienvenue sur AfriBayit
              </h2>
              <p className="text-charcoal-400 text-sm">
                Commençons par créer votre accès sécurisé.
              </p>
            </div>
            <div className="space-y-4">
              <Input
                label="EMAIL"
                placeholder="exemple@mail.com"
                leftIcon={<Mail className="h-4 w-4" />}
                {...register('email')}
                error={errors.email?.message}
              />
              <Input
                label="MOT DE PASSE"
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock className="h-4 w-4" />}
                {...register('password')}
                error={errors.password?.message}
              />
            </div>
            <Button
              fullWidth
              size="lg"
              onClick={onNext}
              className="shadow-navy/10 h-14 rounded-2xl font-bold shadow-xl"
            >
              CONTINUER
            </Button>
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
            <div className="text-center">
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Quel est votre profil ?
              </h2>
              <p className="text-charcoal-400 text-sm">Nous personnaliserons votre expérience.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="PRÉNOM" {...register('firstName')} error={errors.firstName?.message} />
              <Input label="NOM" {...register('lastName')} error={errors.lastName?.message} />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setValue('role', r.value)}
                  className={cn(
                    'flex flex-col items-center gap-2 rounded-2xl border p-4 transition-all',
                    selectedRole === r.value
                      ? 'bg-navy/5 border-navy text-navy'
                      : 'border-charcoal-100 bg-white',
                  )}
                >
                  <r.icon className="h-5 w-5" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{r.label}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onPrev} className="h-14 rounded-2xl px-8">
                RETOUR
              </Button>
              <Button fullWidth onClick={onNext} className="h-14 rounded-2xl font-bold shadow-lg">
                SUIVANT
              </Button>
            </div>
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
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">Zones Cibles</h2>
              <p className="text-charcoal-400 text-sm">Quels pays vous intéressent le plus ?</p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    const current = selectedGeos || [];
                    const next = current.includes(c.id)
                      ? current.filter((id) => id !== c.id)
                      : [...current, c.id];
                    setValue('geoPreferences', next);
                  }}
                  className={cn(
                    'flex items-center justify-between rounded-2xl border p-4 transition-all',
                    selectedGeos?.includes(c.id)
                      ? 'bg-navy/5 border-navy'
                      : 'border-charcoal-100 bg-white',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.flag}</span>
                    <span className="text-charcoal font-bold">{c.label}</span>
                  </div>
                  {selectedGeos?.includes(c.id) && <CheckCircle2 className="text-navy h-5 w-5" />}
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onPrev} className="h-14 rounded-2xl px-8">
                RETOUR
              </Button>
              <Button fullWidth onClick={onNext} className="h-14 rounded-2xl font-bold shadow-lg">
                SUIVANT
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Budget & Objectifs
              </h2>
              <p className="text-charcoal-400 text-sm">
                Aidez-nous à trouver les meilleures opportunités.
              </p>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="BUDGET MIN (FCFA)"
                  type="number"
                  placeholder="0"
                  {...register('budgetMin', { valueAsNumber: true })}
                />
                <Input
                  label="BUDGET MAX (FCFA)"
                  type="number"
                  placeholder="50 000 000"
                  {...register('budgetMax', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-charcoal-400 ml-1 text-[10px] font-bold uppercase tracking-widest">
                  VOTRE OBJECTIF PRINCIPAL
                </label>
                <textarea
                  {...register('objectives')}
                  className="bg-charcoal-50 focus:ring-navy h-32 w-full rounded-2xl border-none p-4 text-sm transition-all focus:ring-2"
                  placeholder="Ex: Investissement locatif à Cotonou..."
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onPrev} className="h-14 rounded-2xl px-8">
                RETOUR
              </Button>
              <Button fullWidth onClick={onNext} className="h-14 rounded-2xl font-bold shadow-lg">
                SUIVANT
              </Button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Alertes & Notifications
              </h2>
              <p className="text-charcoal-400 text-sm">Ne manquez aucune opportunité.</p>
            </div>
            <div className="space-y-4">
              <div className="bg-charcoal-50 flex items-center justify-between rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <Mail className="text-navy h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-charcoal text-sm font-bold">Email</p>
                    <p className="text-charcoal-400 text-xs">Annonces, Rapports, Offres</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  {...register('emailAlerts')}
                  className="text-navy focus:ring-navy h-6 w-6 rounded-lg"
                />
              </div>
              <div className="bg-charcoal-50 flex items-center justify-between rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">
                    <MessageSquare className="text-emerald h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-charcoal text-sm font-bold">WhatsApp</p>
                    <p className="text-charcoal-400 text-xs">Alertes instantanées 24/7</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  {...register('whatsappAlerts')}
                  className="text-navy focus:ring-navy h-6 w-6 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onPrev} className="h-14 rounded-2xl px-8">
                RETOUR
              </Button>
              <Button fullWidth onClick={onNext} className="h-14 rounded-2xl font-bold shadow-lg">
                SUIVANT
              </Button>
            </div>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Tour Guidé Interactif
              </h2>
              <p className="text-charcoal-400 text-sm">
                Découvrez l'interface de nouvelle génération.
              </p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="bg-navy/5 border-navy/10 space-y-3 rounded-[32px] border p-6">
                  <Globe className="text-navy h-6 w-6" />
                  <p className="text-xs font-bold uppercase tracking-wider">Globe 3D</p>
                  <p className="text-charcoal-500 text-[10px]">
                    Visualisez les opportunités sur notre globe interactif Three.js.
                  </p>
                </div>
                <div className="bg-gold/5 border-gold/10 space-y-3 rounded-[32px] border p-6">
                  <Eye className="text-gold h-6 w-6" />
                  <p className="text-xs font-bold uppercase tracking-wider">Visites VR</p>
                  <p className="text-charcoal-500 text-[10px]">
                    Immergez-vous dans les propriétés grâce à la réalité virtuelle.
                  </p>
                </div>
              </div>
              <div className="bg-charcoal-50 flex items-center gap-4 rounded-[32px] p-6">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <Shield className="text-charcoal h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider">Sécurité GeoTrust</p>
                  <p className="text-charcoal-400 text-[10px]">
                    Vos fonds sont sécurisés par escrow et KYC (obligatoire pour transactions).
                  </p>
                </div>
                <CheckCircle2 className="text-emerald h-5 w-5" />
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={onPrev} className="h-14 rounded-2xl px-8">
                RETOUR
              </Button>
              <Button fullWidth onClick={onNext} className="h-14 rounded-2xl font-bold shadow-lg">
                COMMENCER LE TOUR
              </Button>
            </div>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center">
              <div className="bg-gold/10 mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                <Sparkles className="text-gold h-10 w-10" />
              </div>
              <h2 className="text-charcoal mb-2 font-serif text-3xl font-bold">
                Assistant AfriBayit AI
              </h2>
              <p className="text-charcoal-400 text-sm">
                Voulez-vous activer votre assistant personnel IA ?
              </p>
            </div>
            <div className="border-gold/20 bg-gold/5 space-y-4 rounded-[32px] border-2 p-6">
              <p className="text-charcoal-600 text-xs font-medium italic">
                "Bonjour, je suis votre assistant. Je peux analyser le ROI des annonces, suggérer
                des artisans et gérer vos visites à votre place."
              </p>
              <div className="flex items-center justify-between">
                <span className="text-navy text-sm font-bold uppercase tracking-wider">
                  Activer l'assistant IA
                </span>
                <input
                  type="checkbox"
                  {...register('aiAssistantEnabled')}
                  className="text-gold focus:ring-gold h-6 w-6 rounded-lg"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Button
                fullWidth
                size="lg"
                loading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                className="shadow-navy/20 h-16 rounded-[24px] text-lg font-bold shadow-2xl"
              >
                DÉCOUVRIR MA PLATEFORME
              </Button>
              <button
                onClick={onPrev}
                className="text-charcoal-300 hover:text-navy text-[10px] font-bold uppercase tracking-[0.2em] transition-colors"
              >
                Retour aux réglages
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
