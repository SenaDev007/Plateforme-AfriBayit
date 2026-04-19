'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glassmorphism variant */
  glass?: boolean;
  /** Adds hover elevation animation */
  hoverable?: boolean;
  /** Remove default padding */
  noPadding?: boolean;
}

/** Glassmorphism card with optional hover animation */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glass = false, hoverable = false, noPadding = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg border bg-white',
          !noPadding && 'p-6',
          glass && [
            'bg-white/70 backdrop-blur-glass border-white/40',
            'shadow-glass',
          ],
          !glass && 'border-charcoal-100 shadow-card',
          hoverable && [
            'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            'hover:-translate-y-1.5 hover:shadow-card-hover',
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col gap-1.5 pb-4', className)} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('font-serif text-xl font-semibold text-charcoal', className)} {...props} />
  ),
);
CardTitle.displayName = 'CardTitle';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('text-sm text-charcoal-600', className)} {...props} />,
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2 pt-4', className)} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';
