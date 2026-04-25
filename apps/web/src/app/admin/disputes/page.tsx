'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, AlertTriangle, CheckCircle, RefreshCw, Eye } from 'lucide-react';
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

interface DisputeUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DisputeTransaction {
  reference: string;
  amount: string;
  currency: string;
  type: string;
  buyer: DisputeUser;
  seller: DisputeUser;
}

interface ApiDispute {
  id: string;
  transactionId: string;
  reason: string;
  description: string | null;
  status: string;
  resolution: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  transaction: DisputeTransaction;
}

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Ouvert',
  UNDER_REVIEW: 'En révision',
  RESOLVED: 'Résolu',
  REFUNDED: 'Remboursé',
};

const STATUS_VARIANTS: Record<string, 'destructive' | 'secondary' | 'outline' | 'default'> = {
  OPEN: 'destructive',
  UNDER_REVIEW: 'secondary',
  RESOLVED: 'default',
  REFUNDED: 'outline',
};

function formatAmount(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} M ${currency}`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} k ${currency}`;
  return `${num.toLocaleString('fr-FR')} ${currency}`;
}

interface ResolveModalProps {
  dispute: ApiDispute;
  token: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ResolveModal({ dispute, token, onClose, onSuccess }: ResolveModalProps) {
  const [resolution, setResolution] = useState('');
  const [action, setAction] = useState<'RESOLVED' | 'REFUNDED'>('RESOLVED');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim()) {
      toast.error('Veuillez saisir une résolution.');
      return;
    }
    setLoading(true);
    try {
      await api.disputes.resolve(dispute.id, { resolution, action }, token);
      toast.success('Litige résolu avec succès.');
      onSuccess();
      onClose();
    } catch {
      toast.error('Erreur lors de la résolution du litige.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold">Résoudre le litige</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <div className="border-b bg-slate-50 px-6 py-4">
          <p className="text-sm font-medium text-slate-700">
            Transaction{' '}
            <span className="font-mono">{dispute.transaction.reference.slice(0, 12)}…</span>
            {' — '}
            {formatAmount(dispute.transaction.amount, dispute.transaction.currency)}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Acheteur : {dispute.transaction.buyer.firstName} {dispute.transaction.buyer.lastName}
            {' · '}Vendeur : {dispute.transaction.seller.firstName}{' '}
            {dispute.transaction.seller.lastName}
          </p>
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-700">Raison : {dispute.reason}</p>
            {dispute.description && (
              <p className="mt-1 text-sm text-red-600">{dispute.description}</p>
            )}
          </div>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-col gap-4 p-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Décision</label>
            <div className="flex gap-3">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="action"
                  value="RESOLVED"
                  checked={action === 'RESOLVED'}
                  onChange={() => setAction('RESOLVED')}
                  className="accent-green-600"
                />
                <span className="text-sm">Résoudre (transaction complétée)</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="radio"
                  name="action"
                  value="REFUNDED"
                  checked={action === 'REFUNDED'}
                  onChange={() => setAction('REFUNDED')}
                  className="accent-red-600"
                />
                <span className="text-sm">Rembourser l'acheteur</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Note de résolution *</label>
            <textarea
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={3}
              placeholder="Expliquez la décision prise…"
              className="resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
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
            <Button type="submit" className="flex-1" disabled={loading || !resolution.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmer la décision
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function DisputesPage() {
  const { data: session } = useSession();
  const [disputes, setDisputes] = useState<ApiDispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDispute, setSelectedDispute] = useState<ApiDispute | null>(null);
  const [reviewing, setReviewing] = useState<string | null>(null);

  const fetchDisputes = useCallback(async () => {
    const token = session?.accessToken as string | undefined;
    if (!token) return;
    setLoading(true);
    try {
      const { data } = await api.disputes.findAll(token);
      setDisputes(data as ApiDispute[]);
    } catch {
      toast.error('Erreur lors du chargement des litiges.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    void fetchDisputes();
  }, [fetchDisputes]);

  const handleMarkUnderReview = async (id: string) => {
    const token = session?.accessToken as string | undefined;
    if (!token) return;
    setReviewing(id);
    try {
      await api.disputes.markUnderReview(id, token);
      setDisputes((prev) => prev.map((d) => (d.id === id ? { ...d, status: 'UNDER_REVIEW' } : d)));
      toast.success('Litige mis en révision.');
    } catch {
      toast.error('Erreur.');
    } finally {
      setReviewing(null);
    }
  };

  const openCount = disputes.filter((d) => d.status === 'OPEN').length;
  const underReviewCount = disputes.filter((d) => d.status === 'UNDER_REVIEW').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des litiges</h1>
          <p className="text-muted-foreground">
            Révisez et résolvez les litiges ouverts par les acheteurs.
          </p>
        </div>
        <Button variant="outline" onClick={() => void fetchDisputes()} disabled={loading}>
          <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Litiges ouverts', value: openCount, color: 'text-red-600' },
          { label: 'En révision', value: underReviewCount, color: 'text-amber-600' },
          { label: 'Total', value: disputes.length, color: 'text-slate-700' },
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
                <TableHead>Acheteur / Vendeur</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {disputes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-12 text-center text-slate-400">
                    <AlertTriangle className="mx-auto mb-2 h-8 w-8 opacity-40" />
                    Aucun litige enregistré.
                  </TableCell>
                </TableRow>
              ) : (
                disputes.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell>
                      <div className="font-mono text-xs text-slate-500">
                        {d.transaction.reference.slice(0, 12)}…
                      </div>
                      <div className="mt-0.5 text-sm font-semibold">
                        {formatAmount(d.transaction.amount, d.transaction.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">
                          {d.transaction.buyer.firstName} {d.transaction.buyer.lastName}
                        </span>
                        <span className="text-slate-400"> → </span>
                        <span className="font-medium">
                          {d.transaction.seller.firstName} {d.transaction.seller.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[200px] truncate text-sm text-slate-700">{d.reason}</p>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500">
                      {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[d.status] ?? 'default'}>
                        {STATUS_LABELS[d.status] ?? d.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {d.status === 'OPEN' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => void handleMarkUnderReview(d.id)}
                            disabled={reviewing === d.id}
                          >
                            {reviewing === d.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              'Prendre en charge'
                            )}
                          </Button>
                        )}
                        {['OPEN', 'UNDER_REVIEW'].includes(d.status) && (
                          <Button
                            size="sm"
                            onClick={() => setSelectedDispute(d)}
                            className="gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Résoudre
                          </Button>
                        )}
                        {['RESOLVED', 'REFUNDED'].includes(d.status) && d.resolution && (
                          <span
                            className="max-w-[180px] truncate text-xs text-slate-400"
                            title={d.resolution}
                          >
                            {d.resolution}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedDispute && session?.accessToken && (
        <ResolveModal
          dispute={selectedDispute}
          token={session.accessToken as string}
          onClose={() => setSelectedDispute(null)}
          onSuccess={() => void fetchDisputes()}
        />
      )}
    </div>
  );
}
