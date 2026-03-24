'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { useAuthStore } from '@/store/authStore';
import { PlayerHUD } from '@/components/player/PlayerHUD';
import { LevelUpOverlay } from '@/components/player/LevelUpOverlay';
import { HabitList } from '@/components/habits/HabitList';
import { HabitForm } from '@/components/habits/HabitForm';
import { XpBar } from '@/components/player/XpBar';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getLevelTitle, formatXp, xpRequiredForLevel } from '@/lib/xp';
import type { HabitFormValues } from '@/types';

function StatsRow() {
  const { user } = useAuthStore();
  const { habits } = useHabitStore();

  if (!user) return null;

  const total = habits.length;
  const done = habits.filter((h) => h.isCompletedToday).length;
  const xpEarned = habits.filter((h) => h.isCompletedToday).reduce((sum, h) => sum + h.xpReward, 0);

  return (
    <div className="grid grid-cols-3 gap-3">
      <Card padded={false} className="p-4"><p className="text-2xs uppercase text-ink-tertiary">Today</p><p className="text-lg font-bold">{done} / {total}</p></Card>
      <Card padded={false} className="p-4"><p className="text-2xs uppercase text-ink-tertiary">XP Earned</p><p className="text-lg font-bold">{formatXp(xpEarned)}</p></Card>
      <Card padded={false} className="p-4"><p className="text-2xs uppercase text-ink-tertiary">Next Level</p><p className="text-lg font-bold">{formatXp(xpRequiredForLevel(user.level) - user.currentXp)}</p></Card>
    </div>
  );
}

function ProgressPanel() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <Card>
      <div className="flex justify-between mb-4">
        <div>
          <span className="text-xs uppercase text-ink-tertiary">Level {user.level}</span>
          <h2 className="text-xl font-bold text-gradient-xp">{getLevelTitle(user.level)}</h2>
        </div>
      </div>
      <XpBar user={user} />
    </Card>
  );
}

export default function DashboardPage() {
  const { habits, fetchHabits, createHabit, isLoading } = useHabitStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    void fetchHabits();
  }, [fetchHabits]);

  const handleCreate = async (values: HabitFormValues) => {
    await createHabit(values);
    setIsCreateOpen(false);
  };

  return (
    <>
      <PlayerHUD />
      <LevelUpOverlay />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
          <ProgressPanel />
          <StatsRow />
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-ink-primary">Daily habits</h2>
              <Button onClick={() => setIsCreateOpen(true)} size="sm">New habit</Button>
            </div>
            <HabitList habits={habits} isLoading={isLoading} />
          </section>
        </motion.div>
      </main>
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="New habit">
        <HabitForm onSubmit={handleCreate} onCancel={() => setIsCreateOpen(false)} />
      </Modal>
    </>
  );
}