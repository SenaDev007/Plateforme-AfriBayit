'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

type State = 'verifying' | 'success' | 'error';

export default function MagicLinkVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<State>('verifying');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setState('error');
      return;
    }

    void (async () => {
      const result = await signIn('magic-link', {
        token,
        redirect: false,
      });

      if (result?.ok && !result.error) {
        setState('success');
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setState('error');
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="bg-hero flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-10 text-center shadow-2xl">
        <a href="/" className="mb-8 inline-block">
          <span className="font-serif text-3xl font-bold">
            <span className="text-navy">Afri</span>
            <span className="text-gold">Bayit</span>
          </span>
        </a>

        {state === 'verifying' && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="text-navy h-12 w-12 animate-spin" />
            <p className="text-lg font-semibold text-slate-700">Vérification du lien…</p>
            <p className="text-sm text-slate-400">Veuillez patienter quelques secondes.</p>
          </div>
        )}

        {state === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <p className="text-lg font-semibold text-slate-700">Connexion réussie !</p>
            <p className="text-sm text-slate-400">Vous êtes redirigé vers votre tableau de bord…</p>
          </div>
        )}

        {state === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-semibold text-slate-700">Lien invalide ou expiré</p>
            <p className="text-sm text-slate-400">
              Ce lien de connexion a expiré ou a déjà été utilisé. Les liens sont valables 15
              minutes.
            </p>
            <Link
              href="/connexion"
              className="bg-navy hover:bg-navy/90 mt-2 inline-block rounded-full px-6 py-2.5 text-sm font-semibold text-white"
            >
              Retourner à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
