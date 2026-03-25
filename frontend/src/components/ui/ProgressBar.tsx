'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  previousValue?: number;
  height?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  glowing?: boolean;
  striped?: boolean;
  className?: string;
  color?: 'xp' | 'success' | 'danger' | 'warning';
}

const heightMap = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const colorMap = {
  xp: 'from-xp-glow via-xp to-xp-bright',
  success: 'from-green-600 to-green-400',
  danger: 'from-red-700 to-red-500',
  warning: 'from-amber-600 to-amber-400',
};

const glowMap = {
  xp: '0 0 16px rgba(124, 58, 237, 0.7), 0 0 4px rgba(167, 139, 250, 0.4)',
  success: '0 0 12px rgba(34, 197, 94, 0.5)',
  danger: '0 0 12px rgba(239, 68, 68, 0.5)',
  warning: '0 0 12px rgba(245, 158, 11, 0.5)',
};

export function ProgressBar({
  value,
  previousValue,
  height = 'md',
  showLabel = false,
  label,
  glowing = false,
  striped = false,
  className = '',
  color = 'xp',
}: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const startVal = previousValue !== undefined
    ? Math.min(Math.max(previousValue, 0), 100)
    : clamped;

  const raw = useMotionValue(startVal);
  const spring = useSpring(raw, { stiffness: 55, damping: 16, mass: 0.9 });

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; }
    raw.set(clamped);
  }, [clamped, raw]);

  const widthPct = `${clamped}%`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-2xs font-medium text-ink-tertiary uppercase tracking-wide">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-2xs font-semibold text-xp-bright tabular-nums font-mono">
              {clamped}%
            </span>
          )}
        </div>
      )}

      <div
        className={[
          'relative w-full overflow-hidden rounded-full',
          'bg-surface-border/60',
          heightMap[height],
        ].join(' ')}
      >
        <motion.div
          className={[
            'absolute inset-y-0 left-0 rounded-full',
            `bg-gradient-to-r ${colorMap[color]}`,
          ].join(' ')}
          style={{
            width: spring,
            boxShadow: glowing ? glowMap[color] : 'none',
          }}
        />

        {clamped > 0 && striped && (
          <div
            className="absolute inset-0 rounded-full animate-shimmer"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              width: widthPct,
            }}
          />
        )}
      </div>
    </div>
  );
}