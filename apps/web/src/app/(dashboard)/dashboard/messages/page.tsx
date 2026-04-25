'use client';

import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MessageSquare, Send, Loader2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@afribayit/ui';
import { cn } from '@afribayit/ui';
import { api } from '@/lib/api';
import { useChat, type ChatMessage } from '@/hooks/useChat';

interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string | null;
}

interface Conversation {
  id: string;
  participantA: string;
  participantB: string;
  lastMessageAt: string;
  userA: Participant;
  userB: Participant;
  messages: Array<{
    content: string;
    createdAt: string;
    senderId: string;
    isRead: boolean;
  }>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days > 30) return new Date(dateStr).toLocaleDateString('fr-FR');
  if (days > 0) return `Il y a ${days}j`;
  const hours = Math.floor(diff / 3_600_000);
  if (hours > 0) return `Il y a ${hours}h`;
  const mins = Math.floor(diff / 60_000);
  if (mins > 0) return `Il y a ${mins}m`;
  return "À l'instant";
}

export default function MessagesPage(): React.ReactElement {
  const { data: session } = useSession();
  const token = (session?.accessToken as string | undefined) ?? null;
  const userId = session?.user?.id ?? null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [input, setInput] = useState('');
  const [typingUserId, setTypingUserId] = useState<string | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleNewMessage = useCallback(
    (msg: ChatMessage) => {
      if (msg.conversationId === selectedConvId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      setConversations((prev) =>
        prev
          .map((c) =>
            c.id === msg.conversationId
              ? {
                  ...c,
                  lastMessageAt: msg.createdAt,
                  messages: [
                    {
                      content: msg.content,
                      createdAt: msg.createdAt,
                      senderId: msg.senderId,
                      isRead: false,
                    },
                  ],
                }
              : c,
          )
          .sort(
            (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
          ),
      );
    },
    [selectedConvId],
  );

  const handleTyping = useCallback((uid: string) => {
    setTypingUserId(uid);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setTypingUserId(null), 3000);
  }, []);

  const { connected, sendMessage, sendTyping, markRead } = useChat({
    token,
    onNewMessage: handleNewMessage,
    onTyping: handleTyping,
  });

  useEffect(() => {
    if (!token) {
      setLoadingConvs(false);
      return;
    }
    api.messages
      .getConversations(token)
      .then((res) => setConversations(res.data as Conversation[]))
      .catch(() => setConversations([]))
      .finally(() => setLoadingConvs(false));
  }, [token]);

  useEffect(() => {
    if (!selectedConvId || !token) return;
    setLoadingMsgs(true);
    setMessages([]);
    api.messages
      .getMessages(selectedConvId, token)
      .then((res) => {
        const { data } = res.data as { data: ChatMessage[]; total: number };
        setMessages(data);
        markRead(selectedConvId);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMsgs(false));
  }, [selectedConvId, token, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const getOtherUser = (conv: Conversation): Participant =>
    conv.participantA === userId ? conv.userB : conv.userA;

  const handleSend = () => {
    if (!input.trim() || !selectedConv) return;
    const other = getOtherUser(selectedConv);
    sendMessage(other.id, input.trim());
    setInput('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (selectedConv) {
      const other = getOtherUser(selectedConv);
      sendTyping(other.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-charcoal-100 flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-white">
      {/* Conversation list */}
      <div className="border-charcoal-100 flex w-72 flex-shrink-0 flex-col border-r">
        <div className="border-charcoal-100 flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-charcoal font-semibold">Messages</h2>
          <span
            className={cn(
              'flex items-center gap-1 text-xs',
              connected ? 'text-success' : 'text-charcoal-400',
            )}
          >
            {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
            {connected ? 'Connecté' : 'Hors ligne'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingConvs ? (
            <div className="space-y-3 p-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-charcoal-100 h-10 w-10 flex-shrink-0 animate-pulse rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-charcoal-100 h-3.5 w-24 animate-pulse rounded" />
                    <div className="bg-charcoal-100 h-3 w-36 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
              <MessageSquare className="text-charcoal-200 h-8 w-8" />
              <p className="text-charcoal-400 text-sm">Aucune conversation</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherUser(conv);
              const lastMsg = conv.messages[0];
              const isActive = conv.id === selectedConvId;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConvId(conv.id)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left transition-colors',
                    isActive ? 'bg-navy/5' : 'hover:bg-charcoal-50',
                  )}
                >
                  <div className="bg-navy/10 text-navy flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {other.firstName[0]}
                    {other.lastName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-charcoal truncate text-sm font-medium">
                        {other.firstName} {other.lastName}
                      </span>
                      {lastMsg && (
                        <span className="text-charcoal-400 ml-2 flex-shrink-0 text-xs">
                          {timeAgo(lastMsg.createdAt)}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="text-charcoal-400 truncate text-xs">{lastMsg.content}</p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat panel */}
      <div className="flex min-w-0 flex-1 flex-col">
        {selectedConv ? (
          <>
            {(() => {
              const other = getOtherUser(selectedConv);
              return (
                <div className="border-charcoal-100 flex items-center gap-3 border-b px-5 py-3">
                  <div className="bg-navy/10 text-navy flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold">
                    {other.firstName[0]}
                    {other.lastName[0]}
                  </div>
                  <div>
                    <p className="text-charcoal text-sm font-semibold">
                      {other.firstName} {other.lastName}
                    </p>
                    {typingUserId === other.id && (
                      <p className="text-charcoal-400 text-xs italic">
                        est en train d&apos;écrire…
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {loadingMsgs ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="text-navy h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center">
                  <p className="text-charcoal-400 text-sm">Commencez la conversation !</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === userId;
                  return (
                    <div
                      key={msg.id}
                      className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'max-w-[70%] rounded-2xl px-3.5 py-2 text-sm',
                          isOwn
                            ? 'bg-navy rounded-br-sm text-white'
                            : 'bg-charcoal-50 text-charcoal rounded-bl-sm',
                        )}
                      >
                        <p>{msg.content}</p>
                        <p
                          className={cn(
                            'mt-0.5 text-right text-[10px]',
                            isOwn ? 'text-white/60' : 'text-charcoal-400',
                          )}
                        >
                          {timeAgo(msg.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-charcoal-100 border-t p-3">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Écrire un message… (Entrée pour envoyer)"
                  rows={1}
                  className="border-charcoal-200 focus:ring-navy/30 min-h-[40px] flex-1 resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
                <Button size="sm" onClick={handleSend} disabled={!input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <MessageSquare className="text-charcoal-200 h-12 w-12" />
            <p className="text-charcoal-400 text-sm font-medium">Sélectionnez une conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
