import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge } from '@afribayit/ui';

export const metadata: Metadata = { title: 'Mes transactions', robots: { index: false } };

const MOCK_TRANSACTIONS = [
  {
    id: 'tx1', reference: 'AFB-2024-001',
    title: 'Villa Les Cocotiers — Cotonou', amount: 85000000, currency: 'XOF',
    status: 'FUNDED', type: 'Achat', date: '2024-12-20', counterpart: 'Kodjo M.',
  },
  {
    id: 'tx2', reference: 'AFB-2024-002',
    title: 'Artisan — Peinture appartement', amount: 450000, currency: 'XOF',
    status: 'COMPLETED', type: 'Service', date: '2024-11-05', counterpart: 'Segun A.',
  },
];

const STATUS_LABELS: Record<string, string> = {
  INITIATED: 'Initié', FUNDED: 'En escrow', VALIDATED: 'Validé',
  RELEASED: 'Libéré', COMPLETED: 'Terminé', DISPUTED: 'En litige', CANCELLED: 'Annulé',
};
const STATUS_VARIANTS: Record<string, 'default' | 'sky' | 'gold' | 'success' | 'danger'> = {
  INITIATED: 'default', FUNDED: 'sky', VALIDATED: 'gold',
  RELEASED: 'success', COMPLETED: 'success', DISPUTED: 'danger', CANCELLED: 'danger',
};

export default function TransactionsPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Mes transactions</h1>

        <div className="overflow-hidden rounded-xl border border-charcoal-100 bg-white shadow-card">
          <table className="w-full text-sm" aria-label="Liste des transactions">
            <thead className="border-b border-charcoal-100 bg-charcoal-50">
              <tr>
                {['Référence', 'Bien / Service', 'Montant', 'Statut', 'Date', 'Contrepartie'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-charcoal-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal-50">
              {MOCK_TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-charcoal-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-charcoal-400">{tx.reference}</td>
                  <td className="px-4 py-3 font-medium text-charcoal max-w-[200px] truncate">{tx.title}</td>
                  <td className="px-4 py-3 font-mono font-semibold text-navy whitespace-nowrap">
                    {(tx.amount / 1_000_000).toFixed(1)} M FCFA
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_VARIANTS[tx.status] ?? 'default'}>
                      {STATUS_LABELS[tx.status] ?? tx.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-charcoal-400 whitespace-nowrap">{tx.date}</td>
                  <td className="px-4 py-3 text-charcoal-400">{tx.counterpart}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
