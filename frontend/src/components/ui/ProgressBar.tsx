'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  previousValue?: number;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  glowing?: boolean;
  className?: string;
}

const heightStyles = { sm: 'h-1', md: 'h-2', lg: 'h-3' };

export function ProgressBar({ value, previousValue, height = 'md', showLabel = false, label, glowing = false, className = '' }: ProgressBarProps) {
  // force intre 0 si 100 pt siguranta
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const startValue = previousValue !== undefined ? Math.min(Math.max(previousValue, 0), 100) : clampedValue;

  const raw = useMotionValue(startValue);
  const spring = useSpring(raw, { stiffness: 60, damping: 18, mass: 0.8 });
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      raw.set(clampedValue);
      return;
    }
    raw.set(clampedValue);
  }, [clampedValue, raw]);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs font-medium text-ink-tertiary">{label}</span>}
          {showLabel && <span className="text-xs font-medium text-xp-text tabular-nums">{clampedValue}%</span>}
        </div>
      )}

      <div className={`relative w-full overflow-hidden rounded-full bg-surface-border ${heightStyles[height]}`}>
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-xp to-xp-light ${glowing ? 'shadow-xp-glow' : ''}`}
          style={{ width: spring }}
        />

        {clampedValue > 0 && (
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%] animate-shimmer ${heightStyles[height]}`}
            style={{ width: spring }}
          />
        )}
      </div>
    </div>
  );
}