'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType | null>(null);

function useTabsContext() {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>');
  return ctx;
}

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: TabsProps): React.ReactElement {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const activeTab = value ?? internalValue;

  const setActiveTab = React.useCallback(
    (v: string) => {
      setInternalValue(v);
      onValueChange?.(v);
    },
    [onValueChange],
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  items: TabItem[];
  className?: string;
  /** Underline style (default) vs pill style */
  variant?: 'underline' | 'pill';
}

export function TabsList({
  items,
  className,
  variant = 'underline',
}: TabsListProps): React.ReactElement {
  const { activeTab, setActiveTab } = useTabsContext();

  return (
    <div
      role="tablist"
      className={cn(
        variant === 'underline' && 'border-charcoal-100 flex gap-0 border-b',
        variant === 'pill' && 'bg-charcoal-50 flex gap-1 rounded-xl p-1',
        className,
      )}
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          type="button"
          disabled={item.disabled}
          aria-selected={activeTab === item.value}
          onClick={() => !item.disabled && setActiveTab(item.value)}
          className={cn(
            'inline-flex items-center gap-1.5 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40',
            variant === 'underline' && [
              '-mb-px border-b-2 px-4 py-2.5',
              activeTab === item.value
                ? 'border-navy text-navy'
                : 'text-charcoal-400 hover:text-charcoal border-transparent',
            ],
            variant === 'pill' && [
              'rounded-lg px-3 py-1.5',
              activeTab === item.value
                ? 'text-navy bg-white shadow-sm'
                : 'text-charcoal-400 hover:text-charcoal',
            ],
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export function TabsContent({
  value,
  children,
  className,
}: TabsContentProps): React.ReactElement | null {
  const { activeTab } = useTabsContext();
  if (activeTab !== value) return null;
  return (
    <div role="tabpanel" className={cn('mt-4', className)}>
      {children}
    </div>
  );
}
