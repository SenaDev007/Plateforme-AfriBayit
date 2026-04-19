import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-pill px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-navy/10 text-navy',
        gold: 'bg-gold/15 text-gold-600',
        success: 'bg-emerald/10 text-emerald-600',
        danger: 'bg-danger/10 text-danger',
        sky: 'bg-sky/10 text-sky-600',
        outline: 'border border-current bg-transparent',
        trust: 'bg-emerald text-white',
        verified: 'bg-gold text-navy',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps): React.ReactElement {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
