'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, Heart, User, Compass } from 'lucide-react';
import { cn } from '@afribayit/ui/src/lib/cn';
import { motion } from 'framer-motion';

const TABS = [
  { label: 'Accueil', href: '/', icon: Home },
  { label: 'Découvrir', href: '/recherche', icon: Compass },
  { label: 'Recherche', href: '/recherche?focus=search', icon: Search },
  { label: 'Favoris', href: '/dashboard/favoris', icon: Heart },
  { label: 'Compte', href: '/dashboard', icon: User },
];

export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav className="border-charcoal-100 pb-safe-area-inset-bottom fixed inset-x-0 bottom-0 z-[60] h-20 border-t bg-white/80 px-2 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex h-full max-w-md items-center justify-around">
        {TABS.map((tab) => {
          const isActive =
            pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href as any}
              className="group relative flex h-full w-16 flex-col items-center justify-center gap-1"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="bg-navy absolute -top-1 h-1 w-8 rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <tab.icon
                className={cn(
                  'h-6 w-6 transition-all duration-300',
                  isActive ? 'text-navy scale-110' : 'text-charcoal-400 group-active:scale-90',
                )}
              />
              <span
                className={cn(
                  'text-[10px] font-bold uppercase tracking-widest',
                  isActive ? 'text-navy' : 'text-charcoal-400',
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
