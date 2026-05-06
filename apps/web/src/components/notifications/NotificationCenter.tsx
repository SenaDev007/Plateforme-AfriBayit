'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
  Settings,
  Trash2,
  UserPlus,
  FileText,
  Zap,
  MoreHorizontal,
  Clock,
  Heart,
  GraduationCap,
} from 'lucide-react';
import { Card, Badge, Button, cn } from '@afribayit/ui';

type NotifCategory = 'ALL' | 'TRANSACTIONS' | 'LISTINGS' | 'COMMUNITY' | 'REBECCA';

const NOTIFICATIONS = [
  {
    id: 1,
    category: 'COMMUNITY',
    title: 'Consultation de profil',
    desc: 'Kofi Mensah et 3 autres personnes ont consulté votre profil.',
    time: '2h',
    icon: UserPlus,
    color: 'sky',
    unread: true,
    grouped: true,
  },
  {
    id: 2,
    category: 'REBECCA',
    title: 'Recommandation intelligente',
    desc: 'Rebecca : Un nouvel acheteur recherche exactement ce que vous vendez à Cotonou.',
    time: '4h',
    icon: Zap,
    color: 'gold',
    unread: true,
  },
  {
    id: 3,
    category: 'TRANSACTIONS',
    title: 'Fonds en Escrow',
    desc: 'Le séquestre pour le dossier TRX-9921 a été alimenté. Signature attendue.',
    time: '1j',
    icon: ShieldCheck,
    color: 'emerald',
    unread: false,
  },
  {
    id: 4,
    category: 'LISTINGS',
    title: 'Favoris',
    desc: '5 personnes ont ajouté votre Villa Cocody à leurs favoris.',
    time: '2j',
    icon: Heart,
    color: 'navy',
    unread: false,
    grouped: true,
  },
  {
    id: 5,
    category: 'COMMUNITY',
    title: 'Niveau atteint',
    desc: "Félicitations ! Votre score de 300 vous propulse au rang d'Expert.",
    time: '3j',
    icon: Award,
    color: 'gold',
    unread: false,
  },
];

export function NotificationCenter() {
  const [filter, setFilter] = useState<NotifCategory>('ALL');
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const filtered = notifs.filter((n) => filter === 'ALL' || n.category === filter);
  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <Card className="border-charcoal-100 flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-[40px] bg-white p-0 shadow-2xl">
      {/* Header — 5.8.2 */}
      <div className="border-charcoal-50 bg-navy flex items-center justify-between border-b p-8 text-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="border-navy absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 bg-rose-500 text-[8px] font-black">
                {unreadCount}
              </span>
            )}
          </div>
          <h2 className="font-serif text-xl font-bold">Notifications</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="rounded-xl p-2 text-white hover:bg-white/10"
            onClick={() => setNotifs((n) => n.map((it) => ({ ...it, unread: false })))}
            title="Tout marquer comme lu (5.8.2)"
          >
            <CheckCircle2 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" className="rounded-xl p-2 text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Tabs — 5.8.2 */}
      <div className="border-charcoal-50 no-scrollbar flex gap-2 overflow-x-auto whitespace-nowrap border-b px-6 py-4">
        {(['ALL', 'TRANSACTIONS', 'LISTINGS', 'COMMUNITY', 'REBECCA'] as NotifCategory[]).map(
          (cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                'rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-all',
                filter === cat
                  ? 'bg-navy border-navy text-white'
                  : 'text-charcoal-400 border-charcoal-100 hover:border-navy bg-white',
              )}
            >
              {cat === 'ALL' ? 'Tout' : cat}
            </button>
          ),
        )}
      </div>

      {/* List — 5.8.2 */}
      <div className="no-scrollbar flex-1 overflow-y-auto py-4">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={cn(
                  'hover:bg-charcoal-50 group relative flex cursor-pointer gap-5 px-8 py-6 transition-colors',
                  notif.unread && 'bg-navy/[0.02]',
                )}
              >
                {notif.unread && (
                  <div className="bg-navy absolute left-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full" />
                )}
                <div
                  className={cn(
                    'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] shadow-sm',
                    notif.color === 'navy'
                      ? 'bg-navy/5 text-navy'
                      : notif.color === 'gold'
                        ? 'bg-gold/10 text-gold'
                        : 'bg-emerald/10 text-emerald',
                  )}
                >
                  <notif.icon className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between">
                    <h4 className="text-charcoal truncate text-sm font-bold">{notif.title}</h4>
                    <span className="text-charcoal-300 text-[10px] font-medium">{notif.time}</span>
                  </div>
                  <p className="text-charcoal-500 text-xs leading-relaxed">{notif.desc}</p>

                  {/* Action rapide — 5.8.2 */}
                  <div className="flex gap-4 pt-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <button className="text-navy text-[10px] font-bold hover:underline">
                      REJOINDRE
                    </button>
                    <button className="text-charcoal-400 hover:text-navy text-[10px] font-bold">
                      IGNORER
                    </button>
                  </div>
                </div>
                <button className="text-charcoal-300 hover:text-navy p-2 opacity-0 transition-all group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          ) : (
            <div className="flex h-full flex-col items-center justify-center space-y-4 p-10 text-center">
              <div className="bg-charcoal-50 text-charcoal-200 flex h-16 w-16 items-center justify-center rounded-full">
                <Bell className="h-8 w-8" />
              </div>
              <div>
                <p className="text-charcoal font-bold">Aucune notification</p>
                <p className="text-charcoal-400 text-xs">
                  Vous êtes à jour ! Profitez-en pour explorer la communauté.
                </p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer — 5.8.2 */}
      <div className="border-charcoal-50 border-t p-6 text-center">
        <button className="text-navy text-xs font-black uppercase tracking-widest hover:underline">
          Voir toutes les notifications
        </button>
      </div>
    </Card>
  );
}

function Award({ className }: { className?: string }) {
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
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  );
}
