'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { Button } from '@/components/ui/Button';
import type { Habit } from '@/types';

function HabitTableRow({ habit }: { habit: Habit }) {
  const { completeHabit, deleteHabit } = useHabitStore();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeHabit(habit.id);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this habit?')) return;
    setIsDeleting(true);
    try {
      await deleteHabit(habit.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const isDone = habit.isCompletedToday;

  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className={[
        'group border-b border-surface-border/50 transition-all duration-300',
        isDone ? 'bg-surface-deep/30 opacity-60' : 'hover:bg-surface-hover/50'
      ].join(' ')}
    >
      {/* Coloana 1: Detalii Habit */}
      <td className="py-4 pl-4 pr-2 align-middle">
        <div className="flex flex-col gap-0.5">
          <span className={[
            'text-sm font-semibold tracking-wide transition-colors',
            isDone ? 'text-ink-disabled line-through decoration-ink-disabled/50' : 'text-ink-primary'
          ].join(' ')}>
            {habit.name}
          </span>
          {habit.description && (
            <span className={[
              'text-xs font-sans truncate max-w-[250px] lg:max-w-[400px]',
              isDone ? 'text-ink-disabled/50' : 'text-ink-tertiary'
            ].join(' ')}>
              {habit.description}
            </span>
          )}
        </div>
      </td>

      {/* Coloana 2: Recompensa (XP) */}
      <td className="py-4 px-2 align-middle text-right">
        <span className={[
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono border',
          isDone 
            ? 'bg-transparent border-surface-border text-ink-disabled' 
            : 'bg-surface-deep border-xp/20 text-xp shadow-inner-gold'
        ].join(' ')}>
          <span className="text-2xs opacity-70">♦</span> {habit.xpReward} XP
        </span>
      </td>

      {/* Coloana 3: Actiunea de Complete */}
      <td className="py-4 px-2 align-middle text-right w-36">
        {isDone ? (
          <div className="flex items-center justify-end gap-2 text-success/80 font-mono text-xs tracking-widest uppercase pr-2">
            <span>Done</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={handleComplete}
            isLoading={isCompleting}
            className="w-full text-xs tracking-widest"
          >
            Complete
          </Button>
        )}
      </td>

      {/* Coloana 4: Stergere (Iese in evidenta doar la hover) */}
      <td className="py-4 pr-4 pl-2 align-middle text-right w-12">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-ink-disabled hover:text-danger hover:bg-danger/10 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-0"
          title="Delete quest"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </td>
    </motion.tr>
  );
}

export function HabitList({ habits, isLoading }: { habits: Habit[]; isLoading: boolean }) {
  if (isLoading && habits.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-surface-raised border border-surface-border/50 animate-pulse rounded-sm" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="py-12 px-4 text-center border border-dashed border-surface-border/50 rounded-sm bg-surface-raised/30">
        <p className="text-sm font-display text-ink-tertiary tracking-widest uppercase">
          Your quest log is empty
        </p>
        <p className="text-xs text-ink-disabled mt-2 font-sans">
          Add a new habit to begin earning experience.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-sm border border-surface-border shadow-card bg-surface-raised">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-surface-deep border-b border-surface-border">
            <th className="py-3 pl-4 pr-2 text-2xs font-display text-ink-tertiary uppercase tracking-widest font-medium">
              Active Quests
            </th>
            <th className="py-3 px-2 text-2xs font-display text-ink-tertiary uppercase tracking-widest font-medium text-right">
              Reward
            </th>
            <th className="py-3 px-2 text-2xs font-display text-ink-tertiary uppercase tracking-widest font-medium text-right">
              Status
            </th>
            <th className="py-3 pr-4 pl-2 text-right">
              {/* Header gol pentru coloana de stergere */}
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitTableRow key={habit.id} habit={habit} />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}