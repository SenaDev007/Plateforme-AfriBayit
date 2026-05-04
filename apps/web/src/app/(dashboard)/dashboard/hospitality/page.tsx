'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bed,
  Users,
  Calendar,
  TrendingUp,
  Globe,
  QrCode,
  Utensils,
  Settings,
  ChevronRight,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  RefreshCcw,
  Star,
  Hotel as HotelIcon,
} from 'lucide-react';
import { Card, Badge, Button, cn } from '@afribayit/ui';

const ROOMS = [
  {
    id: '101',
    type: 'Deluxe Suite',
    status: 'OCCUPIED',
    guest: 'Jean-Marc Mensah',
    checkout: 'Demain, 11:00',
  },
  { id: '102', type: 'Standard Room', status: 'AVAILABLE', guest: null, checkout: null },
  { id: '103', type: 'Presidential', status: 'DIRTY', guest: null, checkout: 'Parti à 10:30' },
  {
    id: '104',
    type: 'Deluxe Suite',
    status: 'ARRIVING',
    guest: 'Sarah Kone',
    checkout: 'Arrivée 14:00',
  },
];

export default function HospitalityDashboard() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'bookings' | 'ota'>('rooms');

  return (
    <div className="space-y-10 py-10 font-sans">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <HotelIcon className="text-gold h-5 w-5" />
            <p className="text-gold text-[10px] font-bold uppercase tracking-[0.3em]">
              AfriBayit Hospitality — PMS Pro
            </p>
          </div>
          <h1 className="text-charcoal font-serif text-4xl font-bold">Hôtel du Lac — Cotonou</h1>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="h-12 rounded-2xl px-8 text-xs font-bold uppercase tracking-widest"
          >
            PLANNING
          </Button>
          <Button className="bg-navy h-12 rounded-2xl px-8 text-xs font-bold uppercase tracking-widest">
            RÉSERVATION DIRECTE
          </Button>
        </div>
      </div>

      {/* Real-time Stats - Section 7D.12 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {[
          { label: 'Occupation', value: '82%', icon: Users, trend: '+5%', color: 'navy' },
          { label: 'RevPAR', value: '45 000 FCFA', icon: TrendingUp, trend: '+12%', color: 'gold' },
          {
            label: 'Arrivées ce jour',
            value: '12',
            icon: Calendar,
            trend: '9/12 scannés',
            color: 'navy',
          },
          {
            label: 'Score Satisfaction',
            value: '4.9/5',
            icon: Star,
            trend: '25 avis',
            color: 'gold',
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="border-charcoal-100 group rounded-[40px] bg-white p-8 transition-all hover:shadow-2xl"
          >
            <div
              className={cn(
                'mb-6 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:rotate-6',
                stat.color === 'navy' ? 'bg-navy/5 text-navy' : 'bg-gold/10 text-gold',
              )}
            >
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-charcoal mb-1 font-serif text-4xl font-bold">{stat.value}</p>
            <div className="flex items-center justify-between">
              <p className="text-charcoal-400 text-[10px] font-bold uppercase tracking-widest">
                {stat.label}
              </p>
              <span className="text-emerald text-[10px] font-bold">{stat.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main PMS Grid - Section 7D.3.1 */}
        <Card className="border-charcoal-100 space-y-8 rounded-[40px] p-8 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-charcoal font-serif text-2xl font-bold">État des Chambres</h3>
              <Badge variant="outline" className="text-[10px]">
                TOTAL : 48 CHAMBRES
              </Badge>
            </div>
            <div className="bg-charcoal-50 flex rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('rooms')}
                className={cn(
                  'rounded-xl px-6 py-2 text-xs font-bold transition-all',
                  activeTab === 'rooms' ? 'text-navy bg-white shadow-lg' : 'text-charcoal-400',
                )}
              >
                VUE GRILLE
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={cn(
                  'rounded-xl px-6 py-2 text-xs font-bold transition-all',
                  activeTab === 'bookings' ? 'text-navy bg-white shadow-lg' : 'text-charcoal-400',
                )}
              >
                ARRIVÉES
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {ROOMS.map((room) => (
              <div
                key={room.id}
                className={cn(
                  'group rounded-[32px] border p-6 transition-all hover:shadow-xl',
                  room.status === 'OCCUPIED'
                    ? 'bg-navy border-transparent text-white'
                    : room.status === 'AVAILABLE'
                      ? 'bg-charcoal-50/50 border-charcoal-100'
                      : room.status === 'DIRTY'
                        ? 'bg-gold/5 border-gold/20'
                        : 'bg-emerald/5 border-emerald/20',
                )}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'font-serif text-2xl font-bold',
                        room.status === 'OCCUPIED' ? 'text-white' : 'text-charcoal',
                      )}
                    >
                      {room.id}
                    </span>
                    <Badge
                      className={cn(
                        'text-[9px] font-bold uppercase',
                        room.status === 'OCCUPIED' ? 'border-white/20 bg-white/10 text-white' : '',
                      )}
                    >
                      {room.type}
                    </Badge>
                  </div>
                  <Badge
                    variant={
                      room.status === 'AVAILABLE'
                        ? 'success'
                        : room.status === 'OCCUPIED'
                          ? 'gold'
                          : room.status === 'DIRTY'
                            ? 'danger'
                            : 'sky'
                    }
                  >
                    {room.status}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {room.guest ? (
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {room.guest[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold">{room.guest}</p>
                        <p className="text-[10px] opacity-60">Sortie : {room.checkout}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] font-medium opacity-60">Aucun voyageur assigné</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-10 flex-1 rounded-xl border-white/20 text-[10px] font-bold',
                        room.status === 'OCCUPIED' ? 'text-white hover:bg-white/10' : 'text-navy',
                      )}
                    >
                      SERVICE
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'h-10 flex-1 rounded-xl border-white/20 text-[10px] font-bold',
                        room.status === 'OCCUPIED'
                          ? 'text-navy border-none bg-white'
                          : 'bg-navy border-none text-white',
                      )}
                    >
                      {room.status === 'OCCUPIED' ? 'CHECK-OUT' : 'CHECK-IN'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Channel Manager - Section 7D.4 */}
        <div className="space-y-10">
          <Card className="bg-charcoal-900 relative space-y-8 overflow-hidden rounded-[40px] p-8 text-white">
            <div className="bg-navy/20 absolute right-0 top-0 h-40 w-40 -translate-y-1/2 translate-x-1/2 rounded-full blur-3xl" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-sky-400" />
                <h3 className="font-serif text-xl font-bold">Channel Manager</h3>
              </div>
              <Badge variant="sky" className="border-none bg-sky-400/10 text-sky-400">
                CONNECTÉ
              </Badge>
            </div>

            <div className="relative z-10 space-y-4">
              {[
                { name: 'Booking.com', status: 'SYCHRONIZED', time: 'Il y a 2m' },
                { name: 'Expedia', status: 'SYCHRONIZED', time: 'Il y a 5m' },
                { name: 'AirBnB', status: 'PENDING', time: 'En attente' },
              ].map((ota, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{ota.name}</span>
                    <span className="text-charcoal-400 text-[10px]">{ota.time}</span>
                  </div>
                  {ota.status === 'SYCHRONIZED' ? (
                    <RefreshCcw className="text-emerald animate-spin-slow h-4 w-4" />
                  ) : (
                    <Zap className="text-gold h-4 w-4" />
                  )}
                </div>
              ))}
            </div>

            <Button
              fullWidth
              className="text-navy relative z-10 h-14 rounded-2xl bg-white text-xs font-bold uppercase tracking-widest"
            >
              MODIFIER DISPONIBILITÉS
            </Button>
          </Card>

          {/* Quick Tools - Section 7D.5.3 */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-charcoal-100 flex cursor-pointer flex-col items-center gap-3 rounded-[32px] bg-white p-6 transition-all hover:shadow-xl">
              <QrCode className="text-navy h-8 w-8" />
              <span className="text-charcoal text-[10px] font-bold uppercase tracking-widest">
                Kiosque QR
              </span>
            </Card>
            <Card className="border-charcoal-100 flex cursor-pointer flex-col items-center gap-3 rounded-[32px] bg-white p-6 transition-all hover:shadow-xl">
              <Utensils className="text-gold h-8 w-8" />
              <span className="text-charcoal text-[10px] font-bold uppercase tracking-widest">
                Room Service
              </span>
            </Card>
          </div>

          {/* Yield Insights - Section 7D.6 */}
          <Card className="border-emerald/20 bg-emerald/5 space-y-6 rounded-[40px] p-8">
            <div className="text-emerald flex items-center gap-3">
              <Zap className="h-6 w-6" />
              <h3 className="font-serif text-xl font-bold">Yield Insights</h3>
            </div>
            <p className="text-charcoal-600 text-xs leading-relaxed">
              La Fête du Vaudou approche (10 Janvier). L'IA suggère d'augmenter vos tarifs de
              <span className="font-bold"> +20%</span> pour maximiser votre RevPAR.
            </p>
            <Button fullWidth className="bg-emerald h-12 rounded-xl text-xs font-bold text-white">
              APPLIQUER LA STRATÉGIE
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
