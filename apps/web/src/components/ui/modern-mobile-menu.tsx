'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Compass,
  Search,
  Heart,
  User,
  Shield,
  CreditCard,
  MessageCircle,
  Trophy,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type IconComponentType = React.ElementType<{ className?: string }>;

export interface InteractiveMenuItem {
  label: string;
  icon: IconComponentType;
  href: string;
}

export interface InteractiveMenuProps {
  items?: InteractiveMenuItem[];
  accentColor?: string;
  className?: string;
}

const defaultItems: InteractiveMenuItem[] = [
  { label: 'Accueil', icon: Home, href: '/' },
  { label: 'Portefeuille', icon: LineChart, href: '/dashboard/portefeuille' },
  { label: 'Séquestre', icon: CreditCard, href: '/dashboard/transactions' },
  { label: 'Messages', icon: MessageCircle, href: '/dashboard/messages' },
  { label: 'Récompenses', icon: Trophy, href: '/dashboard/recompenses' },
  { label: 'Profil', icon: User, href: '/dashboard' },
];

/**
 * Premium Interactive Menu for AfriBayit.
 * Features: Sliding line, Icon bounce, and Next.js routing.
 */
export const InteractiveMenu: React.FC<InteractiveMenuProps> = ({
  items,
  accentColor,
  className,
}) => {
  const pathname = usePathname();
  const finalItems = useMemo(() => items || defaultItems, [items]);

  // Find active index based on current path
  const activeIndex = useMemo(() => {
    const index = finalItems.findIndex(
      (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)),
    );
    return index === -1 ? 0 : index;
  }, [pathname, finalItems]);

  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const setLineWidth = () => {
      const activeItemElement = itemRefs.current[activeIndex];
      const activeTextElement = textRefs.current[activeIndex];

      if (activeItemElement && activeTextElement) {
        const textWidth = activeTextElement.offsetWidth;
        activeItemElement.style.setProperty('--lineWidth', `${textWidth}px`);
      }
    };

    setLineWidth();
    window.addEventListener('resize', setLineWidth);
    return () => window.removeEventListener('resize', setLineWidth);
  }, [activeIndex, finalItems]);

  const navStyle = useMemo(() => {
    return {
      '--component-active-color': accentColor || '#D4AF37',
    } as React.CSSProperties;
  }, [accentColor]);

  return (
    <nav className={cn('menu', className)} role="navigation" style={navStyle}>
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const IconComponent = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href as any}
            className={cn('menu__item', isActive && 'active')}
          >
            <div
              ref={(el) => (itemRefs.current[index] = el)}
              className="flex w-full flex-col items-center justify-center"
            >
              <div className="menu__icon">
                <IconComponent className="h-6 w-6" />
              </div>
              <strong
                className={cn('menu__text', isActive && 'active')}
                ref={(el) => (textRefs.current[index] = el)}
              >
                {item.label}
              </strong>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default InteractiveMenu;
