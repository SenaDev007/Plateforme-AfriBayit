'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import { OTPInput } from '@/components/auth/OTPInput';
import { Button } from '@afribayit/ui';

function VerifyContent(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (token) {
      setStatus('loading');
      api.auth
        .verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    }
  }, [token]);

  const handleOTPComplete = (code: string) => {
    setStatus('loading');
    // Simulate OTP verification
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  if (status === 'loading') {
    return (
      <div className="py-12 text-center">
        <Loader2 className="text-gold mx-auto mb-4 h-12 w-12 animate-spin" />
        <p className="font-light italic text-white/60">Validation de votre empreinte numérique…</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="py-8 text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-white">Email vérifié !</h2>
        <p className="mb-8 text-sm font-light text-white/50">
          Votre adresse email a été confirmée. Bienvenue dans l'écosystème AfriBayit.
        </p>
        <Button
          fullWidth
          size="lg"
          className="h-14 rounded-2xl font-bold"
          onClick={() => router.push('/dashboard')}
        >
          Accéder à mon espace
        </Button>
      </motion.div>
    );
  }

  if (status === 'error') {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <XCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-white">Lien invalide</h2>
        <p className="mb-8 text-sm font-light text-white/50">
          Ce lien de vérification est invalide ou a expiré.
        </p>
        <Button
          variant="outline"
          fullWidth
          size="lg"
          className="h-14 rounded-2xl border-white/10 text-white hover:bg-white/5"
          onClick={() => router.push('/connexion')}
        >
          Retour à la connexion
        </Button>
      </div>
    );
  }

  // IDLE state - Show OTP Input if no token
  return (
    <div className="space-y-10 py-6">
      <div className="text-center">
        <div className="bg-gold/20 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <Mail className="text-gold h-8 w-8" />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-white">Vérifiez votre boîte mail</h2>
        <p className="text-sm font-light text-white/60">
          Nous vous avons envoyé un code de sécurité à 6 chiffres.
        </p>
      </div>

      <OTPInput onComplete={handleOTPComplete} />

      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/40">
        Vérifiez également vos courriers indésirables
      </p>
    </div>
  );
}

export default function VerifyEmailPage(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12"
    >
      <Suspense
        fallback={<div className="py-20 text-center italic text-white/40">Initialisation…</div>}
      >
        <VerifyContent />
      </Suspense>
    </motion.div>
  );
}
