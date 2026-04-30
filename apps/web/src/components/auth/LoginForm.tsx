'use client';
import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { Button, Input } from '@afribayit/ui';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@afribayit/ui/src/lib/cn';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
});
type LoginFormData = z.infer<typeof loginSchema>;

const magicSchema = z.object({
  email: z.string().email('Email invalide'),
});
type MagicFormData = z.infer<typeof magicSchema>;

type Tab = 'password' | 'magic';

export function LoginForm(): React.ReactElement {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('password');
  const [showPassword, setShowPassword] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const {
    register: regPwd,
    handleSubmit: handlePwd,
    formState: { errors: pwdErrors, isSubmitting: pwdSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onPasswordSubmit = async (data: LoginFormData): Promise<void> => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    if (result?.ok) {
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } else {
      toast.error('Email ou mot de passe incorrect.');
    }
  };

  const {
    register: regMagic,
    handleSubmit: handleMagic,
    formState: { errors: magicErrors, isSubmitting: magicSubmitting },
  } = useForm<MagicFormData>({ resolver: zodResolver(magicSchema) });

  const onMagicSubmit = async (data: MagicFormData): Promise<void> => {
    try {
      await api.auth.sendMagicLink(data.email);
      setMagicSent(true);
    } catch {
      toast.error("Erreur lors de l'envoi du lien. Réessayez.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-2xl md:p-10"
    >
      {/* Tab switcher */}
      <div className="bg-charcoal-50 border-charcoal-100 mb-8 flex gap-1 rounded-2xl border p-1.5">
        <button
          type="button"
          onClick={() => setTab('password')}
          className={cn(
            'flex-1 rounded-xl py-3 text-sm font-bold transition-all duration-300',
            tab === 'password'
              ? 'text-navy bg-white shadow-sm'
              : 'text-charcoal-400 hover:text-charcoal',
          )}
        >
          Mot de passe
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('magic');
            setMagicSent(false);
          }}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all duration-300',
            tab === 'magic'
              ? 'text-navy bg-white shadow-sm'
              : 'text-charcoal-400 hover:text-charcoal',
          )}
        >
          <Sparkles className="h-4 w-4" />
          Lien magique
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'password' ? (
          <motion.div
            key="password"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            <form
              onSubmit={(e) => {
                void handlePwd(onPasswordSubmit)(e);
              }}
              noValidate
              className="flex flex-col gap-5"
            >
              <div className="space-y-1">
                <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                  Adresse Email
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="exemple@afribayit.com"
                  className="bg-charcoal-50 h-14 rounded-2xl border-none transition-all focus:bg-white"
                  leftIcon={<Mail className="text-charcoal-300 h-5 w-5" />}
                  error={pwdErrors.email?.message}
                  {...regPwd('email')}
                />
              </div>

              <div className="space-y-1">
                <div className="ml-1 flex items-center justify-between">
                  <label className="text-charcoal-400 text-xs font-bold uppercase tracking-widest">
                    Mot de passe
                  </label>
                  <a
                    href="/mot-de-passe-oublie"
                    className="text-navy hover:text-gold text-[11px] font-bold transition-colors"
                  >
                    OUBLIÉ ?
                  </a>
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="bg-charcoal-50 h-14 rounded-2xl border-none transition-all focus:bg-white"
                  leftIcon={<Lock className="text-charcoal-300 h-5 w-5" />}
                  rightElement={
                    <button
                      type="button"
                      className="text-charcoal-300 hover:text-navy p-2 transition-colors"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  }
                  error={pwdErrors.password?.message}
                  {...regPwd('password')}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                className="shadow-navy/20 mt-2 h-14 rounded-2xl text-base font-bold shadow-xl"
                loading={pwdSubmitting}
              >
                SE CONNECTER
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="magic"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            {magicSent ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 shadow-inner">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
                <h3 className="text-charcoal text-xl font-bold">Vérifiez votre boîte mail</h3>
                <p className="text-charcoal-400 max-w-[280px] text-sm leading-relaxed">
                  Un lien de connexion magique vient de vous être envoyé. Il expire dans 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setMagicSent(false)}
                  className="text-navy hover:text-gold text-sm font-bold underline decoration-2 underline-offset-4 transition-colors"
                >
                  Renvoyer un lien
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  void handleMagic(onMagicSubmit)(e);
                }}
                noValidate
                className="flex flex-col gap-6"
              >
                <p className="text-charcoal-400 text-sm leading-relaxed">
                  Pas besoin de mot de passe. Recevez un lien de connexion instantané directement
                  sur votre email.
                </p>
                <div className="space-y-1">
                  <label className="text-charcoal-400 ml-1 text-xs font-bold uppercase tracking-widest">
                    Adresse Email
                  </label>
                  <Input
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="exemple@afribayit.com"
                    className="bg-charcoal-50 h-14 rounded-2xl border-none transition-all focus:bg-white"
                    leftIcon={<Mail className="text-charcoal-300 h-5 w-5" />}
                    error={magicErrors.email?.message}
                    {...regMagic('email')}
                  />
                </div>
                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  className="shadow-navy/20 h-14 rounded-2xl text-base font-bold shadow-xl"
                  loading={magicSubmitting}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  RECEVOIR LE LIEN
                </Button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-charcoal-100 mt-8 flex flex-col items-center gap-6 border-t pt-8">
        <p className="text-charcoal-400 text-sm font-medium">Ou continuez avec</p>

        <div className="grid w-full grid-cols-2 gap-4">
          <button className="bg-charcoal-50 hover:bg-charcoal-100 border-charcoal-100 text-charcoal flex items-center justify-center gap-3 rounded-2xl border py-3.5 text-sm font-bold transition-all">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
            </svg>
            GOOGLE
          </button>
          <button className="flex items-center justify-center gap-3 rounded-2xl bg-[#1877F2] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#166FE5]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            FACEBOOK
          </button>
        </div>

        <p className="text-charcoal-400 text-sm font-medium">
          Nouveau chez nous ?{' '}
          <a
            href="/inscription"
            className="text-navy hover:text-gold decoration-navy hover:decoration-gold font-bold decoration-2 underline-offset-4 transition-colors"
          >
            CRÉER UN COMPTE
          </a>
        </p>
      </div>
    </motion.div>
  );
}
