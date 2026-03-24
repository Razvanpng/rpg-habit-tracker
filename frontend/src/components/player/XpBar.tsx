'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getProgressSnapshot, formatXp } from '@/lib/xp';
import type { User } from '@/types';

export function XpBar({ user, previousUser, compact = false }: { user: User; previousUser?: User; compact?: boolean }) {
  const current = getProgressSnapshot(user);
  const previous = previousUser ? getProgressSnapshot(previousUser) : current;
  const didLevelUp = previousUser && user.level > previousUser.level;

  const [showGain, setShowGain] = useState(false);
  const gainAmount = previousUser ? user.currentXp - previousUser.currentXp + (didLevelUp ? previousUser.xpToNextLevel : 0) : 0;

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (gainAmount > 0) {
      setShowGain(true);
      const t = setTimeout(() => setShowGain(false), 2000);
      return () => clearTimeout(t);
    }
  }, [user.currentXp, user.level, gainAmount]);

  return (
    <div className={`flex flex-col gap-1 ${compact ? '' : 'gap-2'}`}>
      {!compact && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-ink-tertiary tracking-wide uppercase">Experience</span>
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {showGain && (
                <motion.span
                  key="xp-gain"
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="text-xs font-semibold text-xp-text"
                >
                  +{formatXp(gainAmount)}
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-xs text-ink-tertiary tabular-nums">
              {formatXp(current.currentXp)} / {formatXp(current.xpToNextLevel)}
            </span>
          </div>
        </div>
      )}
      <ProgressBar value={didLevelUp ? current.progressPercent : current.progressPercent} previousValue={didLevelUp ? 0 : previous.progressPercent} height={compact ? 'sm' : 'md'} glowing />
    </div>
  );
}