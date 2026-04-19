import * as React from 'react';
import { cn } from '../lib/cn';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Round corners fully */
  rounded?: boolean;
}

/** Loading placeholder with shimmer animation */
export function Skeleton({ className, rounded = false, ...props }: SkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(
        'animate-shimmer bg-gradient-to-r from-charcoal-100 via-charcoal-50 to-charcoal-100',
        'bg-[length:200%_100%]',
        rounded ? 'rounded-full' : 'rounded-md',
        className,
      )}
      aria-busy="true"
      aria-label="Chargement…"
      {...props}
    />
  );
}

/** Property card skeleton */
export function PropertyCardSkeleton(): React.ReactElement {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-charcoal-100">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-5 w-32 mt-2" />
      </div>
    </div>
  );
}
