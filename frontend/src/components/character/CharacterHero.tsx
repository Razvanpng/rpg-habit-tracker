'use client';

import { type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { useAuthStore } from '@/store/authStore';
import { CLASS_DEFINITIONS } from '@/types/character';
import { getLevelTitle } from '@/lib/xp';

const CLASS_GLOW_COLOR: Record<string, string> = {
  warrior: 'rgba(138, 28,  28,  0.22)',
  mage:    'rgba(212, 175, 55,  0.18)',
  rogue:   'rgba(45,  90,  39,  0.20)',
};

function buildMaskStyle(bodyType: string): CSSProperties {
  return {
    WebkitMaskImage: `url(/assets/character/${bodyType}.svg)`,
    maskImage: `url(/assets/character/${bodyType}.svg)`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center bottom',
    maskPosition: 'center bottom',
  };
}

export function CharacterHero() {
  const { appearance } = useCharacterStore();
  const { user } = useAuthStore();

  const level = user?.level ?? 1;
  const classDef = CLASS_DEFINITIONS[appearance.bodyType];
  const glowColor = CLASS_GLOW_COLOR[appearance.bodyType] ?? CLASS_GLOW_COLOR['mage'];
  const maskStyle = buildMaskStyle(appearance.bodyType);
  const isElite = level >= 5;
  const isLegend = level >= 9;

  return (
    <div className="relative flex flex-col items-center select-none w-full">
      <div
        aria-hidden
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-44 h-20 blur-3xl pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />

      {isElite && (
        <div className="absolute inset-2 pointer-events-none" aria-hidden>
          <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-xp/30" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t border-r border-xp/30" />
          <span className="absolute bottom-8 left-0 w-4 h-4 border-b border-l border-xp/30" />
          <span className="absolute bottom-8 right-0 w-4 h-4 border-b border-r border-xp/30" />
        </div>
      )}

      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
        style={{ width: 144, height: 144 }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: appearance.skinColor, ...maskStyle }} />
        <div className="absolute inset-0" style={{ backgroundColor: appearance.primaryColor, opacity: 0.72, ...maskStyle }} />

        {isLegend && (
          <div
            className="absolute inset-0 animate-ember-flicker"
            style={{ background: 'linear-gradient(180deg, rgba(212,175,55,0.18) 0%, transparent 60%)', ...maskStyle }}
          />
        )}

        <div className={['absolute -bottom-2 -right-1 flex items-center justify-center w-7 h-7 bg-surface border', isElite ? 'border-xp/40' : 'border-surface-border', 'shadow-card'].join(' ')}>
          <span className="text-2xs font-display font-bold text-xp tabular">{level}</span>
        </div>
      </motion.div>

      <div className="relative z-10 mt-1 w-28 flex flex-col items-center gap-px">
        <div className="w-full h-px bg-surface-border" />
        <div className="w-20 h-px bg-surface-bright" />
      </div>

      <div className="relative z-10 mt-4 text-center space-y-1">
        <motion.h3
          key={`${appearance.bodyType}-${level}`}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={['text-sm font-display font-semibold tracking-widest uppercase', appearance.bodyType === 'warrior' ? 'text-gradient-warrior' : appearance.bodyType === 'rogue' ? 'text-gradient-rogue' : 'text-gradient-mage'].join(' ')}
        >
          {classDef.label}
        </motion.h3>

        <p className="text-2xs text-ink-tertiary font-mono tracking-wide">
          {getLevelTitle(level)}
          {isLegend ? ' · Legend' : isElite ? ' · Elite' : ''}
        </p>
      </div>

      {isLegend && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="absolute w-px h-px bg-xp rounded-full"
              style={{ left: `${20 + i * 15}%`, top: `${25 + (i % 3) * 18}%` }}
              animate={{ opacity: [0, 0.9, 0], y: [0, -18, -36], scale: [0, 1.5, 0] }}
              transition={{ duration: 2.8, delay: i * 0.55, repeat: Infinity, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </div>
  );
}