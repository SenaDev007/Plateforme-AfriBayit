'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from './useSocket';
import { api } from '@/lib/api';

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export function useNotifications() {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api.notifications
      .getAll(token)
      .then((res) => setNotifications(res.data as AppNotification[]))
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [token]);

  const handleIncoming = useCallback((payload: Record<string, unknown>) => {
    const notif: AppNotification = {
      id: payload['id'] as string,
      type: payload['type'] as string,
      title: payload['title'] as string,
      body: payload['body'] as string,
      isRead: false,
      createdAt: (payload['createdAt'] as string) ?? new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
  }, []);

  useSocket({ token, onNotification: handleIncoming });

  const markRead = useCallback(
    async (id: string) => {
      if (!token) return;
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      await api.notifications.markRead(id, token).catch(() => null);
    },
    [token],
  );

  const markAllRead = useCallback(async () => {
    if (!token) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    await api.notifications.markAllRead(token).catch(() => null);
  }, [token]);

  return { notifications, loading, unreadCount, markRead, markAllRead };
}
