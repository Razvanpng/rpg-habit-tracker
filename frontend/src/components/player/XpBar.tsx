'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getProgressSnapshot, formatXp } from '@/lib/xp';
import type { User } from '@/types';

interface XpBarProps {
  user: User;
  previousUser?: User;
  compact?: boolean;
  glowing?: boolean;
  striped?: boolean;
  height?: 'xs' | 'sm' | 'md' | 'lg';
}

export function XpBar({
  user,
  previousUser,
  compact = false,
  glowing = false,
  striped = false,
  height,
}: XpBarProps) {
  const current = getProgressSnapshot(user);
  const previous = previousUser ? getProgressSnapshot(previousUser) : current;

  const didLevelUp = !!previousUser && user.level > previousUser.level;
  const [showGain, setShowGain] = useState(false);

  const gainAmount = previousUser
    ? user.currentXp - previousUser.currentXp + (didLevelUp ? previousUser.xpToNextLevel : 0)
    : 0;

  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (gainAmount > 0) {
      setShowGain(true);
      const t = setTimeout(() => setShowGain(false), 2200);
      return () => clearTimeout(t);
    }
  }, [gainAmount]);

  const resolvedHeight = height ?? (compact ? 'xs' : 'sm');

  return (
    <div className={`flex flex-col gap-${compact ? '1' : '1.5'}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <span className="text-2xs font-display text-ink-tertiary tracking-widest uppercase">
            Experience
          </span>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {showGain && gainAmount > 0 && (
                <motion.span
                  key="xp-gain"
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                  className="text-2xs font-mono font-semibold text-xp"
                >
                  +{formatXp(gainAmount)}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-2xs font-mono text-ink-tertiary tabular">
              {formatXp(current.currentXp)}&nbsp;/&nbsp;{formatXp(current.xpToNextLevel)}
            </span>
          </div>
        </div>
      )}

      <ProgressBar
        value={current.progressPercent}
        previousValue={didLevelUp ? 0 : previous.progressPercent}
        height={resolvedHeight}
        glowing={glowing}
        striped={striped}
        color="xp"
      />
    </div>
  );
}