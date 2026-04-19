import type React from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { ProfileForm } from '@/components/dashboard/ProfileForm';

export const metadata: Metadata = { title: 'Mon profil', robots: { index: false } };

export default function ProfilePage(): React.ReactElement {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-2xl">
        <h1 className="font-serif text-2xl font-bold text-charcoal">Profil & KYC</h1>
        <ProfileForm />
      </div>
    </DashboardLayout>
  );
}
