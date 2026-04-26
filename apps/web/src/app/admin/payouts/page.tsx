'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, RefreshCw, RotateCcw, Banknote, X } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const OPERATORS = [
  { value: 'mtn_bj', label: 'MTN Bénin' },
  { value: 'moov_bj', label: 'Moov Bénin' },
  { value: 'mtn_ci', label: "MTN Côte d'Ivoire" },
  { value: 'orange_ci', label: 'Orange CI' },
  { value: 'moov_ci', label: 'Moov CI' },
  { value: 'orange_bf', label: 'Orange Burkina' },
  { value: 'moov_bf', label: 'Moov Burkina' },
  { value: 'moov_tg', label: 'Moov Togo' },
  { value: 'togocel_tg', label: 'Togocel Togo' },
];

interface ApiPayout {
  id: string;
  transactionId: string;
  amount: string;
  currency: string;
  phone: string | null;
  operator: string | null;
  status: string;
  providerRef: string | null;
  failureReason: string | null;
  initiatedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  seller: { id: string; firstName: string; lastName: string; email: string; phone: string | null };
  transaction: { reference: string; type: string; currency: string };
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'secondary',
  INITIATED: 'default',
  COMPLETED: 'default',
  FAILED: 'destructive',
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  INITIATED: 'Initié',
  COMPLETED: 'Versé',
  FAILED: 'Échoué',
};

function fmt(amount: string, currency: string): string {
  const n = parseFloat(amount);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)} M ${currency}`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} k ${currency}`;
  return `${Math.round(n).toLocaleString('fr-FR')} ${currency}`;
}

interface RetryModalProps {
  payout: ApiPayout;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

function RetryModal({ payout, token, onClose, onSuccess }: RetryModalProps) {
  const [phone, setPhone] = useState(payout.phone ?? payout.seller.phone ?? '');
  const [operator, setOperator] = useState(payout.operator ?? 'mtn_bj');
  const [loading, setLoading] = useState(false);

  const handleRetry = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.payouts.retry(payout.id, { ...(phone ? { phone } : {}), operator }, token);
      toast.success('Payout relancé avec succès.');
      onSuccess();
      onClose();
    } catch {
      toast.error('Erreur lors du retry du payout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-slate-600" />
            <h2 className="text-lg font-bold">Relancer le payout</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => void handleRetry(e)} className="flex flex-col gap-4 p-6">
          <div className="rounded-lg border bg-slate-50 px-4 py-3 text-sm">
            <p className="font-medium">
              {payout.seller.firstName} {payout.seller.lastName}
            </p>
            <p className="text-slate-500">{payout.seller.email}</p>
            <p className="mt-1 font-mono font-semibold text-slate-700">
              {fmt(payout.amount, payout.currency)}
            </p>
          </div>

          {payout.failureReason && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Échec précédent : {payout.failureReason}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Numéro Mobile Money</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+22961000000"
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Opérateur</label>
            <select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
            >
              {OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>

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
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Relancer le virement'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PayoutsPage() {
  const { data: session } = useSession();
  const [payouts, setPayouts] = useState<ApiPayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryPayout, setRetryPayout] = useState<ApiPayout | null>(null);

  const fetchPayouts = useCallback(async () => {
    const token = session?.accessToken as string | undefined;
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await api.payouts.findAll(token);
      setPayouts(data as ApiPayout[]);
    } catch {
      toast.error('Erreur lors du chargement des payouts.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void fetchPayouts();
  }, [fetchPayouts]);

  const pending = payouts.filter((p) => p.status === 'PENDING').length;
  const failed = payouts.filter((p) => p.status === 'FAILED').length;
  const completed = payouts.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payouts Mobile Money</h1>
          <p className="text-muted-foreground">
            Virements automatiques aux vendeurs après libération de l'escrow.
          </p>
        </div>
        <Button variant="outline" onClick={() => void fetchPayouts()} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En attente', value: pending, color: 'text-amber-600' },
          { label: 'Échoués', value: failed, color: 'text-red-600' },
          { label: 'Versés', value: completed, color: 'text-green-600' },
          { label: 'Total', value: payouts.length, color: 'text-slate-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Transaction</TableHead>
                <TableHead>Vendeur</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Téléphone / Opérateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payouts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-12 text-center text-slate-400">
                    <Banknote className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    Aucun payout enregistré.
                  </TableCell>
                </TableRow>
              ) : (
                payouts.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-slate-500">
                      {p.transaction.reference.slice(0, 12)}…
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {p.seller.firstName} {p.seller.lastName}
                      </div>
                      <div className="text-xs text-slate-400">{p.seller.email}</div>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">
                      {fmt(p.amount, p.currency)}
                    </TableCell>
                    <TableCell className="text-sm text-slate-600">
                      <div>{p.phone ?? <span className="text-slate-300">—</span>}</div>
                      {p.operator && (
                        <div className="text-xs text-slate-400">
                          {OPERATORS.find((o) => o.value === p.operator)?.label ?? p.operator}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[p.status] ?? 'default'}>
                        {STATUS_LABELS[p.status] ?? p.status}
                      </Badge>
                      {p.providerRef && (
                        <div className="mt-0.5 font-mono text-xs text-slate-400">
                          #{p.providerRef}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {['PENDING', 'FAILED'].includes(p.status) && (
                        <Button size="sm" variant="outline" onClick={() => setRetryPayout(p)}>
                          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                          Relancer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {retryPayout && session?.accessToken && (
        <RetryModal
          payout={retryPayout}
          token={session.accessToken as string}
          onClose={() => setRetryPayout(null)}
          onSuccess={() => void fetchPayouts()}
        />
      )}
    </div>
  );
}
