'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { useAuthStore } from '@/store/authStore';
import { CLASS_DEFINITIONS } from '@/types/character';
import type { CharacterStats as ICharacterStats, BodyType } from '@/types/character';

interface StatMeta {
  key: keyof ICharacterStats;
  label: string;
  icon: string;
  trackColor: string;
  fillColor: string;
  iconFilter: string;
}

const STAT_META: StatMeta[] = [
  {
    key: 'strength',
    label: 'Strength',
    icon: '/assets/icons/strength.svg',
    trackColor: '#1a0808',
    fillColor: '#8a1c1c',
    iconFilter: 'sepia(1) brightness(0.55) contrast(1.1) hue-rotate(330deg)',
  },
  {
    key: 'agility',
    label: 'Agility',
    icon: '/assets/icons/agility.svg',
    trackColor: '#0a1408',
    fillColor: '#2d5a27',
    iconFilter: 'sepia(1) brightness(0.5) contrast(1.05) hue-rotate(60deg)',
  },
  {
    key: 'intellect',
    label: 'Intellect',
    icon: '/assets/icons/intellect.svg',
    trackColor: '#141208',
    fillColor: '#a8891e',
    iconFilter: 'sepia(1) brightness(0.6) contrast(1.1)',
  },
];

const STAT_MAX = 48;

const CLASS_LORE: Record<BodyType, string> = {
  warrior: 'Primary Stat: Strength. The Warrior thrives on physical discipline, heavy lifting, and enduring difficult tasks.',
  mage: 'Primary Stat: Intellect. The Mage seeks knowledge, mental focus, and excelling in learning-based habits.',
  rogue: 'Primary Stat: Agility. The Rogue values consistency, speed, and precision in daily routines.'
};

interface StatRowProps {
  meta: StatMeta;
  value: number;
  isPrimary: boolean;
  index: number;
}

function StatRow({ meta, value, isPrimary, index }: StatRowProps) {
  const fillPct = Math.min(Math.round((value / STAT_MAX) * 100), 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.28 }}
      className={['group flex flex-col gap-1.5 px-3 py-2.5', isPrimary ? 'border border-xp/15 bg-surface-hover' : 'border border-transparent hover:border-surface-border'].join(' ')}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <img src={meta.icon} alt={meta.label} width={14} height={14} draggable={false} className="flex-shrink-0" style={{ filter: meta.iconFilter, width: 14, height: 14 }} />
          <span className={['text-2xs font-display tracking-widest uppercase', isPrimary ? 'text-xp' : 'text-ink-tertiary'].join(' ')}>{meta.label}</span>
          {isPrimary && <span className="text-2xs font-mono text-xp/50 border border-xp/15 px-1">★</span>}
        </div>
        <span className={['text-xs font-mono tabular', isPrimary ? 'text-ink-secondary' : 'text-ink-tertiary'].join(' ')}>{value}</span>
      </div>
      <div className="h-1 w-full overflow-hidden" style={{ backgroundColor: meta.trackColor }}>
        <motion.div className="h-full" initial={{ width: '0%' }} animate={{ width: `${fillPct}%` }} transition={{ delay: index * 0.07 + 0.15, duration: 0.55, ease: [0.4, 0, 0.2, 1] }} style={{ backgroundColor: meta.fillColor }} />
      </div>
    </motion.div>
  );
}

function ClassPicker() {
  const { appearance, setBodyType, syncStatsWithLevel } = useCharacterStore();
  const { user } = useAuthStore();

  const handleChange = (bt: BodyType) => {
    setBodyType(bt);
    syncStatsWithLevel(user?.level ?? 1);
  };

  return (
    <div className="flex flex-col gap-3 mt-1">
      <div className="flex gap-px">
        {(Object.keys(CLASS_DEFINITIONS) as BodyType[]).map((bt) => {
          const isActive = appearance.bodyType === bt;
          const label = CLASS_DEFINITIONS[bt].label;

          return (
            <motion.button
              key={bt}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleChange(bt)}
              className={['flex-1 py-1.5 text-2xs font-display tracking-widest uppercase border transition-colors duration-150', isActive ? bt === 'warrior' ? 'bg-surface-overlay border-class-warrior/40 text-class-warrior' : bt === 'rogue' ? 'bg-surface-overlay border-class-rogue/40 text-class-rogue' : 'bg-surface-overlay border-xp/30 text-xp' : 'bg-surface-hover border-surface-border text-ink-tertiary hover:text-ink-secondary hover:border-surface-bright'].join(' ')}
            >
              {label}
            </motion.button>
          );
        })}
      </div>
      
      {/* Lore Info Block */}
      <AnimatePresence mode="wait">
        <motion.div
          key={appearance.bodyType}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="bg-surface-deep border border-surface-border p-3 rounded-sm"
        >
          <p className="text-xs font-sans text-ink-tertiary leading-relaxed">
            {CLASS_LORE[appearance.bodyType]}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function CharacterStats() {
  const { stats, appearance, syncStatsWithLevel } = useCharacterStore();
  const { user } = useAuthStore();
  const level = user?.level ?? 1;
  const primaryStat = CLASS_DEFINITIONS[appearance.bodyType].primaryStat;

  useEffect(() => {
    syncStatsWithLevel(level);
  }, [level, syncStatsWithLevel]);

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xs font-display text-ink-tertiary tracking-widest uppercase">Attributes</span>
        <span className="text-2xs font-mono text-ink-disabled">lv. {level}</span>
      </div>
      <div className="flex flex-col gap-px">
        {STAT_META.map((meta, i) => (
          <StatRow key={meta.key} meta={meta} value={stats[meta.key]} isPrimary={primaryStat === meta.key} index={i} />
        ))}
      </div>
      <div className="mt-5">
        <p className="text-2xs font-display text-ink-disabled tracking-widest uppercase mb-2">Class Specialization</p>
        <ClassPicker />
      </div>
    </div>
  );
}