'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { getLevelTitle } from '@/lib/xp';
import { useAuthStore } from '@/store/authStore';

function Particle({ i }: { i: number }) {
  const angle = (i / 12) * 360;
  const radius = 80 + Math.random() * 60;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return <motion.div className="absolute w-1.5 h-1.5 rounded-full bg-xp-light" initial={{ x: 0, y: 0, opacity: 1, scale: 1 }} animate={{ x, y, opacity: 0, scale: 0 }} transition={{ duration: 0.8, delay: i * 0.03, ease: 'easeOut' }} />;
}

export function LevelUpOverlay() {
  const { levelUpEvent, clearLevelUp } = useHabitStore();
  const { user, updateUser } = useAuthStore();

  useEffect(() => {
    if (!levelUpEvent) return;
    const t = setTimeout(clearLevelUp, 3500); // dispare automat
    return () => clearTimeout(t);
  }, [levelUpEvent, clearLevelUp]);

  useEffect(() => {
    if (levelUpEvent && user) updateUser({ ...user, level: levelUpEvent.newLevel });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelUpEvent]);

  return (
    <AnimatePresence>
      {levelUpEvent && (
        <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={clearLevelUp} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer">
          <div className="relative flex items-center justify-center">
            {Array.from({ length: 12 }, (_, i) => <Particle key={i} i={i} />)}
            <motion.div initial={{ scale: 0.7, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-surface-overlay border border-xp/30 rounded-3xl px-12 py-10 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="absolute inset-0 rounded-3xl bg-xp/5 blur-xl" />
              <div className="text-5xl mb-4" role="img" aria-label="trophy">🏆</div>
              <p className="text-xs font-semibold text-xp-text tracking-[0.2em] uppercase mb-2">Level Up</p>
              <h2 className="text-6xl font-bold text-gradient-xp tabular-nums mb-1">{levelUpEvent.newLevel}</h2>
              <p className="text-lg font-medium text-ink-secondary">{getLevelTitle(levelUpEvent.newLevel)}</p>
              <p className="text-xs text-ink-tertiary mt-4">Tap anywhere to continue</p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}