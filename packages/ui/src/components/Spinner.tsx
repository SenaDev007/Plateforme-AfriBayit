import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const spinnerVariants = cva(
  'animate-spin rounded-full border-2 border-current border-t-transparent',
  {
    variants: {
      size: {
        xs: 'h-3 w-3',
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
        xl: 'h-12 w-12',
      },
      color: {
        navy: 'text-navy',
        gold: 'text-gold',
        white: 'text-white',
        charcoal: 'text-charcoal-400',
      },
    },
    defaultVariants: { size: 'md', color: 'navy' },
  },
);

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  label?: string;
  className?: string;
}

export function Spinner({
  size,
  color,
  label = 'Chargement…',
  className,
}: SpinnerProps): React.ReactElement {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex', className)}>
      <span className={spinnerVariants({ size, color })} aria-hidden="true" />
    </span>
  );
}

/** Full-page loading overlay */
export function LoadingOverlay({ label = 'Chargement…' }: { label?: string }): React.ReactElement {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="xl" />
        <p className="text-charcoal-400 text-sm font-medium">{label}</p>
      </div>
    </div>
  );
}
