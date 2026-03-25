'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-xp-gradient text-white font-semibold ' +
    'hover:brightness-110 active:brightness-90 ' +
    'border border-xp/30',
  secondary:
    'glass text-ink-primary font-medium ' +
    'hover:bg-surface-hover hover:border-xp/20 ' +
    'active:scale-[0.98]',
  ghost:
    'text-ink-secondary font-medium ' +
    'hover:text-ink-primary hover:bg-surface-hover ' +
    'border border-transparent hover:border-surface-border',
  danger:
    'bg-danger/10 text-danger font-medium ' +
    'border border-danger/25 ' +
    'hover:bg-danger/20 hover:border-danger/40',
  glass:
    'glass-light text-ink-secondary font-medium ' +
    'hover:text-ink-primary hover:bg-white/5 ' +
    'border-white/5',
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'h-7 px-2.5 text-2xs gap-1 rounded-lg',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-xl',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-2xl',
};

function Spinner() {
  return (
    <motion.span
      className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
    />
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      glow = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) {
    const isDisabled = disabled ?? isLoading;

    return (
      <motion.button
        ref={ref}
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center',
          'transition-all duration-200 select-none',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
          glow && variant === 'primary' ? 'shadow-xp hover:shadow-xp-strong' : '',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? 'w-full' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);