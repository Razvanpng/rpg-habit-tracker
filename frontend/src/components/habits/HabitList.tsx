'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { HabitCard } from './HabitCard';
import type { Habit } from '@/types';

export function HabitList({ habits, isLoading }: { habits: Habit[]; isLoading: boolean; }) {
  if (isLoading) {
    return <div className="flex flex-col gap-3">{[0, 1, 2].map((i) => <div key={i} className="h-[72px] rounded-2xl bg-surface-raised animate-pulse border border-surface-border" />)}</div>;
  }

  if (habits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4" role="img" aria-label="scroll">📜</span>
        <h3 className="text-base font-semibold text-ink-primary mb-1">No habits yet</h3>
        <p className="text-sm text-ink-tertiary max-w-xs">Create your first habit to start earning XP.</p>
      </div>
    );
  }

  const pending = habits.filter((h) => !h.isCompletedToday);
  const completed = habits.filter((h) => h.isCompletedToday);

  return (
    <div className="flex flex-col gap-6">
      {pending.length > 0 && (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">{pending.map((habit, i) => <HabitCard key={habit.id} habit={habit} index={i} />)}</AnimatePresence>
        </div>
      )}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-medium text-ink-disabled uppercase tracking-wide">Completed today</span>
            <div className="flex-1 h-px bg-surface-border" />
          </div>
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">{completed.map((habit, i) => <HabitCard key={habit.id} habit={habit} index={i} />)}</AnimatePresence>
          </div>
        </section>
      )}
    </div>
  );
}