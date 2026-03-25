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

const heightMap: Record<string, string> = {
  xs: 'h-px', sm: 'h-1', md: 'h-1.5', lg: 'h-2.5',
};

const colorMap: Record<string, { fill: string; track: string }> = {
  xp: { fill: '#d4af37', track: '#1a1508' },
  success: { fill: '#3d7a35', track: '#0a1408' },
  danger: { fill: '#8a1c1c', track: '#1a0808' },
  warning: { fill: '#a06820', track: '#181008' },
};

export function ProgressBar({ value, previousValue, height = 'md', showLabel = false, label, glowing = false, className = '', color = 'xp' }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 100);
  const startVal = Math.min(Math.max(previousValue ?? clamped, 0), 100);

  const raw = useMotionValue(startVal);
  const spring = useSpring(raw, { stiffness: 48, damping: 18, mass: 1.0 });

  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; }
    raw.set(clamped);
  }, [clamped, raw]);

  const { fill, track } = colorMap[color] ?? colorMap['xp'];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {(label !== undefined || showLabel) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-2xs font-display tracking-widest uppercase text-ink-tertiary">{label}</span>}
          {showLabel && <span className="text-2xs font-mono text-ink-tertiary tabular">{clamped}%</span>}
        </div>
      )}
      <div className={['relative w-full overflow-hidden', heightMap[height]].join(' ')} style={{ backgroundColor: track }}>
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            backgroundColor: fill,
            width: spring,
            boxShadow: glowing ? `2px 0 8px ${fill}55, 0 0 2px ${fill}88` : 'none',
          }}
        />
        <div className="absolute inset-0 flex pointer-events-none" aria-hidden>
          {[25, 50, 75].map((pct) => (
            <div key={pct} className="absolute top-0 bottom-0 w-px" style={{ left: `${pct}%`, backgroundColor: 'rgba(0,0,0,0.4)' }} />
          ))}
        </div>
      </div>
    </div>
  );
}