'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

export function LevelUpOverlay() {
  const { user } = useAuthStore();
  const [prevLevel, setPrevLevel] = useState(user?.level ?? 1);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user && user.level > prevLevel) {
      setShow(true);
      setPrevLevel(user.level);
      const timer = setTimeout(() => setShow(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [user?.level, prevLevel, user]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-4xl font-display font-bold text-xp mb-2 tracking-widest uppercase">
              Level Up
            </h2>
            <p className="text-xl text-ink-primary font-mono">
              You reached Level {user?.level}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}