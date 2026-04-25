import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/cn';

const progressVariants = cva('h-full rounded-full transition-all duration-500 ease-out', {
  variants: {
    variant: {
      navy: 'bg-navy',
      gold: 'bg-gold',
      emerald: 'bg-emerald',
      sky: 'bg-sky',
      danger: 'bg-danger',
    },
  },
  defaultVariants: { variant: 'navy' },
});

const trackVariants = cva('relative overflow-hidden rounded-full bg-charcoal-100', {
  variants: {
    size: {
      xs: 'h-1',
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3',
      xl: 'h-4',
    },
  },
  defaultVariants: { size: 'md' },
});

export interface ProgressProps
  extends VariantProps<typeof progressVariants>, VariantProps<typeof trackVariants> {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant,
  size,
  label,
  showValue = false,
  className,
}: ProgressProps): React.ReactElement {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="text-charcoal-400 mb-1.5 flex items-center justify-between text-xs">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={trackVariants({ size })}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div className={progressVariants({ variant })} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/** KYC level progress with labels */
export function KycProgress({
  level,
}: {
  level: 'NONE' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
}): React.ReactElement {
  const levelMap = { NONE: 0, LEVEL_1: 33, LEVEL_2: 66, LEVEL_3: 100 };
  const labelMap = {
    NONE: 'Non vérifié',
    LEVEL_1: 'Niveau 1',
    LEVEL_2: 'Niveau 2',
    LEVEL_3: 'Niveau 3',
  };
  const variantMap = {
    NONE: 'danger',
    LEVEL_1: 'sky',
    LEVEL_2: 'gold',
    LEVEL_3: 'emerald',
  } as const;

  return (
    <Progress
      value={levelMap[level]}
      variant={variantMap[level]}
      label={`KYC : ${labelMap[level]}`}
      showValue
      size="lg"
    />
  );
}
