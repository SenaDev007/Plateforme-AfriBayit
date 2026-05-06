'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button, Input } from '@afribayit/ui';

export default function ForgotPasswordPage(): React.ReactElement {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.auth.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12"
    >
      {sent ? (
        <div className="py-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="mb-2 font-serif text-2xl font-bold text-white">Email envoyé !</h2>
          <p className="mb-8 text-sm font-light text-white/50">
            Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un email
            avec les instructions.
          </p>
          <Button
            fullWidth
            size="lg"
            className="h-14 rounded-2xl font-bold"
            onClick={() => router.push('/connexion')}
          >
            Retour à la connexion
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-10 text-center">
            <h2 className="mb-2 font-serif text-3xl font-bold text-white">Mot de passe oublié ?</h2>
            <p className="text-sm font-light text-white/60">
              Saisissez votre email pour recevoir un lien de réinitialisation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="ADRESSE EMAIL"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              leftIcon={<Mail className="h-4 w-4" />}
            />

            {error && <p className="text-sm font-medium text-red-500">{error}</p>}

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="h-14 rounded-2xl font-bold"
            >
              ENVOYER LE LIEN
            </Button>
          </form>

          <p className="mt-8 text-center">
            <Link
              href="/connexion"
              className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> Retour à la connexion
            </Link>
          </p>
        </>
      )}
    </motion.div>
  );
}
