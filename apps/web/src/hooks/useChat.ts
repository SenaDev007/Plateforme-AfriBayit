'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env['NEXT_PUBLIC_WS_URL'] ?? 'http://localhost:4000';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: { id: string; firstName: string; lastName: string; avatar: string | null };
}

interface UseChatOptions {
  token: string | null;
  onNewMessage?: (msg: ChatMessage) => void;
  onTyping?: (userId: string) => void;
}

export function useChat({ token, onNewMessage, onTyping }: UseChatOptions) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const socket = io(`${WS_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new_message', (msg: ChatMessage) => {
      onNewMessage?.(msg);
    });

    socket.on('message_sent', (msg: ChatMessage) => {
      onNewMessage?.(msg);
    });

    socket.on('user_typing', ({ userId }: { userId: string }) => {
      onTyping?.(userId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, onNewMessage, onTyping]);

  const sendMessage = useCallback((recipientId: string, content: string) => {
    socketRef.current?.emit('send_message', { recipientId, content });
  }, []);

  const sendTyping = useCallback((recipientId: string) => {
    socketRef.current?.emit('typing', { recipientId });
  }, []);

  const markRead = useCallback((conversationId: string) => {
    socketRef.current?.emit('mark_read', { conversationId });
  }, []);

  return { connected, sendMessage, sendTyping, markRead };
}
