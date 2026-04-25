'use client';

import Link from 'next/link';
import { Users, ShieldCheck, LayoutDashboard, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { label: 'Vérification KYC', href: '/admin/kyc', icon: ShieldCheck },
  { label: 'Utilisateurs', href: '/admin/users', icon: Users },
  { label: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-800 p-6">
        <h1 className="text-xl font-bold">AfriBayit Admin</h1>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
              pathname === item.href
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white',
            )}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4 text-center text-xs text-slate-500">
        © 2026 AfriBayit Admin
      </div>
    </aside>
  );
}
