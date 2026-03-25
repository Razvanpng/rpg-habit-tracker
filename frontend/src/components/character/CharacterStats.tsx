'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { useAuthStore } from '@/store/authStore';
import { CLASS_DEFINITIONS } from '@/types/character';
import type { CharacterStats as ICharacterStats } from '@/types/character';

interface StatConfig {
  key: keyof ICharacterStats;
  label: string;
  icon: string;
  color: 'xp' | 'danger' | 'warning' | 'success';
  barColor: string;
}

const STAT_CONFIG: StatConfig[] = [
  {
    key: 'strength',
    label: 'Strength',
    icon: '/assets/icons/strength.svg',
    color: 'danger',
    barColor: 'from-red-700 to-red-500',
  },
  {
    key: 'agility',
    label: 'Agility',
    icon: '/assets/icons/agility.svg',
    color: 'success',
    barColor: 'from-green-700 to-green-400',
  },
  {
    key: 'intellect',
    label: 'Intellect',
    icon: '/assets/icons/intellect.svg',
    color: 'xp',
    barColor: 'from-xp-glow to-xp-bright',
  },
];

const MAX_STAT = Math.floor((5 + Math.floor(10 * 2.5)) * 1.6);

interface StatRowProps {
  config: StatConfig;
  value: number;
  isPrimary: boolean;
  index: number;
}

function StatRow({ config, value, isPrimary, index }: StatRowProps) {
  const pct = Math.round((value / MAX_STAT) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      className={[
        'flex flex-col gap-2 p-3 rounded-xl',
        'transition-colors duration-200',
        isPrimary
          ? 'bg-white/[0.04] border border-white/[0.07]'
          : 'hover:bg-white/[0.02]',
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 flex-shrink-0 opacity-80">
            <img
              src={config.icon}
              alt={config.label}
              width={16}
              height={16}
              className="w-full h-full object-contain"
            />
          </div>
          <span
            className={[
              'text-xs font-medium',
              isPrimary ? 'text-ink-secondary' : 'text-ink-tertiary',
            ].join(' ')}
          >
            {config.label}
          </span>
          {isPrimary && (
            <span className="text-2xs text-xp-bright bg-xp-muted px-1.5 py-0.5 rounded-md border border-xp/20">
              Primary
            </span>
          )}
        </div>
        <span
          className={[
            'text-sm font-bold font-mono tabular-nums',
            isPrimary ? 'text-ink-primary' : 'text-ink-secondary',
          ].join(' ')}
        >
          {value}
        </span>
      </div>

      <div className="h-1.5 w-full rounded-full bg-surface-border/60 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${config.barColor}`}
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.08 + 0.2, duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={isPrimary ? {
            boxShadow: config.color === 'danger'
              ? '0 0 8px rgba(239,68,68,0.5)'
              : config.color === 'success'
              ? '0 0 8px rgba(34,197,94,0.5)'
              : '0 0 8px rgba(124,58,237,0.5)',
          } : {}}
        />
      </div>
    </motion.div>
  );
}

function ClassPicker() {
  const { appearance, setBodyType, syncStatsWithLevel } = useCharacterStore();
  const { user } = useAuthStore();

  const handleChange = (bt: typeof appearance.bodyType) => {
    setBodyType(bt);
    syncStatsWithLevel(user?.level ?? 1);
  };

  return (
    <div className="flex gap-1.5 mt-4">
      {(Object.keys(CLASS_DEFINITIONS) as Array<keyof typeof CLASS_DEFINITIONS>).map((bt) => {
        const def = CLASS_DEFINITIONS[bt];
        const isActive = appearance.bodyType === bt;
        return (
          <motion.button
            key={bt}
            whileTap={{ scale: 0.93 }}
            onClick={() => handleChange(bt)}
            className={[
              'flex-1 py-1.5 rounded-lg text-2xs font-semibold transition-all duration-200',
              isActive
                ? bt === 'warrior'
                  ? 'bg-class-warrior/20 text-red-400 border border-class-warrior/40'
                  : bt === 'rogue'
                  ? 'bg-class-rogue/20 text-green-400 border border-class-rogue/40'
                  : 'bg-xp-muted text-xp-bright border border-xp/30'
                : 'bg-surface-hover text-ink-tertiary border border-surface-border hover:text-ink-secondary',
            ].join(' ')}
          >
            {def.label}
          </motion.button>
        );
      })}
    </div>
  );
}

export function CharacterStats() {
  const { stats, appearance, syncStatsWithLevel } = useCharacterStore();
  const { user } = useAuthStore();
  const level = user?.level ?? 1;
  const classDef = CLASS_DEFINITIONS[appearance.bodyType];

  useEffect(() => {
    syncStatsWithLevel(level);
  }, [level, syncStatsWithLevel]);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <p className="text-2xs font-semibold text-ink-tertiary uppercase tracking-wider">
          Character stats
        </p>
        <span className="text-2xs text-ink-disabled">
          scales with level
        </span>
      </div>

      {STAT_CONFIG.map((cfg, i) => (
        <StatRow
          key={cfg.key}
          config={cfg}
          value={stats[cfg.key]}
          isPrimary={classDef.primaryStat === cfg.key}
          index={i}
        />
      ))}

      <div className="mt-1">
        <p className="text-2xs text-ink-tertiary mb-1.5">Change class</p>
        <ClassPicker />
      </div>
    </div>
  );
}