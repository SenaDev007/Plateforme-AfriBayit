'use client';
import type React from 'react';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Sparkles, CheckCircle } from 'lucide-react';
import { Button, Input, Card } from '@afribayit/ui';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

// ── Password login schema ─────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe : 8 caractères minimum'),
});
type LoginFormData = z.infer<typeof loginSchema>;

// ── Magic link schema ─────────────────────────────────────────────────────────
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

  // ── Password form ────────────────────────────────────────────────────────────
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

  // ── Magic link form ──────────────────────────────────────────────────────────
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
    <Card glass className="w-full">
      <h1 className="text-charcoal mb-6 text-center font-serif text-2xl font-bold">Connexion</h1>

      {/* OAuth buttons */}
      <div className="mb-6 flex flex-col gap-3">
        <button
          type="button"
          className="border-charcoal-200 text-charcoal hover:bg-charcoal-50 flex w-full items-center justify-center gap-3 rounded-lg border bg-white px-4 py-3 text-sm font-medium transition-colors"
          aria-label="Continuer avec Google"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continuer avec Google
        </button>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#1877F2] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#166FE5]"
          aria-label="Continuer avec Facebook"
        >
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          Continuer avec Facebook
        </button>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <div className="bg-charcoal-100 h-px flex-1" aria-hidden="true" />
        <span className="text-charcoal-400 text-xs">ou par email</span>
        <div className="bg-charcoal-100 h-px flex-1" aria-hidden="true" />
      </div>

      {/* Tab switcher */}
      <div className="bg-charcoal-50 mb-6 flex gap-1 rounded-xl p-1">
        <button
          type="button"
          onClick={() => setTab('password')}
          className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
            tab === 'password'
              ? 'text-navy bg-white shadow-sm'
              : 'text-charcoal-400 hover:text-charcoal'
          }`}
        >
          Mot de passe
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('magic');
            setMagicSent(false);
          }}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
            tab === 'magic'
              ? 'text-navy bg-white shadow-sm'
              : 'text-charcoal-400 hover:text-charcoal'
          }`}
        >
          <Sparkles className="h-3 w-3" />
          Lien magique
        </button>
      </div>

      {/* Password form */}
      {tab === 'password' && (
        <form
          onSubmit={(e) => {
            void handlePwd(onPasswordSubmit)(e);
          }}
          noValidate
          className="flex flex-col gap-4"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            leftIcon={<Mail className="h-4 w-4" />}
            error={pwdErrors.email?.message}
            {...regPwd('email')}
          />

          <Input
            label="Mot de passe"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            leftIcon={<Lock className="h-4 w-4" />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
            error={pwdErrors.password?.message}
            {...regPwd('password')}
          />

          <div className="flex justify-end">
            <a href="/mot-de-passe-oublie" className="text-navy text-xs hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <Button type="submit" fullWidth size="lg" loading={pwdSubmitting}>
            Se connecter
          </Button>
        </form>
      )}

      {/* Magic link form */}
      {tab === 'magic' && (
        <>
          {magicSent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-charcoal font-semibold">Vérifiez votre boîte mail !</p>
              <p className="text-charcoal-400 text-sm">
                Un lien de connexion valable <strong>15 minutes</strong> vous a été envoyé. Cliquez
                dessus pour vous connecter instantanément.
              </p>
              <button
                type="button"
                onClick={() => setMagicSent(false)}
                className="text-navy mt-2 text-xs hover:underline"
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
              className="flex flex-col gap-4"
            >
              <p className="text-charcoal-400 -mt-2 text-sm">
                Entrez votre email et recevez un lien de connexion instantané — sans mot de passe.
              </p>
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                required
                leftIcon={<Mail className="h-4 w-4" />}
                error={magicErrors.email?.message}
                {...regMagic('email')}
              />
              <Button type="submit" fullWidth size="lg" loading={magicSubmitting}>
                <Sparkles className="mr-2 h-4 w-4" />
                Recevoir le lien de connexion
              </Button>
            </form>
          )}
        </>
      )}

      <p className="text-charcoal-400 mt-5 text-center text-sm">
        Pas encore de compte ?{' '}
        <a href="/inscription" className="text-navy font-medium hover:underline">
          S'inscrire gratuitement
        </a>
      </p>
    </Card>
  );
}
