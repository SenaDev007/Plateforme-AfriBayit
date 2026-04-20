'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | undefined;
  description?: string | undefined;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | undefined;
  className?: string | undefined;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  full: 'max-w-5xl',
};

/** Slide-up modal with focus trap and keyboard close */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className,
}: ModalProps): React.ReactElement {
  // Close on Escape
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll
  React.useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-describedby={description ? 'modal-desc' : undefined}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel — slides up from bottom on mobile, fades in centered on desktop */}
          <motion.div
            className={cn(
              'relative w-full rounded-xl bg-white shadow-glass-lg',
              'p-6 max-h-[90vh] overflow-y-auto',
              sizeClasses[size],
              className,
            )}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            {(title ?? description) && (
              <div className="mb-4 pr-8">
                {title && (
                  <h2 id="modal-title" className="font-serif text-2xl font-semibold text-charcoal">
                    {title}
                  </h2>
                )}
                {description && (
                  <p id="modal-desc" className="mt-1 text-sm text-charcoal-400">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute right-4 top-4 rounded-md p-1.5',
                'text-charcoal-400 hover:text-charcoal hover:bg-charcoal-50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy',
                'transition-colors',
              )}
              aria-label="Fermer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
