import type React from 'react';
import type { Metadata } from 'next';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export const metadata: Metadata = {
  title: 'Dashboard',
  robots: { index: false },
};

export default function DashboardPage(): React.ReactElement {
  return (
    <DashboardLayout>
      <DashboardOverview />
    </DashboardLayout>
  );
}
