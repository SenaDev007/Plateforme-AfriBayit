'use client';
import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageSquare, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { SiteNavbar } from '@/components/landing/SiteNavbar';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { Button } from '@afribayit/ui';

export default function ContactPage(): React.ReactElement {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormState('success');
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteNavbar />

      <main className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mb-20 text-center">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-gold mb-4 text-xs font-bold uppercase tracking-[0.4em]"
            >
              Contactez-nous
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-charcoal font-serif text-4xl font-bold md:text-6xl"
            >
              Parlons de votre <span className="text-navy italic">Projet</span>
            </motion.h1>
          </div>

          <div className="grid gap-16 lg:grid-cols-12">
            {/* Contact Info */}
            <div className="lg:col-span-5">
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="bg-navy/5 text-navy flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-charcoal mb-2 text-xl font-bold">Email</h3>
                    <p className="text-charcoal-400 mb-2 text-sm">
                      Notre équipe vous répond sous 24h.
                    </p>
                    <a
                      href="mailto:contact@afribayit.com"
                      className="text-navy font-bold hover:underline"
                    >
                      contact@afribayit.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-gold/10 text-gold flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-charcoal mb-2 text-xl font-bold">Téléphone</h3>
                    <p className="text-charcoal-400 mb-2 text-sm">Lun-Ven de 9h à 18h (GMT+1).</p>
                    <a href="tel:+22900000000" className="text-navy font-bold hover:underline">
                      +229 01 02 03 04
                    </a>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="bg-navy/5 text-navy flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-charcoal mb-2 text-xl font-bold">Siège Social</h3>
                    <p className="text-charcoal-400 text-sm leading-relaxed">
                      Immeuble AfriBayit, Zone Résidentielle,
                      <br />
                      Cotonou, Bénin
                    </p>
                  </div>
                </div>

                <div className="border-charcoal-100 bg-charcoal-50/50 rounded-[32px] border p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <MessageSquare className="text-gold h-5 w-5" />
                    <h4 className="text-charcoal font-bold">Support Client</h4>
                  </div>
                  <p className="text-charcoal-400 text-sm leading-relaxed">
                    Besoin d&apos;aide avec une transaction en cours ? <br />
                    Connectez-vous à votre dashboard pour un support prioritaire.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="border-charcoal-100 rounded-[40px] border bg-white p-8 shadow-2xl md:p-12">
                {formState === 'success' ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <div className="bg-emerald/10 text-emerald mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-charcoal mb-4 text-2xl font-bold">Message Envoyé !</h3>
                    <p className="text-charcoal-400 mx-auto max-w-xs">
                      Merci de nous avoir contacté. Notre équipe reviendra vers vous très
                      prochainement.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-8 rounded-xl"
                      onClick={() => setFormState('idle')}
                    >
                      Envoyer un autre message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-charcoal text-xs font-bold uppercase tracking-widest">
                          Nom Complet
                        </label>
                        <input
                          required
                          type="text"
                          placeholder="Jean Dupont"
                          className="border-charcoal-100 focus:border-navy focus:ring-navy/20 bg-charcoal-50/30 w-full rounded-2xl border px-6 py-4 transition-all focus:outline-none focus:ring-4"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-charcoal text-xs font-bold uppercase tracking-widest">
                          Email
                        </label>
                        <input
                          required
                          type="email"
                          placeholder="jean@exemple.com"
                          className="border-charcoal-100 focus:border-navy focus:ring-navy/20 bg-charcoal-50/30 w-full rounded-2xl border px-6 py-4 transition-all focus:outline-none focus:ring-4"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-charcoal text-xs font-bold uppercase tracking-widest">
                        Sujet
                      </label>
                      <select className="border-charcoal-100 focus:border-navy focus:ring-navy/20 bg-charcoal-50/30 w-full rounded-2xl border px-6 py-4 transition-all focus:outline-none focus:ring-4">
                        <option>Question sur l&apos;investissement</option>
                        <option>Support technique</option>
                        <option>Partenariat</option>
                        <option>Autre</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-charcoal text-xs font-bold uppercase tracking-widest">
                        Message
                      </label>
                      <textarea
                        required
                        rows={6}
                        placeholder="Comment pouvons-nous vous aider ?"
                        className="border-charcoal-100 focus:border-navy focus:ring-navy/20 bg-charcoal-50/30 w-full resize-none rounded-2xl border px-6 py-4 transition-all focus:outline-none focus:ring-4"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formState === 'loading'}
                      className="bg-navy h-16 w-full rounded-2xl text-xs font-bold uppercase tracking-widest"
                    >
                      {formState === 'loading' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Envoyer le message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
