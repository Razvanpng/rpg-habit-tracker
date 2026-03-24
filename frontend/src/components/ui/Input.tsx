'use client';

import { forwardRef, useState, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ label, error, hint, leftElement, rightElement, className = '', id, ...props }, ref) {
    const [isFocused, setIsFocused] = useState(false);
    // generam un id automat pt accesibilitate daca nu primim unul
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={inputId} className="text-sm font-medium text-ink-secondary">{label}</label>}

        <div
          className={[
            'flex items-center gap-2 bg-surface-overlay rounded-xl border transition-colors duration-150 px-3.5 h-11',
            error ? 'border-danger/50' : isFocused ? 'border-xp' : 'border-surface-border hover:border-ink-disabled',
          ].join(' ')}
        >
          {leftElement && <span className="text-ink-tertiary flex-shrink-0 text-sm">{leftElement}</span>}

          <input
            ref={ref}
            id={inputId}
            onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
            onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
            className={`flex-1 bg-transparent text-sm text-ink-primary placeholder:text-ink-disabled outline-none min-w-0 ${className}`}
            {...props}
          />

          {rightElement && <span className="text-ink-tertiary flex-shrink-0 text-sm">{rightElement}</span>}
        </div>

        {(error ?? hint) && (
          <p className={`text-xs ${error ? 'text-danger' : 'text-ink-tertiary'}`}>{error ?? hint}</p>
        )}
      </div>
    );
  }
);