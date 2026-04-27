'use client';
import type React from 'react';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ShieldCheck, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@afribayit/ui';
import { api } from '@/lib/api';
import Link from 'next/link';
import type { Route } from 'next';

const stripePromise = loadStripe(process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'] ?? '');

// ── Inner form — rendered inside <Elements> ───────────────────────────────────

function StripePaymentForm({ transactionId }: { transactionId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/dashboard/payer/${transactionId}/success`,
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Le paiement a échoué. Veuillez réessayer.');
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push('/dashboard/transactions' as Route);
    }, 2500);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle2 className="text-success h-14 w-14" />
        <h2 className="text-charcoal font-serif text-xl font-bold">Paiement confirmé !</h2>
        <p className="text-charcoal-400 text-sm">
          Vos fonds sont sécurisés en escrow. Le vendeur sera notifié.
        </p>
        <p className="text-charcoal-400 text-xs">Redirection en cours…</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
          fields: { billingDetails: { email: 'auto' } },
        }}
      />

      {error && (
        <div className="border-danger/20 bg-danger/5 flex items-start gap-2 rounded-lg border p-3">
          <XCircle className="text-danger mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-danger text-sm">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={!stripe || loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement en cours…
          </>
        ) : (
          'Confirmer le paiement'
        )}
      </Button>
    </form>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PayerPage(): React.ReactElement {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { data: session, status } = useSession();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchSecret = useCallback(async () => {
    if (status !== 'authenticated' || !session?.accessToken) return;
    try {
      const res = await api.transactions.getPaymentIntent(
        transactionId,
        session.accessToken as string,
      );
      setClientSecret(res.data.clientSecret);
    } catch {
      setLoadError('Impossible de charger les informations de paiement. Vérifiez le lien.');
    }
  }, [status, session, transactionId]);

  useEffect(() => {
    void fetchSecret();
  }, [fetchSecret]);

  if (status === 'loading' || (!clientSecret && !loadError)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="text-navy h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <XCircle className="text-danger h-12 w-12" />
        <p className="text-charcoal-400 text-sm">{loadError}</p>
        <Link href={'/dashboard/transactions' as Route}>
          <Button variant="outline" size="sm">
            Retour aux transactions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href={'/dashboard/transactions' as Route}
          className="text-charcoal-400 hover:text-charcoal transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-charcoal font-serif text-2xl font-bold">Finaliser le paiement</h1>
          <p className="text-charcoal-400 mt-0.5 text-sm">
            Paiement sécurisé par Stripe — fonds placés en escrow AfriBayit
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Stripe form */}
        <div className="border-charcoal-100 rounded-xl border bg-white p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: clientSecret!,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#003087',
                  borderRadius: '8px',
                  fontFamily: 'Inter, sans-serif',
                },
              },
            }}
          >
            <StripePaymentForm transactionId={transactionId} />
          </Elements>
        </div>

        {/* Trust signals sidebar */}
        <div className="flex flex-col gap-4">
          <div className="border-charcoal-100 rounded-xl border bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="text-navy h-5 w-5" />
              <h2 className="text-charcoal text-sm font-semibold">Protection escrow AfriBayit</h2>
            </div>
            <ul className="text-charcoal-400 space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
                Vos fonds sont bloqués jusqu'à confirmation de réception
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
                Remboursement possible en cas de litige
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
                Le vendeur reçoit ses fonds via Mobile Money (FedaPay)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
                Paiement chiffré SSL — données jamais stockées
              </li>
            </ul>
          </div>

          <div className="border-charcoal-100 bg-charcoal-50 text-charcoal-400 rounded-xl border p-4 text-xs">
            <p className="text-charcoal mb-1 font-medium">Comment ça marche ?</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Vous payez par carte via Stripe</li>
              <li>Les fonds sont sécurisés en escrow</li>
              <li>Vous confirmez la transaction</li>
              <li>Le vendeur est payé automatiquement en Mobile Money</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
