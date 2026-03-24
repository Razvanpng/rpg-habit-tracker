'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Habit, HabitFormValues } from '@/types';

const XP_OPTIONS = [10, 25, 50, 75, 100, 150, 200] as const;

export function HabitForm({ initialValues, onSubmit, onCancel, isLoading = false, submitLabel = 'Save habit' }: { initialValues?: Partial<HabitFormValues>; habit?: Habit; onSubmit: (v: HabitFormValues) => Promise<void>; onCancel: () => void; isLoading?: boolean; submitLabel?: string; }) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [xpReward, setXpReward] = useState(initialValues?.xpReward ?? 50);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Habit name is required');
    try {
      await onSubmit({ name: name.trim(), description: description.trim() || undefined, xpReward });
    } catch (err: any) {
      setError(err?.error?.message ?? 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input label="Habit name" placeholder="e.g. Morning run" value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
      <Input label="Description (optional)" placeholder="A short note" value={description} onChange={(e) => setDescription(e.target.value)} />
      
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-ink-secondary">XP reward</label>
        <div className="flex flex-wrap gap-2">
          {XP_OPTIONS.map((xp) => (
            <motion.button key={xp} type="button" whileTap={{ scale: 0.94 }} onClick={() => setXpReward(xp)} className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${xpReward === xp ? 'bg-xp border-xp text-white' : 'bg-surface-overlay border-surface-border text-ink-secondary'}`}>
              {xp} XP
            </motion.button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
      
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} fullWidth>Cancel</Button>
        <Button type="submit" isLoading={isLoading} fullWidth>{submitLabel}</Button>
      </div>
    </form>
  );
}