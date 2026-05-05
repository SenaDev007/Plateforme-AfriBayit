import React from 'react';
import { InteractiveMenu } from '@/components/ui/modern-mobile-menu';

/**
 * Mobile Tab Bar Wrapper.
 * Uses the premium InteractiveMenu component for consistent mobile navigation.
 */
export function MobileTabBar() {
  return (
    <div className="fixed inset-x-0 bottom-6 z-[100] flex justify-center px-4 lg:hidden">
      <InteractiveMenu />
    </div>
  );
}
