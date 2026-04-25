'use client';

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:4000';

interface UseSocketOptions {
  token: string | null;
  onNotification?: (payload: Record<string, unknown>) => void;
}

export function useSocket({ token, onNotification }: UseSocketOptions) {
  const socketRef = useRef<Socket | null>(null);

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  useEffect(() => {
    if (!token) {
      disconnect();
      return;
    }

    const socket = io(`${WS_URL}/notifications`, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.debug('[WS] Connected to notifications gateway');
    });

    socket.on('notification', (payload: Record<string, unknown>) => {
      onNotification?.(payload);
    });

    socket.on('disconnect', (reason: string) => {
      console.debug('[WS] Disconnected:', reason);
    });

    socket.on('connect_error', (err: Error) => {
      console.error('[WS] Connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [token, onNotification, disconnect]);

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit, connected: socketRef.current?.connected ?? false };
}
