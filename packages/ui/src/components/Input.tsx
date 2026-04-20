'use client';

import * as React from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  /** Icon placed at the left inside the input */
  leftIcon?: React.ReactNode;
  /** Icon or element placed at the right inside the input */
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightElement, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-charcoal">
            {label}
            {props.required && <span className="ml-1 text-danger" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3 text-charcoal-400 pointer-events-none" aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            className={cn(
              'w-full rounded-md border bg-white px-3 py-2.5 text-sm text-charcoal',
              'placeholder:text-charcoal-300',
              'transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-charcoal-50',
              leftIcon && 'pl-10',
              rightElement && 'pr-10',
              error
                ? 'border-danger focus:ring-danger/30 focus:border-danger'
                : 'border-charcoal-200',
              className,
            )}
            {...props}
          />

          {rightElement && (
            <span className="absolute right-3 text-charcoal-400">{rightElement}</span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-danger">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-charcoal-400">
            {hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
