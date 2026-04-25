'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
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
};
const STATUS_VARIANTS: Record<string, 'default' | 'sky' | 'gold' | 'success' | 'danger'> = {
  INITIATED: 'default',
  FUNDED: 'sky',
  VALIDATED: 'gold',
  RELEASED: 'success',
  COMPLETED: 'success',
  DISPUTED: 'danger',
  CANCELLED: 'danger',
};

const TYPE_LABELS: Record<string, string> = {
  PROPERTY_SALE: 'Achat immobilier',
  PROPERTY_RENT: 'Location',
  HOTEL_BOOKING: 'Hôtel',
  ARTISAN_SERVICE: 'Artisan',
  COURSE_PURCHASE: 'Formation',
};

function formatAmount(amount: string, currency: string): string {
  const num = parseFloat(amount);
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)} M ${currency}`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)} k ${currency}`;
  return `${num.toLocaleString('fr-FR')} ${currency}`;
}

export default function TransactionsPage(): React.ReactElement {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const userId = session?.user?.id ?? null;

  const [transactions, setTransactions] = useState<ApiTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [releasing, setReleasing] = useState<string | null>(null);

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
      await api.transactions.release(txId, token);
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === txId ? { ...tx, status: 'RELEASED' } : tx)),
      );
    } catch {
      // silent — could add toast
    } finally {
      setReleasing(null);
    }
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
          <div className="shadow-card border-charcoal-100 overflow-hidden rounded-xl border bg-white">
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
                      'Action',
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
    </DashboardLayout>
  );
}
