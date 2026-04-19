import type React from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Badge } from '@afribayit/ui';
import { Bell, CreditCard, Home, Shield } from 'lucide-react';

export const metadata: Metadata = { title: 'Notifications', robots: { index: false } };

const MOCK_NOTIFICATIONS = [
  {
    id: 'n1', type: 'TRANSACTION_UPDATE', title: 'Transaction financée', isRead: false,
    body: 'Votre escrow AFB-2024-001 a été financé. Les fonds (85 M FCFA) sont sécurisés.',
    createdAt: '2024-12-20T10:30:00Z', icon: CreditCard,
  },
  {
    id: 'n2', type: 'PROPERTY_NEW', title: 'Nouvelle propriété correspondante', isRead: false,
    body: 'Une villa à Cotonou correspond à vos critères de recherche.',
    createdAt: '2024-12-19T14:00:00Z', icon: Home,
  },
  {
    id: 'n3', type: 'KYC_STATUS', title: 'KYC Niveau 1 approuvé', isRead: true,
    body: 'Votre vérification d\'identité a été approuvée. Vous pouvez maintenant vendre.',
    createdAt: '2024-12-15T09:00:00Z', icon: Shield,
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `Il y a ${hours}h`;
  return 'À l\'instant';
}

export default function NotificationsPage(): React.ReactElement {
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-5 max-w-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-charcoal">Notifications</h1>
            {unread > 0 && (
              <p className="text-sm text-charcoal-400 mt-0.5">{unread} non lue{unread > 1 ? 's' : ''}</p>
            )}
          </div>
          {unread > 0 && (
            <button className="text-sm text-navy hover:underline transition-colors">
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_NOTIFICATIONS.map((notif) => {
            const Icon = notif.icon;
            return (
              <div
                key={notif.id}
                className={`flex gap-4 rounded-xl border p-4 transition-all ${
                  notif.isRead
                    ? 'border-charcoal-100 bg-white'
                    : 'border-navy/20 bg-navy/5'
                }`}
                aria-label={notif.isRead ? notif.title : `Non lue — ${notif.title}`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  notif.isRead ? 'bg-charcoal-100 text-charcoal-400' : 'bg-navy/10 text-navy'
                }`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${notif.isRead ? 'text-charcoal' : 'text-navy'}`}>
                      {notif.title}
                    </p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-navy flex-shrink-0" aria-label="Non lue" />
                      )}
                      <time className="text-xs text-charcoal-400" dateTime={notif.createdAt}>
                        {timeAgo(notif.createdAt)}
                      </time>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal-400 mt-0.5 leading-relaxed">{notif.body}</p>
                </div>
              </div>
            );
          })}
        </div>

        {MOCK_NOTIFICATIONS.length === 0 && (
          <div className="flex flex-col items-center py-16 gap-3">
            <Bell className="h-12 w-12 text-charcoal-200" aria-hidden="true" />
            <p className="text-charcoal-400">Aucune notification</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
