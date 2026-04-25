'use client';

import type React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Bell, CreditCard, Home, Shield, MessageCircle, Star, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import type { AppNotification } from '@/hooks/useNotifications';

const TYPE_ICONS: Record<string, React.ElementType> = {
  TRANSACTION_UPDATE: CreditCard,
  PROPERTY_NEW: Home,
  PROPERTY_PRICE_DROP: Home,
  KYC_STATUS: Shield,
  MESSAGE_NEW: MessageCircle,
  BOOKING_CONFIRMED: Star,
  PAYMENT_RECEIVED: CreditCard,
  SYSTEM: AlertCircle,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 0) return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `Il y a ${hours}h`;
  const mins = Math.floor(diff / 60_000);
  if (mins > 0) return `Il y a ${mins} min`;
  return "À l'instant";
}

function NotificationItem({
  notif,
  onMarkRead,
}: {
  notif: AppNotification;
  onMarkRead: (id: string) => void;
}): React.ReactElement {
  const Icon = TYPE_ICONS[notif.type] ?? Bell;
  return (
    <div
      className={`flex gap-4 rounded-xl border p-4 transition-all ${
        notif.isRead ? 'border-charcoal-100 bg-white' : 'border-navy/20 bg-navy/5'
      }`}
      aria-label={notif.isRead ? notif.title : `Non lue — ${notif.title}`}
    >
      <div
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
          notif.isRead ? 'bg-charcoal-100 text-charcoal-400' : 'bg-navy/10 text-navy'
        }`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium ${notif.isRead ? 'text-charcoal' : 'text-navy'}`}>
            {notif.title}
          </p>
          <div className="flex flex-shrink-0 items-center gap-1.5">
            {!notif.isRead && (
              <button
                onClick={() => onMarkRead(notif.id)}
                className="bg-navy hover:bg-navy/60 h-2 w-2 flex-shrink-0 rounded-full transition-colors"
                aria-label="Marquer comme lue"
              />
            )}
            <time className="text-charcoal-400 text-xs" dateTime={notif.createdAt}>
              {timeAgo(notif.createdAt)}
            </time>
          </div>
        </div>
        <p className="text-charcoal-400 mt-0.5 text-sm leading-relaxed">{notif.body}</p>
      </div>
    </div>
  );
}

export default function NotificationsPage(): React.ReactElement {
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <DashboardLayout>
      <div className="flex max-w-2xl flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-charcoal font-serif text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-charcoal-400 mt-0.5 text-sm">
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => void markAllRead()}
              className="text-navy text-sm transition-colors hover:underline"
            >
              Tout marquer comme lu
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-charcoal-100 h-20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Bell className="text-charcoal-200 h-12 w-12" aria-hidden="true" />
            <p className="text-charcoal-400">Aucune notification</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notif={notif} onMarkRead={markRead} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
