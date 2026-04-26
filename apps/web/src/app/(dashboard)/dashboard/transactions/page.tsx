'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, ArrowDownRight, ArrowUpRight, AlertTriangle, X, ShieldCheck } from 'lucide-react';
import { Badge, Button } from '@afribayit/ui';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { api } from '@/lib/api';

interface TxUser {
  id: string;
  firstName: string;
  lastName: string;
}

interface ApiTransaction {
  id: string;
  reference: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  paymentMethod: string | null;
  buyerId: string;
  sellerId: string;
  createdAt: string;
  property: { title: string; slug: string } | null;
  buyer: TxUser;
  seller: TxUser;
  escrowAccount: { balance: string; currency: string } | null;
}

const STATUS_LABELS: Record<string, string> = {
  INITIATED: 'Initié',
  FUNDED: 'En escrow',
  VALIDATED: 'Validé',
  RELEASED: 'Libéré',
  COMPLETED: 'Terminé',
  DISPUTED: 'En litige',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
};
const STATUS_VARIANTS: Record<string, 'default' | 'sky' | 'gold' | 'success' | 'danger'> = {
  INITIATED: 'default',
  FUNDED: 'sky',
  VALIDATED: 'gold',
  RELEASED: 'success',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  CANCELLED: 'danger',
  REFUNDED: 'default',
};

const TYPE_LABELS: Record<string, string> = {
  PROPERTY_PURCHASE: 'Achat immobilier',
  PROPERTY_RENT: 'Location',
  HOTEL_BOOKING: 'Hôtel',
  ARTISAN_SERVICE: 'Artisan',
  COURSE_ENROLLMENT: 'Formation',
};

const DISPUTE_REASONS = [
  "Bien non conforme à l'annonce",
  'Vendeur non coopératif',
  'Documents manquants ou falsifiés',
  'Problème de livraison / transfert',
  'Autre raison',
];

function formatAmount(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} M ${currency}`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} k ${currency}`;
  return `${num.toLocaleString('fr-FR')} ${currency}`;
}

