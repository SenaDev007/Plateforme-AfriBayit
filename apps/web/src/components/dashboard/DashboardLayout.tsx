'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  LayoutDashboard,
  Heart,
  CreditCard,
  Bell,
  Settings,
  User,
  Building2,
  MessageSquare,
  GraduationCap,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Wallet,
  Gavel,
  Compass,
  Beaker,
  Share2,
} from 'lucide-react';
import { cn } from '@afribayit/ui/src/lib/cn';
import { useNotifications } from '@/hooks/useNotifications';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS: Array<{ label: string; href: Route; icon: React.ElementType }> = [
  { label: "Vue d'ensemble", href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mes annonces', href: '/dashboard/annonces', icon: Building2 },
  { label: 'Favoris', href: '/dashboard/favoris', icon: Heart },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Mes formations', href: '/dashboard/formations', icon: GraduationCap },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Profil & KYC', href: '/dashboard/profil', icon: User },
  { label: 'Ambassadeurs', href: '/dashboard/ambassadeur', icon: Share2 },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { unreadCount } = useNotifications();

  const firstName = session?.user?.name ?? '';
  const email = session?.user?.email ?? '';
  const initials = firstName
    ? firstName.slice(0, 2).toUpperCase()
    : email.slice(0, 2).toUpperCase();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/connexion');
  };

  return (
    <div className="text-charcoal flex min-h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-navy fixed inset-y-0 left-0 z-50 w-72 text-white shadow-2xl',
          'flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Logo Section */}
        <div className="flex h-24 items-center border-b border-white/5 px-8">
          <Link href="/" className="group flex items-center gap-1.5">
            <div className="bg-gold/20 border-gold/30 flex h-8 w-8 items-center justify-center rounded-lg border">
              <div className="bg-gold h-4 w-4 rounded-sm" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight">
              Afri<span className="text-gold">Bayit</span>
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto text-white/40 hover:text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Context */}
        <div className="px-6 py-8">
          <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="bg-gold/10 absolute right-0 top-0 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-xl transition-opacity group-hover:opacity-100" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="from-gold/80 to-gold text-navy shadow-gold/20 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-lg font-bold shadow-lg">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="mb-1 truncate text-sm font-bold leading-none">
                  {firstName || 'Propriétaire'}
                </p>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="text-gold h-3 w-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Niveau 2 vérifié
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 space-y-1.5 overflow-y-auto px-4 pb-8">
          <p className="px-6 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            Menu Principal
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-gold text-navy shadow-gold/10 shadow-lg'
                    : 'text-white/50 hover:bg-white/5 hover:text-white',
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5',
                    isActive ? 'text-navy' : 'transition-transform group-hover:scale-110',
                  )}
                />
                <span className="flex-1 font-bold tracking-tight">{item.label}</span>
                {item.href === '/dashboard/notifications' && unreadCount > 0 && (
                  <span className="bg-gold-600 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="bg-navy absolute left-0 h-6 w-1.5 rounded-r-full"
                  />
                )}
              </Link>
            );
          })}

          {/* Professional Section: Notary */}
          {session?.user?.role === 'NOTARY' && (
            <div className="mt-8 space-y-1.5">
              <p className="text-gold/60 px-6 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                Espace Professionnel
              </p>
              <Link
                href="/dashboard/notaire"
                className={cn(
                  'group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300',
                  pathname === '/dashboard/notaire'
                    ? 'bg-gold text-navy shadow-gold/10 shadow-lg'
                    : 'text-white/50 hover:bg-white/5 hover:text-white',
                )}
              >
                <Gavel
                  className={cn(
                    'h-5 w-5',
                    pathname === '/dashboard/notaire'
                      ? 'text-navy'
                      : 'transition-transform group-hover:scale-110',
                  )}
                />
                <span className="flex-1 font-bold tracking-tight">Dossiers Notaire</span>
              </Link>
            </div>
          )}

          {/* Professional Section: Surveyor */}
          {session?.user?.role === 'SURVEYOR' && (
            <div className="mt-8 space-y-1.5">
              <p className="text-gold/60 px-6 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                GeoTrust Portal
              </p>
              <Link
                href="/dashboard/geotrust"
                className={cn(
                  'group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300',
                  pathname === '/dashboard/geotrust'
                    ? 'bg-gold text-navy shadow-gold/10 shadow-lg'
                    : 'text-white/50 hover:bg-white/5 hover:text-white',
                )}
              >
                <Compass
                  className={cn(
                    'h-5 w-5',
                    pathname === '/dashboard/geotrust'
                      ? 'text-navy'
                      : 'transition-transform group-hover:scale-110',
                  )}
                />
                <span className="flex-1 font-bold tracking-tight">Missions Géomètre</span>
              </Link>
            </div>
          )}
          {/* Admin Section: Developer Lab */}
          {(session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN') && (
            <div className="mt-8 space-y-1.5">
              <p className="text-gold/60 px-6 pb-2 text-[10px] font-bold uppercase tracking-[0.2em]">
                Dev Sandbox
              </p>
              <Link
                href="/dashboard/dev"
                className={cn(
                  'group relative flex items-center gap-4 overflow-hidden rounded-2xl px-6 py-4 text-sm font-medium transition-all duration-300',
                  pathname === '/dashboard/dev'
                    ? 'bg-gold text-navy shadow-gold/10 shadow-lg'
                    : 'text-white/50 hover:bg-white/5 hover:text-white',
                )}
              >
                <Beaker
                  className={cn(
                    'h-5 w-5',
                    pathname === '/dashboard/dev'
                      ? 'text-navy'
                      : 'transition-transform group-hover:scale-110',
                  )}
                />
                <span className="flex-1 font-bold tracking-tight">Labo Simulations</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Footer actions */}
        <div className="space-y-4 border-t border-white/5 p-6">
          <button
            onClick={() => router.push('/dashboard/parametres' as Route)}
            className="flex w-full items-center gap-4 px-6 py-3 text-sm font-bold text-white/40 transition-colors hover:text-white"
          >
            <Settings className="h-5 w-5" />
            Paramètres
          </button>
          <button
            onClick={handleSignOut}
            className="hover:text-gold flex w-full items-center gap-4 px-6 py-3 text-sm font-bold text-white/30 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header */}
        <header className="border-charcoal-100 sticky top-0 z-40 flex h-24 items-center justify-between border-b bg-white/50 px-8 backdrop-blur-xl">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="bg-charcoal-50 flex h-10 w-10 items-center justify-center rounded-xl lg:hidden"
          >
            <Menu className="text-charcoal h-6 w-6" />
          </button>

          <div className="bg-charcoal-50 border-charcoal-100 hidden h-12 w-96 items-center gap-3 rounded-2xl border px-4 md:flex">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="text-charcoal-400 text-[11px] font-bold uppercase tracking-widest">
              Marché Immobilier Ouvert
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="mr-4 hidden flex-col items-end sm:flex">
              <p className="text-charcoal-400 mb-1 text-[10px] font-bold uppercase tracking-widest">
                Portefeuille
              </p>
              <div className="flex items-center gap-2">
                <Wallet className="text-navy h-4 w-4" />
                <span className="font-serif text-lg font-bold">
                  1 250 000{' '}
                  <span className="text-charcoal-400 font-sans text-xs font-medium">XOF</span>
                </span>
              </div>
            </div>

            <Link
              href="/dashboard/notifications"
              className="border-charcoal-100 text-charcoal-400 hover:text-navy relative flex h-12 w-12 items-center justify-center rounded-2xl border bg-white transition-all hover:shadow-lg"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="bg-gold absolute right-3 top-3 h-2.5 w-2.5 rounded-full border-2 border-white" />
              )}
            </Link>
          </div>
        </header>

        {/* Viewport */}
        <main className="no-scrollbar flex-1 overflow-y-auto p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
