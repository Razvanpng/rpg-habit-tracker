'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { XpBar } from './XpBar';
import { getLevelTitle } from '@/lib/xp';

export function PlayerHUD() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const previousUserRef = useRef(user);

  if (!user) return null;

  const previousUser = previousUserRef.current ?? user;
  previousUserRef.current = user;

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <motion.header initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="sticky top-0 z-40 w-full border-b border-surface-border bg-surface/80 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-6">
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className="text-xl" role="img" aria-label="sword">⚔️</span>
          <span className="text-sm font-semibold text-ink-primary hidden sm:block">RPG Habits</span>
        </div>

        <div className="flex-1 flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 flex items-center gap-2 bg-xp-muted border border-xp/20 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-xp-text">LVL</span>
            <motion.span key={user.level} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-sm font-bold text-gradient-xp tabular-nums">
              {user.level}
            </motion.span>
          </div>
          <div className="flex-1 min-w-0 hidden sm:flex flex-col gap-0.5">
            <span className="text-2xs font-medium text-ink-tertiary tracking-wide">{getLevelTitle(user.level)}</span>
            <XpBar user={user} previousUser={previousUser} compact />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-ink-tertiary hidden md:block truncate max-w-[140px]">{user.email}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>Sign out</Button>
        </div>
      </div>
    </motion.header>
  );
}