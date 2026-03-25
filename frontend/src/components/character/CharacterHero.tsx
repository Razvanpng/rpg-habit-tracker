'use client';

import { motion } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { useAuthStore } from '@/store/authStore';
import { CLASS_DEFINITIONS } from '@/types/character';
import { getLevelTitle } from '@/lib/xp';

const CLASS_GLOW: Record<string, string> = {
  warrior: 'rgba(138, 28,  28,  0.20)',
  mage:    'rgba(212, 175, 55,  0.18)',
  rogue:   'rgba(45,  90,  39,  0.18)',
};

export function CharacterHero() {
  const { appearance } = useCharacterStore();
  const { user } = useAuthStore();

  const level = user?.level ?? 1;
  const classDef = CLASS_DEFINITIONS[appearance.bodyType];
  const glowColor = CLASS_GLOW[appearance.bodyType] ?? CLASS_GLOW['mage'];
  const isElite = level >= 5;
  const isLegend = level >= 9;

  const avatarSrc = `/assets/character/${appearance.bodyType}.svg`;
  const avatarSize = isElite ? 160 : 144;

  return (
    <div className="relative flex flex-col items-center select-none w-full">
      {/* Background ambient glow */}
      <div
        aria-hidden
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-16 blur-3xl pointer-events-none"
        style={{ backgroundColor: glowColor }}
      />

      {/* Container cu dimensiuni stricte si overflow-hidden pentru a opri elementele sa sparga layout-ul */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex items-center justify-center bg-surface-deep border border-surface-border rounded-md shadow-inner overflow-hidden"
        style={{ width: avatarSize, height: avatarSize }}
      >
        {/* Imaginea standard, fortata sa respecte aspect ratio-ul containerului */}
        <img
          src={avatarSrc}
          alt={classDef.label}
          className="w-full h-full object-contain opacity-90 p-2"
          draggable={false}
        />

        {/* CSS Tinting: aplica culorile peste imagine fara sa altereze SVG-ul */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-color"
          style={{ backgroundColor: appearance.primaryColor }}
        />
        <div
          className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-50"
          style={{ backgroundColor: appearance.skinColor }}
        />

        {isLegend && (
          <div
            aria-hidden
            className="absolute inset-0 animate-ember-flicker pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(212,175,55,0.25) 0%, transparent 55%)',
            }}
          />
        )}
      </motion.div>

      {/* Level badge pozitionat sub containerul imaginii */}
      <div className="relative z-20 -mt-4 w-8 h-8 flex items-center justify-center bg-surface border border-surface-border shadow-card rounded-sm">
        <span className="text-2xs font-display font-bold text-xp tabular">
          {level}
        </span>
      </div>

      <div className="relative z-10 mt-3 text-center space-y-1">
        <motion.h3
          key={`${appearance.bodyType}-${level}`}
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className={[
            'text-sm font-display font-semibold tracking-[0.12em] uppercase',
            appearance.bodyType === 'warrior' ? 'text-gradient-warrior' :
            appearance.bodyType === 'rogue'   ? 'text-gradient-rogue'   :
                                                'text-gradient-mage',
          ].join(' ')}
        >
          {classDef.label}
        </motion.h3>
        <p className="text-2xs font-mono text-ink-tertiary tracking-wide">
          {getLevelTitle(level)}
          {isLegend ? ' · Legend' : isElite ? ' · Elite' : ''}
        </p>
      </div>
    </div>
  );
}