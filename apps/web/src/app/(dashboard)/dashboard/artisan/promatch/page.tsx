'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Star,
  ShieldCheck,
  Zap,
  MessageSquare,
  FileText,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Hammer,
  Users,
  Clock,
} from 'lucide-react';
import { Card, Badge, Button, Input, cn } from '@afribayit/ui';

const CATEGORIES = [
  'Tous',
  'Gros Œuvre',
  'Second Œuvre',
  'Finition',
  'Génie Technique',
  'Extérieurs',
  'Urgences 24/7',
];

export default function ProMatchPage() {
  const [activeCat, setActiveCat] = useState('Tous');

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Zap className="text-gold fill-gold/20 h-5 w-5" />
            <p className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
              AfriBayit ProMatch — IA Matching
            </p>
          </div>
          <h1 className="text-charcoal font-serif text-4xl font-bold">
            Trouver un Artisan Certifié
          </h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-charcoal-200 h-12 rounded-2xl px-6">
            MES DEVIS (3)
          </Button>
          <Button className="bg-navy shadow-navy/20 h-12 rounded-2xl px-8 text-xs font-bold uppercase tracking-widest shadow-xl">
            POSTER UN PROJET
          </Button>
        </div>
      </div>

      {/* Emergency Banner — 5.5.2 */}
      <Card className="relative flex flex-col items-center justify-between gap-6 overflow-hidden rounded-[32px] border-rose-100 bg-rose-50 p-6 md:flex-row">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-rose-500/5 blur-3xl" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-rose-500 text-white">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-rose-900">Besoin d'un dépannage immédiat ?</h3>
            <p className="text-sm italic text-rose-700">
              Fuite d'eau, panne électrique, serrurerie — Intervention sous 30 min.
            </p>
          </div>
        </div>
        <Button className="relative z-10 h-14 rounded-2xl border-none bg-rose-600 px-10 font-bold text-white shadow-lg shadow-rose-200 hover:bg-rose-700">
          URGENCE 24/7
        </Button>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card className="border-charcoal-100 sticky top-24 space-y-6 rounded-[40px] p-8">
            <div>
              <h3 className="text-charcoal mb-4 font-serif text-xl font-bold">Filtrer</h3>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="text-charcoal-300 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Métier, spécialité..."
                    className="bg-charcoal-50 h-12 rounded-xl border-none pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="text-charcoal-300 absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                  <Input
                    placeholder="Ville..."
                    className="bg-charcoal-50 h-12 rounded-xl border-none pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-charcoal-400 mb-3 text-[10px] font-bold uppercase tracking-widest">
                Catégories
              </h4>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCat(cat)}
                    className={cn(
                      'w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition-all',
                      activeCat === cat
                        ? 'bg-navy shadow-navy/10 text-white shadow-lg'
                        : 'text-charcoal-500 hover:bg-charcoal-50',
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-charcoal-100 border-t pt-6">
              <label className="group flex cursor-pointer items-center gap-3">
                <div className="border-charcoal-200 group-hover:border-navy flex h-5 w-5 items-center justify-center rounded border-2 transition-all">
                  <CheckCircle2 className="fill-navy h-3 w-3 text-white opacity-0 group-hover:opacity-100" />
                </div>
                <span className="text-charcoal-600 text-sm font-medium">
                  Artisans Certifiés uniquement
                </span>
              </label>
            </div>
          </Card>
        </div>

        {/* Results Area */}
        <div className="space-y-8 lg:col-span-3">
          {/* IA Matching Suggestion — 5.5.2 */}
          <div className="bg-navy/5 border-navy/10 flex items-center justify-between rounded-[32px] border p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Zap className="text-gold h-6 w-6" />
              </div>
              <div>
                <p className="text-navy text-sm font-bold">IA ProMatch recommande :</p>
                <p className="text-charcoal-500 text-xs">
                  Moussa Bakayoko — Disponible ce matin à Cotonou.
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-navy text-xs font-bold uppercase tracking-widest"
            >
              Voir le profil
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                name: 'Moussa Bakayoko',
                trade: 'Plombier Expert',
                location: 'Cotonou, Cadjehoun',
                rating: 4.9,
                jobs: 128,
                rate: '15k - 25k FCFA',
                isCertified: true,
              },
              {
                name: 'Saliou Traoré',
                trade: 'Électricien BTP',
                location: 'Abomey-Calavi',
                rating: 4.7,
                jobs: 85,
                rate: '10k - 20k FCFA',
                isCertified: true,
              },
              {
                name: 'Awa Diallo',
                trade: 'Décoratrice Intérieur',
                location: 'Cotonou, Akpakpa',
                rating: 5.0,
                jobs: 42,
                rate: 'Sur devis',
                isCertified: true,
              },
              {
                name: 'Ibrahim Kone',
                trade: 'Maçon Gros Œuvre',
                location: 'Porto-Novo',
                rating: 4.8,
                jobs: 210,
                rate: '25k - 40k FCFA',
                isCertified: false,
              },
            ].map((artisan, i) => (
              <Card
                key={i}
                className="border-charcoal-100 group rounded-[40px] p-6 transition-all hover:shadow-2xl"
              >
                <div className="mb-6 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="bg-charcoal-50 ring-charcoal-100 h-16 w-16 overflow-hidden rounded-[20px] ring-1">
                      <img
                        src={`https://ui-avatars.com/api/?name=${artisan.name}&background=random`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-charcoal group-hover:text-navy font-bold transition-colors">
                          {artisan.name}
                        </h4>
                        {artisan.isCertified && <BadgeCheck className="text-gold h-4 w-4" />}
                      </div>
                      <p className="text-charcoal-400 text-xs font-medium">{artisan.trade}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <Star className="text-gold fill-gold h-3 w-3" />
                        <span className="text-charcoal text-[10px] font-bold">
                          {artisan.rating}
                        </span>
                        <span className="text-charcoal-300 text-[10px]">
                          ({artisan.jobs} missions)
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="border-charcoal-100 text-charcoal-400 text-[10px] font-bold uppercase"
                  >
                    {artisan.rate}
                  </Badge>
                </div>

                <div className="text-charcoal-500 mb-6 flex items-center gap-2 text-xs">
                  <MapPin className="text-navy h-3 w-3" />
                  <span>{artisan.location}</span>
                </div>

                <div className="border-charcoal-50 grid grid-cols-2 gap-3 border-t pt-6">
                  <Button
                    variant="outline"
                    className="border-charcoal-100 h-12 rounded-xl text-xs font-bold"
                  >
                    VOIR PROFIL
                  </Button>
                  <Button className="bg-navy h-12 rounded-xl text-xs font-bold">
                    DEVIS RAPIDE
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination/Load more */}
          <div className="flex justify-center pt-8">
            <Button
              variant="ghost"
              className="text-navy gap-2 text-xs font-bold uppercase tracking-widest"
            >
              Charger plus d'artisans <ArrowUpRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeCheck({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 11 3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  );
}
