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
    { label, error, hint, leftElement, rightElement, className = '', id, ...props },
    ref
  ) {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-2xs font-display font-medium text-ink-tertiary tracking-widest uppercase">
            {label}
          </label>
        )}
        <div
          className={[
            'flex items-center gap-2 h-11 px-3.5 bg-surface-deep transition-colors duration-150',
            error ? 'border border-danger/50' : isFocused ? 'border border-xp/50' : 'border border-surface-border hover:border-surface-bright',
            'shadow-card rounded-sm',
          ].join(' ')}
        >
          {leftElement && <span className="text-ink-tertiary flex-shrink-0 text-sm">{leftElement}</span>}
          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
            className={[
              'flex-1 bg-transparent min-w-0 outline-none text-sm font-sans text-ink-primary placeholder:text-ink-disabled',
              '[&:-webkit-autofill]:[-webkit-text-fill-color:#e2d5bc]',
              '[&:-webkit-autofill]:[box-shadow:0_0_0_40px_#080808_inset]',
              className,
            ].join(' ')}
            {...props}
          />
          {rightElement && <span className="text-ink-tertiary flex-shrink-0 text-xs">{rightElement}</span>}
        </div>
        <AnimatePresence mode="wait">
          {(error ?? hint) && (
            <motion.p
              key={error ?? hint}
              initial={{ opacity: 0, y: -3, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -3, height: 0 }}
              transition={{ duration: 0.15 }}
              className={`text-xs font-sans ${error ? 'text-danger' : 'text-ink-tertiary'}`}
            >
              {error ?? hint}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);