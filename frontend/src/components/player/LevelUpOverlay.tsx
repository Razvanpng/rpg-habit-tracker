'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { useAuthStore } from '@/store/authStore';
import { getLevelTitle } from '@/lib/xp';

function EmberParticle({ index }: { index: number }) {
  const angle = (index / 10) * 360;
  const radius = 70 + (index % 3) * 28;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute w-0.5 h-0.5 rounded-full bg-xp pointer-events-none"
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{
        duration: 0.9 + index * 0.04,
        delay: index * 0.025,
        ease: 'easeOut',
      }}
    />
  );
}

export function LevelUpOverlay() {
  const { levelUpEvent, clearLevelUp } = useHabitStore();
  const { user, updateUser } = useAuthStore();

  const dismiss = useCallback(() => {
    clearLevelUp();
  }, [clearLevelUp]);

  useEffect(() => {
    if (!levelUpEvent) return;
    const timer = setTimeout(dismiss, 4000);
    return () => clearTimeout(timer);
  }, [levelUpEvent, dismiss]);

  useEffect(() => {
    if (levelUpEvent && user && user.level !== levelUpEvent.newLevel) {
      updateUser({ ...user, level: levelUpEvent.newLevel });
    }
  }, [levelUpEvent]);

  useEffect(() => {
    if (!levelUpEvent) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [levelUpEvent, dismiss]);

  return (
    <AnimatePresence>
      {levelUpEvent && (
        <motion.div
          key="levelup-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.18 }}
          onClick={dismiss}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/82 cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label="Level up notification"
        >
          <div className="absolute flex items-center justify-center inset-0 pointer-events-none">
            <div className="relative w-1 h-1 flex items-center justify-center">
              {Array.from({ length: 10 }, (_, i) => (
                <EmberParticle key={i} index={i} />
              ))}
            </div>
          </div>

          <motion.div
            key="levelup-panel"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.88, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.04 }}
            className="relative z-10 bg-surface-raised border border-xp/25 px-14 py-10 text-center shadow-[0_8px_48px_rgba(0,0,0,0.9)] corner-accents"
          >
            <motion.div
              initial={{ scale: 0.6, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.12 }}
              className="text-4xl mb-5 block"
              role="img"
              aria-label="crown"
            >
              👑
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="text-2xs font-display text-xp/70 tracking-[0.3em] uppercase mb-3"
            >
              Level Up
            </motion.p>

            <motion.div
              key={levelUpEvent.newLevel}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              className="text-7xl font-display font-bold text-gradient-xp tabular leading-none mb-2"
            >
              {levelUpEvent.newLevel}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.32 }}
              className="text-base font-display text-ink-secondary tracking-wide"
            >
              {getLevelTitle(levelUpEvent.newLevel)}
            </motion.p>

            <div className="w-16 h-px bg-xp/20 mx-auto my-4" />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-2xs font-mono text-ink-disabled tracking-widest"
            >
              Click anywhere · Esc · Auto-closes
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}