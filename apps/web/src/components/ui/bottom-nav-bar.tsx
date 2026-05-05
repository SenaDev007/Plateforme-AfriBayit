'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, LineChart, CreditCard, MessageCircle, Trophy, User } from 'lucide-react';

import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Accueil', icon: Home, href: '/' },
  { label: 'Portefeuille', icon: LineChart, href: '/dashboard/portefeuille' },
  { label: 'Séquestre', icon: CreditCard, href: '/dashboard/transactions' },
  { label: 'Messages', icon: MessageCircle, href: '/dashboard/messages' },
  { label: 'Récompenses', icon: Trophy, href: '/dashboard/recompenses' },
  { label: 'Profil', icon: User, href: '/dashboard' },
];

const MOBILE_LABEL_WIDTH = 85;

type BottomNavBarProps = {
  className?: string;
  stickyBottom?: boolean;
};

/**
 * Bottom Navigation Bar for AfriBayit Mobile View.
 * Implements "Noir & Or" design system with glassmorphism and real routing.
 */
export function BottomNavBar({ className, stickyBottom = true }: BottomNavBarProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        'dark:bg-charcoal/80 backdrop-blur-glass rounded-pill shadow-glass flex h-[64px] min-w-[320px] max-w-[95vw] items-center space-x-1 border border-white/20 bg-white/80 p-2 lg:hidden dark:border-white/10',
        stickyBottom && 'fixed inset-x-0 bottom-6 z-[100] mx-auto w-fit',
        className,
      )}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

        return (
          <Link key={item.label} href={item.href as any}>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className={cn(
                'rounded-pill relative flex h-12 min-w-[48px] items-center gap-0 px-4 py-2 transition-all duration-300',
                isActive
                  ? 'bg-navy shadow-gold gap-2 text-white'
                  : 'text-charcoal/40 hover:bg-charcoal/5 bg-transparent dark:text-white/40 dark:hover:bg-white/5',
              )}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 2}
                className={cn(
                  'transition-colors duration-300',
                  isActive ? 'text-gold' : 'currentColor',
                )}
              />

              <motion.div
                initial={false}
                animate={{
                  width: isActive ? `${MOBILE_LABEL_WIDTH}px` : '0px',
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? '4px' : '0px',
                }}
                transition={{
                  width: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  marginLeft: { duration: 0.2 },
                }}
                className={cn('flex items-center overflow-hidden')}
              >
                <span
                  className={cn(
                    'select-none whitespace-nowrap font-sans text-[10px] font-bold uppercase tracking-[0.1em]',
                    isActive ? 'text-white' : 'opacity-0',
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </motion.div>
          </Link>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
