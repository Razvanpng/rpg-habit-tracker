'use client';

import { useAuthStore } from '@/store/authStore';
import { getLevelTitle } from '@/lib/xp';

export function PlayerHUD() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-raised border-b border-surface-border px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-sm bg-surface-deep border border-xp/30 flex items-center justify-center font-display font-bold text-xp text-sm shadow-card">
          {user.level}
        </div>
        <div>
          <h1 className="text-sm font-display font-semibold text-ink-primary tracking-wider uppercase">
            {getLevelTitle(user.level)}
          </h1>
          <p className="text-xs text-ink-tertiary font-mono">Level {user.level}</p>
        </div>
      </div>
    </header>
  );
}