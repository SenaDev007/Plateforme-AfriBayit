'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';

const buttonVariants = cva(
  // Base styles — mobile-first, accessible, no outline on mouse but visible on keyboard
  [
    'inline-flex items-center justify-center gap-2',
    'font-sans font-medium text-sm leading-none',
    'transition-all duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'select-none cursor-pointer',
  ],
  {
    variants: {
      variant: {
        /** Navy pill — primary CTA */
        primary: [
          'bg-navy text-white rounded-pill',
          'hover:bg-navy-600 active:bg-navy-700',
          'focus-visible:ring-navy',
          'shadow-sm hover:shadow-md',
        ],
        /** Gold premium — upgrade / premium action */
        gold: [
          'bg-gold text-navy font-semibold rounded-pill',
          'hover:bg-gold-400 active:bg-gold-600',
          'focus-visible:ring-gold',
          'shadow-gold hover:shadow-lg',
        ],
        /** Ghost — secondary action */
        ghost: [
          'bg-transparent text-navy rounded-pill border border-navy/30',
          'hover:bg-navy/5 active:bg-navy/10',
          'focus-visible:ring-navy',
        ],
        /** Danger */
        danger: [
          'bg-danger text-white rounded-pill',
          'hover:bg-danger-600 active:bg-danger-700',
          'focus-visible:ring-danger',
        ],
        /** Outline sky */
        outline: [
          'bg-transparent text-sky border border-sky rounded-pill',
          'hover:bg-sky/10 active:bg-sky/20',
          'focus-visible:ring-sky',
        ],
      },
      size: {
        sm: 'h-8 px-4 text-xs',
        md: 'h-10 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show loading spinner */
  loading?: boolean;
  /** Stretch to full container width */
  fullWidth?: boolean;
  /** Render as motion element with press animation */
  animated?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, fullWidth, animated = true, children, disabled, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className);

    const content = (
      <>
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </>
    );

    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={classes}
          disabled={disabled ?? loading}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.1 }}
          {...(props as React.ComponentProps<typeof motion.button>)}
        >
          {content}
        </motion.button>
      );
    }

    return (
      <button ref={ref} className={classes} disabled={disabled ?? loading} {...props}>
        {content}
      </button>
    );
  },
);

Button.displayName = 'Button';
