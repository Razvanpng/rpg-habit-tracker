'use client';

import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  padded?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  function Card({ hoverable = false, padded = true, children, className = '', ...props }, ref) {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -2 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={[
          'bg-surface-raised rounded-2xl shadow-card border border-surface-border',
          hoverable ? 'cursor-pointer hover:shadow-card-hover hover:border-ink-disabled transition-all duration-200' : '',
          padded ? 'p-6' : '',
          className,
        ].join(' ')}
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
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-primary tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-ink-tertiary mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  );
}