interface DisputeModalProps {
  tx: ApiTransaction;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

function DisputeModal({ tx, token, onClose, onSuccess }: DisputeModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError('Veuillez sélectionner une raison.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.disputes.open(tx.id, { reason, ...(description ? { description } : {}) }, token);
      onSuccess();
      onClose();
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-charcoal-100 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-danger h-5 w-5" />
            <h2 className="text-charcoal font-serif text-lg font-bold">Ouvrir un litige</h2>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4 p-6">
          <div className="bg-danger/5 border-danger/20 text-danger rounded-lg border p-3 text-sm">
            Transaction{' '}
            <span className="font-mono font-semibold">{tx.reference.slice(0, 12)}…</span> —{' '}
            {formatAmount(tx.amount, tx.currency)}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-medium">Raison du litige *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border-charcoal-200 text-charcoal focus:border-navy focus:ring-navy/20 rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            >
              <option value="">Sélectionner une raison…</option>
              {DISPUTE_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-medium">Description détaillée</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Décrivez le problème rencontré…"
              className="border-charcoal-200 text-charcoal placeholder:text-charcoal-300 focus:border-navy focus:ring-navy/20 resize-none rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2"
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" variant="danger" className="flex-1" disabled={loading || !reason}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmer le litige'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TwoFAModalProps {
  txId: string;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

function TwoFAModal({ txId, token, onClose, onSuccess }: TwoFAModalProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.transactions.release(txId, token, code);
      onSuccess();
      onClose();
    } catch {
      setError('Code invalide ou expiré. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="border-charcoal-100 flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-navy h-5 w-5" />
            <h2 className="text-charcoal font-serif text-lg font-bold">Vérification 2FA</h2>
          </div>
          <button
            onClick={onClose}
            className="text-charcoal-400 hover:text-charcoal transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4 p-6">
          <p className="text-charcoal-400 text-sm">
            Cette transaction dépasse 100 000 FCFA. Saisissez le code de votre application
            d'authentification pour confirmer la libération des fonds.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-charcoal text-sm font-medium">Code TOTP (6 chiffres)</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="000000"
              className="border-charcoal-200 focus:border-navy focus:ring-navy/20 rounded-lg border px-4 py-3 text-center font-mono text-2xl tracking-widest focus:outline-none focus:ring-2"
              autoFocus
            />
          </div>

          {error && <p className="text-danger text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || code.length !== 6}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Libérer les fonds'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function TransactionsPage(): React.ReactElement {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const userId = session?.user?.id ?? null;

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);
  const [disputeTx, setDisputeTx] = useState<ApiTransaction | null>(null);
  const [twoFATx, setTwoFATx] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.transactions
      .findAll(token)
      .then((res) => setTransactions(res.data as ApiTransaction[]))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, [token]);

  const handleRelease = async (txId: string) => {
    if (!token) return;
    setReleasing(txId);
    try {
      const { data } = await api.transactions.releaseRequirements(txId, token);
      if (data.requires2FA) {
        setReleasing(null);
        setTwoFATx(txId);
        return;
      }
      await api.transactions.release(txId, token);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === txId ? { ...tx, status: 'RELEASED' } : tx)),
      );
    } catch {
      // silent
    } finally {
      setReleasing(null);
    }
  };

  const handleReleaseSuccess = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: 'RELEASED' } : tx)),
    );
  };

  const handleDisputeSuccess = (txId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === txId ? { ...tx, status: 'DISPUTED' } : tx)),
    );
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-charcoal font-serif text-2xl font-bold">Mes transactions</h1>

        {loading ? (
          <div className="border-charcoal-100 flex items-center justify-center rounded-xl border bg-white py-20">
            <Loader2 className="text-navy h-8 w-8 animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="border-charcoal-100 flex flex-col items-center justify-center gap-3 rounded-xl border bg-white py-20 text-center">
            <ArrowDownRight className="text-charcoal-200 h-10 w-10" />
            <p className="text-charcoal font-medium">Aucune transaction</p>
            <p className="text-charcoal-400 text-sm">
              Vos transactions apparaîtront ici une fois initiées.
            </p>
          </div>
        ) : (
          <div className="border-charcoal-100 shadow-card overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" aria-label="Liste des transactions">
                <thead className="border-charcoal-100 bg-charcoal-50 border-b">
                  <tr>
                    {[
                      'Référence',
                      'Type / Bien',
                      'Montant',
                      'Statut',
                      'Date',
                      'Contrepartie',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-charcoal-400 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-charcoal-50 divide-y">
                  {transactions.map((tx) => {
                    const isBuyer = tx.buyerId === userId;
                    const counterpart = isBuyer ? tx.seller : tx.buyer;
                    const canRelease = isBuyer && tx.status === 'FUNDED';
                    const canDispute =
                      isBuyer && ['FUNDED', 'VALIDATED', 'RELEASED'].includes(tx.status);
                    return (
                      <tr key={tx.id} className="hover:bg-charcoal-50 transition-colors">
                        <td className="text-charcoal-400 px-4 py-3 font-mono text-xs">
                          {tx.reference.slice(0, 12)}…
                        </td>
                        <td className="text-charcoal max-w-[180px] px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {isBuyer ? (
                              <ArrowUpRight className="text-danger h-3.5 w-3.5 flex-shrink-0" />
                            ) : (
                              <ArrowDownRight className="text-success h-3.5 w-3.5 flex-shrink-0" />
                            )}
                            <span className="truncate font-medium">
                              {tx.property?.title ?? TYPE_LABELS[tx.type] ?? tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="text-navy whitespace-nowrap px-4 py-3 font-mono font-semibold">
                          {formatAmount(tx.amount, tx.currency)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_VARIANTS[tx.status] ?? 'default'}>
                            {STATUS_LABELS[tx.status] ?? tx.status}
                          </Badge>
                        </td>
                        <td className="text-charcoal-400 whitespace-nowrap px-4 py-3">
                          {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="text-charcoal-400 px-4 py-3">
                          {counterpart ? `${counterpart.firstName} ${counterpart.lastName}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {canRelease && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => void handleRelease(tx.id)}
                                disabled={releasing === tx.id}
                              >
                                {releasing === tx.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  'Libérer les fonds'
                                )}
                              </Button>
                            )}
                            {canDispute && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setDisputeTx(tx)}
                                className="text-danger hover:bg-danger/10 hover:text-danger"
                              >
                                <AlertTriangle className="mr-1 h-3.5 w-3.5" />
                                Litige
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {disputeTx && token && (
        <DisputeModal
          tx={disputeTx}
          token={token}
          onClose={() => setDisputeTx(null)}
          onSuccess={() => handleDisputeSuccess(disputeTx.id)}
        />
      )}

      {twoFATx && token && (
        <TwoFAModal
          txId={twoFATx}
          token={token}
          onClose={() => setTwoFATx(null)}
          onSuccess={() => handleReleaseSuccess(twoFATx)}
        />
      )}
    </DashboardLayout>
  );
}
