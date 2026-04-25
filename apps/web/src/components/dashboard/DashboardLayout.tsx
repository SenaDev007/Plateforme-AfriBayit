'use client';
import type React from 'react';
import type { Route } from 'next';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Heart,
  CreditCard,
  Bell,
  Settings,
  User,
  Building2,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@afribayit/ui';
import { Badge } from '@afribayit/ui';
import { useNotifications } from '@/hooks/useNotifications';

const NAV_ITEMS: Array<{ label: string; href: Route; icon: React.ElementType }> = [
  { label: "Vue d'ensemble", href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mes annonces', href: '/dashboard/annonces', icon: Building2 },
  { label: 'Favoris', href: '/dashboard/favoris', icon: Heart },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Profil & KYC', href: '/dashboard/profil', icon: User },
  { label: 'Paramètres', href: '/dashboard/parametres', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="bg-charcoal-50 flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          'border-charcoal-100 fixed inset-y-0 left-0 z-50 w-64 border-r bg-white',
          'flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation dashboard"
      >
        {/* Logo */}
        <div className="border-charcoal-100 flex h-16 items-center justify-between border-b px-5">
          <Link href="/" className="font-serif text-2xl font-bold">
            <span className="text-navy">Afri</span>
            <span className="text-gold">Bayit</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-charcoal-400 hover:text-charcoal p-1 lg:hidden"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* User mini */}
        <div className="border-charcoal-100 border-b px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-navy flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-white">
              AK
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-charcoal truncate text-sm font-medium">Aminata Koné</p>
              <div className="flex items-center gap-1">
                <Badge variant="success" className="py-0 text-[10px]">
                  KYC ✓
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                  'transition-all duration-150',
                  isActive
                    ? 'bg-navy/10 text-navy'
                    : 'text-charcoal-400 hover:bg-charcoal-50 hover:text-charcoal',
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span className="flex-1">{label}</span>
                {href === '/dashboard/notifications' && unreadCount > 0 && (
                  <span className="bg-danger flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
                {isActive && <ChevronRight className="text-navy h-3 w-3" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-charcoal-100 border-t p-3">
          <button
            className="text-charcoal-400 hover:bg-danger/5 hover:text-danger flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
            aria-label="Se déconnecter"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {isSidebarOpen && (
        <div
          className="bg-charcoal/50 fixed inset-0 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="border-charcoal-100 sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-charcoal-400 hover:text-charcoal p-2 lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <Link
            href="/dashboard/notifications"
            className="text-charcoal-400 hover:text-charcoal hover:bg-charcoal-50 relative rounded-lg p-2"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} non lues)` : ''}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {unreadCount > 0 && (
              <span
                className="bg-danger absolute right-1.5 top-1.5 h-2 w-2 rounded-full"
                aria-hidden="true"
              />
            )}
          </Link>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
