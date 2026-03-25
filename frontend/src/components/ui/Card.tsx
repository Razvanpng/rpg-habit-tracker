'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  padded?: boolean;
  glow?: boolean;
  glass?: boolean;
  neonBorder?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    {
      hoverable = false,
      padded = true,
      glow = false,
      glass = true,
      neonBorder = false,
      children,
      className = '',
      ...props
    },
    ref
  ) {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -3, transition: { type: 'spring', stiffness: 400, damping: 25 } } : {}}
        className={[
          'rounded-2xl overflow-hidden',
          glass ? 'glass' : 'bg-surface-raised border border-surface-border',
          glow ? 'shadow-xp' : '',
          neonBorder ? 'neon-border' : '',
          hoverable ? 'cursor-pointer transition-all duration-300 hover:shadow-card-lg' : '',
          padded ? 'p-6' : '',
          className,
        ].filter(Boolean).join(' ')}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  accent?: boolean;
}

export function CardHeader({ title, subtitle, action, accent = false }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2
          className={[
            'text-base font-semibold tracking-tight',
            accent ? 'text-gradient-xp' : 'text-ink-primary',
          ].join(' ')}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-ink-tertiary mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

interface CardDividerProps {
  className?: string;
}

export function CardDivider({ className = '' }: CardDividerProps) {
  return (
    <div
      className={`w-full h-px bg-gradient-to-r from-transparent via-surface-border to-transparent my-4 ${className}`}
    />
  );
}