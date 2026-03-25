'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      label,
      error,
      hint,
      leftElement,
      rightElement,
      className = '',
      id,
      ...props
    },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium text-ink-secondary tracking-wide uppercase"
          >
            {label}
          </label>
        )}

        <div
          className={[
            'relative flex items-center gap-2',
            'rounded-xl px-3.5 h-11',
            'transition-all duration-200',
            'bg-surface-overlay/60 backdrop-blur-sm',
            error
              ? 'border border-danger/50 shadow-[0_0_12px_rgba(239,68,68,0.15)]'
              : isFocused
              ? 'border border-xp/60 shadow-xp-sm'
              : 'border border-surface-border hover:border-ink-disabled',
          ].join(' ')}
        >
          {leftElement && (
            <span className="text-ink-tertiary flex-shrink-0 text-sm">
              {leftElement}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={[
              'flex-1 bg-transparent text-sm text-ink-primary',
              'placeholder:text-ink-disabled',
              'outline-none min-w-0',
              'font-sans',
              className,
            ].join(' ')}
            {...props}
          />

          {rightElement && (
            <span className="text-ink-tertiary flex-shrink-0">
              {rightElement}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait">
          {(error ?? hint) && (
            <motion.p
              key={error ?? hint}
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              transition={{ duration: 0.15 }}
              className={`text-xs ${error ? 'text-danger' : 'text-ink-tertiary'}`}
            >
              {error ?? hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);