import * as React from 'react';
import { cn } from '../lib/cn';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.ReactElement {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      {icon && (
        <div className="bg-charcoal-50 text-charcoal-300 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          {icon}
        </div>
      )}
      <h3 className="text-charcoal mb-1 text-base font-semibold">{title}</h3>
      {description && <p className="text-charcoal-400 mb-4 max-w-xs text-sm">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
