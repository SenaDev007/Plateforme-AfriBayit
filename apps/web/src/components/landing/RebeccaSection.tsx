'use client';

import React from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function RebeccaSection() {
  return (
    <section className="overflow-hidden bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
          {/* Text Content */}
          <div>
            <div className="border-sky/20 bg-sky/5 mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5">
              <Bot className="text-sky h-4 w-4" />
              <span className="text-sky text-[10px] font-bold uppercase tracking-[0.2em]">
                Votre assistant immobilier 24/7
              </span>
            </div>

            <h2 className="text-navy mb-8 font-serif text-3xl font-bold tracking-tight sm:text-5xl lg:leading-tight">
              Posez vos questions. <br />
              <span className="text-gold italic">Rebecca répond.</span> <br />
              Même à 23h. Même si vous n'y connaissez rien.
            </h2>

            <div className="text-charcoal-600 mb-10 space-y-6 text-lg">
              <p>Vous ne savez pas quel quartier choisir à Abidjan ?</p>
              <p>Vous voulez savoir si le prix affiché est réaliste ?</p>
              <p>Vous avez besoin d'estimer votre bien avant de le mettre en vente ?</p>
            </div>

            <div className="border-charcoal-100 relative mb-10 rounded-2xl border bg-white p-6 shadow-sm">
              <Sparkles className="text-sky fill-sky/10 absolute right-0 top-0 -mr-3 -mt-3 h-8 w-8" />
              <p className="text-charcoal-700 italic">
                Rebecca analyse le marché en temps réel et vous donne une réponse honnête. Pas une
                réponse générique. Une réponse basée sur les données AfriBayit de votre zone.
              </p>
            </div>

            <a
              href="/rebecca"
              className="bg-navy hover:bg-navy-700 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105"
            >
              Parler à Rebecca maintenant
              <Bot className="h-4 w-4" />
            </a>
          </div>

          {/* Visual Chat Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="from-sky/20 to-navy/10 absolute inset-0 -m-8 rounded-full bg-gradient-to-tr opacity-50 blur-3xl" />

            <div className="border-charcoal-100 relative flex h-[500px] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl">
              {/* Header */}
              <div className="bg-navy flex items-center gap-4 p-4">
                <div className="bg-gold flex h-10 w-10 items-center justify-center rounded-full">
                  <Bot className="text-navy h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Rebecca IA</h3>
                  <p className="text-xs text-white/60">En ligne — Analyse du marché</p>
                </div>
              </div>

              {/* Chat Area */}
              <div className="bg-charcoal-50/50 flex flex-1 flex-col gap-6 p-6">
                {/* User Message */}
                <div className="max-w-[80%] self-end">
                  <div className="bg-navy rounded-2xl rounded-tr-sm px-4 py-3 text-sm text-white shadow-sm">
                    C'est quoi le prix moyen au m² à Fidjrossè ?
                  </div>
                </div>

                {/* Rebecca Message */}
                <div className="flex max-w-[85%] gap-3 self-start">
                  <div className="bg-gold mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <Bot className="text-navy h-4 w-4" />
                  </div>
                  <div className="border-charcoal-100 text-charcoal-700 rounded-2xl rounded-tl-sm border bg-white px-4 py-3 text-sm leading-relaxed shadow-sm">
                    À Fidjrossè, le prix moyen au m² pour un appartement est entre{' '}
                    <strong>180 000 et 240 000 FCFA</strong> selon l'étage et la proximité de la
                    mer.
                    <br />
                    <br />
                    Vous cherchez pour acheter ou pour investir ?
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-charcoal-100 flex items-center gap-2 border-t bg-white p-4">
                <div className="bg-charcoal-50 border-charcoal-100 text-charcoal-400 flex-1 rounded-full border px-4 py-2.5 text-sm">
                  Écrivez votre message...
                </div>
                <div className="bg-gold flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm">
                  <Send className="text-navy -ml-0.5 h-4 w-4" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
