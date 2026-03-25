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
import {
  getLevelTitle,
  formatXp,
  xpRequiredForLevel,
} from '@/lib/xp';
import type { HabitFormValues } from '@/types';

function StatsStrip() {
  const { user } = useAuthStore();
  const { habits } = useHabitStore();
  if (!user) return null;

  const total = habits.length;
  const done = habits.filter((h) => h.isCompletedToday).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const xpEarned = habits
    .filter((h) => h.isCompletedToday)
    .reduce((s, h) => s + h.xpReward, 0);
  const remaining = xpRequiredForLevel(user.level) - user.currentXp;

  const stats = [
    { label: 'Today', value: `${done}/${total}`, sub: `${pct}% done` },
    { label: 'XP earned', value: formatXp(xpEarned), sub: 'today' },
    { label: 'To level', value: formatXp(remaining), sub: 'remaining' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, sub }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="glass rounded-xl p-3.5 flex flex-col gap-0.5"
        >
          <p className="text-2xs text-ink-tertiary uppercase tracking-wide font-medium">
            {label}
          </p>
          <p className="text-base font-bold text-ink-primary tabular-nums font-mono leading-tight">
            {value}
          </p>
          <p className="text-2xs text-ink-disabled">{sub}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ProgressCard() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <Card glass neonBorder padded={false} className="p-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="text-2xs text-ink-tertiary uppercase tracking-widest font-medium mb-0.5">
            Experience
          </p>
          <h2 className="text-lg font-bold text-gradient-xp leading-none">
            {getLevelTitle(user.level)}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-tertiary font-mono tabular-nums">
            {formatXp(user.currentXp)}
          </p>
          <p className="text-2xs text-ink-disabled">
            / {formatXp(user.xpToNextLevel)}
          </p>
        </div>
      </div>
      <XpBar user={user} glowing striped />
    </Card>
  );
}

function CharacterPanel() {
  const [customizerOpen, setCustomizerOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
      className="flex flex-col gap-4"
    >
      <Card glass padded className="flex flex-col items-center py-8 px-6">
        <CharacterHero />

        <div className="w-full mt-6">
          <Button
            variant="glass"
            size="sm"
            fullWidth
            onClick={() => setCustomizerOpen((o) => !o)}
            rightIcon={
              <motion.span
                animate={{ rotate: customizerOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-xs"
              >
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
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-4 border-t border-surface-border mt-4">
                  <CharacterCustomizer />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <Card glass padded>
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
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
      className="flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-ink-primary tracking-tight">
            Daily Habits
          </h2>
          <p className="text-xs text-ink-tertiary mt-0.5">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric',
            })}
            {habits.length > 0 && (
              <span className="ml-2 text-ink-disabled">
                · {pending} pending · {completed} done
              </span>
            )}
          </p>
        </div>
        <Button
          size="sm"
          glow
          onClick={onCreateClick}
          leftIcon={<span className="text-base leading-none font-light">+</span>}
        >
          New habit
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

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
      >
        <div className="absolute top-[-20%] left-[30%] w-[500px] h-[500px] rounded-full bg-xp/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[400px] h-[400px] rounded-full bg-xp-glow/5 blur-[100px]" />
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 bg-grid">
        <div className="flex flex-col gap-6">

          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProgressCard />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

            <div className="lg:sticky lg:top-24">
              <CharacterPanel />
            </div>

            <HabitsPanel onCreateClick={() => setIsCreateOpen(true)} />
          </div>
        </div>
      </main>

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="New Habit"
        description="Define a habit and assign its XP reward."
      >
        <HabitForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          isLoading={isCreating}
          submitLabel="Create habit"
        />
      </Modal>
    </>
  );
}