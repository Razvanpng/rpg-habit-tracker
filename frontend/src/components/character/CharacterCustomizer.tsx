'use client';

import { motion } from 'framer-motion';
import { useCharacterStore } from '@/store/characterStore';
import { SKIN_COLORS, PRIMARY_COLORS } from '@/types/character';

interface SwatchProps {
  color: string;
  active: boolean;
  onClick: () => void;
  label: string;
}

function Swatch({ color, active, onClick, label }: SwatchProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      title={label}
      aria-label={label}
      className={[
        'w-7 h-7 rounded-full border-2 transition-all duration-150',
        active
          ? 'border-xp-bright scale-110 shadow-xp-sm'
          : 'border-transparent hover:border-ink-tertiary hover:scale-105',
      ].join(' ')}
      style={{ backgroundColor: color }}
    />
  );
}

export function CharacterCustomizer() {
  const { appearance, setSkinColor, setPrimaryColor } = useCharacterStore();

  return (
    <div className="flex flex-col gap-4 pt-2">
      <div>
        <p className="text-2xs font-medium text-ink-tertiary uppercase tracking-wide mb-2">
          Skin tone
        </p>
        <div className="flex flex-wrap gap-2">
          {SKIN_COLORS.map(({ label, value }) => (
            <Swatch
              key={value}
              color={value}
              active={appearance.skinColor === value}
              onClick={() => setSkinColor(value)}
              label={label}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-2xs font-medium text-ink-tertiary uppercase tracking-wide mb-2">
          Armor color
        </p>
        <div className="flex flex-wrap gap-2">
          {PRIMARY_COLORS.map(({ label, value }) => (
            <Swatch
              key={value}
              color={value}
              active={appearance.primaryColor === value}
              onClick={() => setPrimaryColor(value)}
              label={label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}