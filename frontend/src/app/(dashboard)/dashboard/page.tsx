'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { useAuthStore } from '@/store/authStore';
import { useCharacterStore } from '@/store/characterStore';
import { PlayerHUD } from '@/components/player/PlayerHUD';
import { LevelUpOverlay } from '@/components/player/LevelUpOverlay';
import { XpBar } from '@/components/player/XpBar';
import { HabitList } from '@/components/habits/HabitList';
import { HabitForm } from '@/components/habits/HabitForm';
import { CharacterHero } from '@/components/character/CharacterHero';
import { CharacterStats } from '@/components/character/CharacterStats';
import { CharacterCustomizer } from '@/components/character/CharacterCustomizer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getLevelTitle, formatXp, xpRequiredForLevel } from '@/lib/xp';
import type { HabitFormValues } from '@/types';

function ProgressCard() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <Card accentBorder padded={false} className="px-6 py-5">
      <div className="flex items-end justify-between mb-3">
        <div className="flex items-baseline gap-3">
          <p className="text-2xs font-display text-ink-tertiary tracking-[0.2em] uppercase">
            Level {user.level}
          </p>
          <h2 className="text-base font-display font-semibold text-gradient-xp">
            {getLevelTitle(user.level)}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-ink-secondary tabular">
            {formatXp(user.currentXp)}
          </p>
          <p className="text-2xs font-mono text-ink-disabled">
            / {formatXp(user.xpToNextLevel)}
          </p>
        </div>
      </div>
      <XpBar user={user} glowing height="md" />
    </Card>
  );
}

function StatsStrip() {
  const { user } = useAuthStore();
  const { habits } = useHabitStore();
  if (!user) return null;

  const total = habits.length;
  const done = habits.filter((h) => h.isCompletedToday).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const xpEarned = habits.filter((h) => h.isCompletedToday).reduce((s, h) => s + h.xpReward, 0);
  const remaining = xpRequiredForLevel(user.level) - user.currentXp;

  const tiles = [
    { label: 'Completed', value: `${done} / ${total}`, sub: `${pct}% today` },
    { label: 'XP Earned', value: formatXp(xpEarned), sub: 'this session' },
    { label: 'To Level', value: formatXp(remaining), sub: 'remaining' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {tiles.map(({ label, value, sub }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-surface-raised border border-surface-border px-4 py-3 shadow-card"
        >
          <p className="text-2xs font-display text-ink-tertiary tracking-widest uppercase mb-1">
            {label}
          </p>
          <p className="text-lg font-display font-semibold text-ink-primary tabular leading-tight">
            {value}
          </p>
          <p className="text-2xs font-mono text-ink-disabled mt-0.5">{sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

function CharacterPanel() {
  const [customizerOpen, setCustomizerOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col gap-4"
    >
      <Card padded={false} className="flex flex-col items-center py-10 px-6">
        <CharacterHero />
        <div className="w-full mt-7">
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setCustomizerOpen((o) => !o)}
            rightIcon={
              <motion.span animate={{ rotate: customizerOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-2xs leading-none">
                ▾
              </motion.span>
            }
          >
            Customize
          </Button>
          <AnimatePresence>
            {customizerOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-5 border-t border-surface-border mt-5">
                  <CharacterCustomizer />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
      <Card padded>
        <CharacterStats />
      </Card>
    </motion.div>
  );
}

interface HabitsPanelProps {
  onCreateClick: () => void;
}

function HabitsPanel({ onCreateClick }: HabitsPanelProps) {
  const { habits, isLoading } = useHabitStore();
  const pending = habits.filter((h) => !h.isCompletedToday).length;
  const completed = habits.filter((h) => h.isCompletedToday).length;

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.06 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-display font-semibold text-ink-primary tracking-wide">
            Daily Habits
          </h2>
          <p className="text-xs font-mono text-ink-tertiary mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            {habits.length > 0 && <span className="text-ink-disabled ml-2">· {pending} pending · {completed} done</span>}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={onCreateClick} leftIcon={<span className="font-sans text-base leading-none">+</span>}>
          New Habit
        </Button>
      </div>
      {habits.length > 0 && <StatsStrip />}
      <HabitList habits={habits} isLoading={isLoading} />
    </motion.div>
  );
}

export default function DashboardPage() {
  const { fetchHabits, createHabit } = useHabitStore();
  const { user } = useAuthStore();
  const { syncStatsWithLevel } = useCharacterStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    void fetchHabits();
  }, [fetchHabits]);

  useEffect(() => {
    if (user?.level) {
      syncStatsWithLevel(user.level);
    }
  }, [user?.level, syncStatsWithLevel]);

  const handleCreate = async (values: HabitFormValues) => {
    setIsCreating(true);
    try {
      await createHabit(values);
      setIsCreateOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <PlayerHUD />
      <LevelUpOverlay />

      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-15%] left-[25%] w-[700px] h-[500px] rounded-full opacity-[0.025] bg-xp blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[15%] w-[500px] h-[400px] rounded-full opacity-[0.02] bg-xp-glow blur-[120px]" />
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <ProgressCard />
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 items-start">
            <div className="lg:sticky lg:top-[5.5rem]">
              <CharacterPanel />
            </div>
            <HabitsPanel onCreateClick={() => setIsCreateOpen(true)} />
          </div>
        </div>
      </main>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New Habit" description="Define a habit and assign its XP reward.">
        <HabitForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} isLoading={isCreating} submitLabel="Create habit" />
      </Modal>
    </>
  );
}