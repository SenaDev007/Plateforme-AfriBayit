import * as React from 'react';
import { cn } from '../lib/cn';

export interface DividerProps {
  /** Text or element shown in the center */
  label?: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({
  label,
  className,
  orientation = 'horizontal',
}: DividerProps): React.ReactElement {
  if (orientation === 'vertical') {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn('bg-charcoal-100 h-full w-px self-stretch', className)}
      />
    );
  }

  if (label) {
    return (
      <div role="separator" className={cn('flex items-center gap-3', className)}>
        <div className="bg-charcoal-100 h-px flex-1" />
        <span className="text-charcoal-400 whitespace-nowrap text-xs">{label}</span>
        <div className="bg-charcoal-100 h-px flex-1" />
      </div>
    );
  }

  return <hr role="separator" className={cn('border-charcoal-100 border-0 border-t', className)} />;
}
