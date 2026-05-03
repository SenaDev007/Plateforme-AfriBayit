'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Minus, Maximize2 } from 'lucide-react';
import { cn } from '@afribayit/ui/src/lib/cn';
import { Button } from '@afribayit/ui';

interface Message {
  role: 'user' | 'rebecca';
  content: string;
}

export function RebeccaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'rebecca',
      content:
        "Bonjour ! Je suis Rebecca, votre experte AfriBayit. Comment puis-je vous aider dans votre projet immobilier aujourd'hui ?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/ai/rebecca/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'rebecca', content: data.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'rebecca',
          content: 'Je suis désolée, une erreur est survenue. Pouvez-vous répéter ?',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 flex h-[550px] w-[380px] flex-col overflow-hidden rounded-[32px] border border-white/20 bg-white/90 shadow-2xl backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="bg-navy flex items-center justify-between p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="bg-gold/20 border-gold/30 flex h-10 w-10 items-center justify-center rounded-xl border">
                  <Sparkles className="text-gold h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">Rebecca IA</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Assistante Experte
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="no-scrollbar flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'flex max-w-[85%] flex-col',
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start',
                  )}
                >
                  <div
                    className={cn(
                      'rounded-3xl px-5 py-3.5 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-navy rounded-br-none text-white'
                        : 'bg-charcoal-50 text-charcoal border-charcoal-100 rounded-bl-none border',
                    )}
                  >
                    {msg.content}
                  </div>
                  <span className="text-charcoal-300 mt-1.5 text-[10px] font-bold uppercase tracking-wider">
                    {msg.role === 'user' ? 'Vous' : 'Rebecca'}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="text-charcoal-400 flex items-center gap-2 px-5 text-xs font-bold">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Rebecca réfléchit...
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 pt-2">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question..."
                  className="bg-charcoal-50 focus:ring-navy h-14 w-full rounded-2xl border-none px-5 pr-14 text-sm font-medium transition-all focus:ring-2"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-navy hover:bg-navy-600 shadow-navy/20 absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-charcoal-300 mt-3 text-center text-[9px] font-medium">
                Réponses générées par IA • Base de connaissances AfriBayit
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'relative flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-all duration-500',
          isOpen ? 'text-navy rotate-90 bg-white' : 'bg-navy text-white',
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        {!isOpen && (
          <span className="bg-gold absolute -right-1 -top-1 h-5 w-5 animate-bounce rounded-full border-4 border-white" />
        )}
      </motion.button>
    </div>
  );
}
