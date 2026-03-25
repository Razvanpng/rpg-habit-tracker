'use client';

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  padded?: boolean;
  accentBorder?: boolean;
  ghost?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card(
    { hoverable = false, padded = true, accentBorder = false, ghost = false, children, className = '', ...props },
    ref
  ) {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2, transition: { type: 'spring', stiffness: 400, damping: 30 } } : {}}
        className={[
          ghost ? 'bg-transparent' : 'bg-surface-raised',
          accentBorder
            ? 'border-t border-t-xp/40 border-x border-b border-x-surface-border border-b-surface-border'
            : 'border border-surface-border',
          'shadow-card',
          hoverable ? 'cursor-pointer hover:border-surface-bright hover:shadow-card-hover transition-all duration-200' : '',
          padded ? 'p-5' : '',
          'rounded-sm',
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
  rune?: boolean;
}

export function CardHeader({ title, subtitle, action, rune = false }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h2
          className={[
            'text-sm tracking-wide text-ink-primary',
            rune ? 'font-display font-semibold tracking-widest uppercase' : 'font-semibold',
          ].join(' ')}
        >
          {title}
        </h2>
        {subtitle && <p className="text-xs text-ink-tertiary mt-0.5 font-sans">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardDivider({ className = '' }: { className?: string }) {
  return <div className={`w-full h-px bg-surface-border my-4 ${className}`} />;
}