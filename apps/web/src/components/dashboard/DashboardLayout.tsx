'use client';
import type React from 'react';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Heart, CreditCard, Bell, Settings,
  User, Building2, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { cn } from '@afribayit/ui';
import { Badge } from '@afribayit/ui';

const NAV_ITEMS = [
  { label: 'Vue d\'ensemble', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Mes annonces', href: '/dashboard/annonces', icon: Building2 },
  { label: 'Favoris', href: '/dashboard/favoris', icon: Heart },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, badge: '3' },
  { label: 'Profil & KYC', href: '/dashboard/profil', icon: User },
  { label: 'Paramètres', href: '/dashboard/parametres', icon: Settings },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): React.ReactElement {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-charcoal-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-charcoal-100',
          'flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          'lg:relative lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation dashboard"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-charcoal-100">
          <Link href="/" className="font-serif text-2xl font-bold">
            <span className="text-navy">Afri</span>
            <span className="text-gold">Bayit</span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1 text-charcoal-400 hover:text-charcoal"
            aria-label="Fermer le menu"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* User mini */}
        <div className="px-5 py-4 border-b border-charcoal-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white font-semibold text-sm">
              AK
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-charcoal text-sm truncate">Aminata Koné</p>
              <div className="flex items-center gap-1">
                <Badge variant="success" className="text-[10px] py-0">KYC ✓</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ label, href, icon: Icon, badge }) => {
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
                {badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-[10px] font-bold">
                    {badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-3 w-3 text-navy" aria-hidden="true" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-charcoal-100">
          <button
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-400 hover:bg-danger/5 hover:text-danger transition-colors w-full"
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
          className="fixed inset-0 z-40 bg-charcoal/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-charcoal-100 flex items-center px-4 sm:px-6 gap-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 text-charcoal-400 hover:text-charcoal"
            aria-label="Ouvrir le menu"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <button
            className="relative p-2 text-charcoal-400 hover:text-charcoal rounded-lg hover:bg-charcoal-50"
            aria-label="Notifications (3 non lues)"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger" aria-hidden="true" />
          </button>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
