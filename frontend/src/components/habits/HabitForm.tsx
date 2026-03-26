'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Habit, HabitFormValues } from '@/types';

// Am limitat XP-ul la maxim 50
const XP_OPTIONS = [10, 20, 30, 40, 50] as const;

const ATTRIBUTE_OPTIONS = [
  { id: 'strength', label: 'Strength', sub: 'Warrior', style: 'text-red-500 border-red-500/50 bg-red-500/10' },
  { id: 'agility', label: 'Agility', sub: 'Rogue', style: 'text-green-500 border-green-500/50 bg-green-500/10' },
  { id: 'intellect', label: 'Intellect', sub: 'Mage', style: 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10' },
] as const;

export function HabitForm({ 
  initialValues, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  submitLabel = 'Save habit' 
}: { 
  initialValues?: Partial<HabitFormValues> & { attribute?: string }; 
  habit?: Habit; 
  onSubmit: (v: any) => Promise<void>; 
  onCancel: () => void; 
  isLoading?: boolean; 
  submitLabel?: string; 
}) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [xpReward, setXpReward] = useState(initialValues?.xpReward ?? 20);
  // Default pe strength
  const [attribute, setAttribute] = useState(initialValues?.attribute ?? 'strength');
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Habit name is required');
    try {
      // Trimitem si atributul selectat catre backend
      await onSubmit({ 
        name: name.trim(), 
        description: description.trim() || undefined, 
        xpReward,
        attribute 
      });
    } catch (err: any) {
      setError(err?.error?.message ?? 'Something went wrong');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Input 
        label="Quest Name" 
        placeholder="e.g. Morning Workout" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        autoFocus 
      />
      
      <Input 
        label="Description (optional)" 
        placeholder="A short note" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)} 
      />

      {/* Selector Atribut */}
      <div className="flex flex-col gap-2">
        <label className="text-2xs font-display text-ink-tertiary tracking-widest uppercase">Target Attribute</label>
        <div className="grid grid-cols-3 gap-2">
          {ATTRIBUTE_OPTIONS.map((attr) => (
            <button
              key={attr.id}
              type="button"
              onClick={() => setAttribute(attr.id)}
              className={`py-2 px-1 rounded-sm border transition-all flex flex-col items-center justify-center gap-0.5 ${
                attribute === attr.id 
                  ? attr.style
                  : 'bg-surface-raised border-surface-border text-ink-disabled hover:border-surface-bright'
              }`}
            >
              <span className="text-xs font-display tracking-widest uppercase">{attr.label}</span>
              <span className="text-[10px] font-mono opacity-70">{attr.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selector XP */}
      <div className="flex flex-col gap-2">
        <label className="text-2xs font-display text-ink-tertiary tracking-widest uppercase">XP Reward</label>
        <div className="flex flex-wrap gap-2">
          {XP_OPTIONS.map((xp) => (
            <motion.button 
              key={xp} 
              type="button" 
              whileTap={{ scale: 0.94 }} 
              onClick={() => setXpReward(xp)} 
              className={`px-3 py-1.5 rounded-sm text-xs font-mono border transition-colors ${
                xpReward === xp 
                  ? 'bg-xp/20 border-xp text-xp shadow-inner-gold' 
                  : 'bg-surface-raised border-surface-border text-ink-secondary hover:border-surface-bright'
              }`}
            >
              {xp} XP
            </motion.button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-danger">{error}</p>}
      
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} fullWidth>Cancel</Button>
        <Button type="submit" variant="primary" isLoading={isLoading} fullWidth>{submitLabel}</Button>
      </div>
    </form>
  );
}