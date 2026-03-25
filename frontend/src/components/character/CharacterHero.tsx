'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { useAuthStore } from '@/store/authStore';
import { CLASS_DEFINITIONS } from '@/types/character';
import { getLevelTitle } from '@/lib/xp';

function getGlowStyle(level: number, bodyType: string): React.CSSProperties {
  const intensity = Math.min(0.2 + level * 0.025, 0.7);
  const colors: Record<string, string> = {
    warrior: `rgba(220, 38, 38, ${intensity})`,
    mage: `rgba(124, 58, 237, ${intensity})`,
    rogue: `rgba(22, 163, 74, ${intensity})`,
  };
  const color = colors[bodyType] ?? colors['mage'];
  return {
    background: `radial-gradient(ellipse 60% 50% at 50% 80%, ${color}, transparent)`,
  };
}

export function CharacterHero() {
  const { appearance } = useCharacterStore();
  const { user } = useAuthStore();
  const level = user?.level ?? 1;
  const classDef = CLASS_DEFINITIONS[appearance.bodyType];

  const glowStyle = useMemo(
    () => getGlowStyle(level, appearance.bodyType),
    [level, appearance.bodyType]
  );

  const isElite = level >= 5;
  const isLegend = level >= 9;

  return (
    <div className="relative flex flex-col items-center select-none">
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-20 blur-2xl pointer-events-none"
        style={glowStyle}
        aria-hidden
      />

      {isElite && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <div
            className={[
              'w-44 h-44 rounded-full border',
              'animate-spin-slow opacity-20',
              appearance.bodyType === 'warrior' ? 'border-class-warrior' :
              appearance.bodyType === 'rogue' ? 'border-class-rogue' :
              'border-xp',
            ].join(' ')}
            style={{ borderStyle: 'dashed' }}
          />
        </div>
      )}

      {isLegend && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden
        >
          <div
            className="w-52 h-52 rounded-full border border-xp/30 animate-spin-slow opacity-40"
            style={{ animationDirection: 'reverse', animationDuration: '12s' }}
          />
        </div>
      )}

      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-36 h-36"
      >
        <img
          src={`/assets/character/${appearance.bodyType}.svg`}
          alt={`${classDef.label} character`}
          width={144}
          height={144}
          className="w-full h-full object-contain drop-shadow-xl"
          style={{
            '--skin-color': appearance.skinColor,
            '--primary-color': appearance.primaryColor,
          } as React.CSSProperties}
          draggable={false}
        />

        <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-surface border-2 border-surface-border shadow-lg">
          <span className="text-2xs font-bold text-gradient-xp tabular-nums">
            {level}
          </span>
        </div>
      </motion.div>

      <div className="relative z-10 mt-5 text-center">
        <motion.h3
          key={level}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={[
            'text-base font-bold tracking-tight',
            appearance.bodyType === 'warrior' ? 'text-gradient-warrior' :
            appearance.bodyType === 'rogue' ? 'text-gradient-rogue' :
            'text-gradient-mage',
          ].join(' ')}
        >
          {getLevelTitle(level)} {classDef.label}
        </motion.h3>
        <p className="text-xs text-ink-tertiary mt-0.5">
          Level {level}
          {isLegend ? ' · Legend' : isElite ? ' · Elite' : ''}
        </p>
      </div>

      {isLegend && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 rounded-full bg-xp-bright"
              style={{
                left: `${20 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -12, -24],
              }}
              transition={{
                duration: 2,
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}