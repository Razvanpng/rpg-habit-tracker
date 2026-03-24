'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHabitStore } from '@/store/habitStore';
import { useAuthStore } from '@/store/authStore';
import { Modal } from '@/components/ui/Modal';
import { HabitForm } from './HabitForm';
import type { Habit, HabitFormValues } from '@/types';

export function HabitCard({ habit, index }: { habit: Habit; index: number }) {
  const { completeHabit, updateHabit, deleteHabit } = useHabitStore();
  const { user, updateUser } = useAuthStore();

  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleComplete = async () => {
    if (habit.isCompletedToday || isCompleting) return;
    setIsCompleting(true);
    try {
      const result = await completeHabit(habit.id);
      if (user) updateUser(result.user);
    } catch {
      // eroare ignorata pt moment
    } finally {
      setIsCompleting(false);
    }
  };

  const handleUpdate = async (values: HabitFormValues) => {
    await updateHabit(habit.id, values);
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    await deleteHabit(habit.id);
  };

  return (
    <>
      <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ delay: index * 0.05 }} className={`group relative flex items-center gap-4 p-5 bg-surface-raised border rounded-2xl shadow-card transition-all ${habit.isCompletedToday ? 'border-surface-border opacity-60' : 'hover:border-ink-disabled'}`}>
        <button onClick={handleComplete} disabled={habit.isCompletedToday || isCompleting} className={`flex-shrink-0 w-9 h-9 rounded-xl border-2 flex items-center justify-center transition-all ${habit.isCompletedToday ? 'bg-xp border-xp' : 'border-surface-border hover:border-xp'}`}>
          {habit.isCompletedToday ? <span className="text-white text-sm font-bold">✓</span> : isCompleting ? <div className="w-3 h-3 rounded-full border-2 border-xp border-t-transparent animate-spin" /> : null}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${habit.isCompletedToday ? 'text-ink-tertiary line-through' : 'text-ink-primary'}`}>{habit.name}</h3>
          {habit.description && <p className="text-xs text-ink-tertiary mt-0.5 truncate">{habit.description}</p>}
        </div>

        <div className="flex-shrink-0 flex items-center">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${habit.isCompletedToday ? 'bg-surface-border text-ink-disabled' : 'bg-xp-muted text-xp-text'}`}>+{habit.xpReward}</span>
        </div>

        <div className="flex-shrink-0 relative opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setShowMenu(!showMenu)} onBlur={() => setTimeout(() => setShowMenu(false), 150)} className="w-7 h-7 rounded-lg text-ink-tertiary hover:text-ink-primary">···</button>
          <AnimatePresence>
            {showMenu && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute right-0 top-8 z-10 w-36 glass rounded-xl py-1 shadow-xl">
                <button onClick={() => setIsEditOpen(true)} className="w-full text-left px-3 py-2 text-xs hover:bg-surface-hover">Edit habit</button>
                <button onClick={handleDelete} className="w-full text-left px-3 py-2 text-xs text-danger hover:bg-danger/10">Delete</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit habit">
        <HabitForm initialValues={{ name: habit.name, description: habit.description ?? undefined, xpReward: habit.xpReward }} onSubmit={handleUpdate} onCancel={() => setIsEditOpen(false)} submitLabel="Update habit" />
      </Modal>
    </>
  );
}