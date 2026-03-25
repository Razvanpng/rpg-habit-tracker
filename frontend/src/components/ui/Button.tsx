'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-surface-overlay text-xp font-semibold border border-xp/35',
    'hover:bg-surface-hover hover:border-xp/60 hover:text-xp-light',
    'active:bg-surface-deep active:border-xp/25 shadow-button-gold',
  ].join(' '),
  secondary: [
    'bg-surface-raised text-ink-secondary font-medium border border-surface-border',
    'hover:bg-surface-hover hover:border-surface-bright hover:text-ink-primary',
    'active:bg-surface-deep shadow-button',
  ].join(' '),
  ghost: [
    'bg-transparent text-ink-secondary font-medium border border-transparent',
    'hover:bg-surface-hover hover:text-ink-primary hover:border-surface-border active:bg-surface-deep',
  ].join(' '),
  danger: [
    'bg-surface-overlay text-danger font-medium border border-danger/30',
    'hover:bg-surface-hover hover:border-danger/50 active:bg-surface-deep shadow-button',
  ].join(' '),
  outline: [
    'bg-transparent text-xp font-medium border border-xp/30',
    'hover:bg-xp-muted hover:border-xp/50 active:bg-surface-deep',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-6 px-2.5 text-2xs gap-1 rounded-sm',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-sm',
  md: 'h-10 px-4 text-sm gap-2 rounded-sm',
  lg: 'h-12 px-6 text-sm gap-2.5 rounded',
};

function Spinner() {
  return (
    <motion.span
      className="inline-block w-3.5 h-3.5 border border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, fullWidth = false, disabled, children, className = '', ...props },
    ref
  ) {
    const isDisabled = disabled ?? isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? {} : { scale: 0.975 }}
        transition={{ type: 'spring', stiffness: 600, damping: 30 }}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center transition-colors duration-150 select-none',
          'disabled:opacity-35 disabled:cursor-not-allowed disabled:pointer-events-none',
          variant === 'primary' ? 'font-display tracking-wider uppercase text-2xs' : '',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? 'w-full' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {isLoading ? <Spinner /> : (
          <>
            {leftIcon && <span className="flex-shrink-0 leading-none">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0 leading-none">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);