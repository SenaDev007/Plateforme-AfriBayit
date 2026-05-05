'use client';
import React from 'react';
import { BottomNavBar } from '@/components/ui/bottom-nav-bar';

/**
 * Mobile Tab Bar Wrapper.
 * Uses the premium BottomNavBar component for consistent mobile navigation.
 */
export function MobileTabBar() {
  return <BottomNavBar stickyBottom={true} />;
}
