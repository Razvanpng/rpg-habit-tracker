import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cinzel', 'Palatino Linotype', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      colors: {
        surface: {
          DEFAULT: '#0a0a0a',
          raised: '#111111',
          overlay: '#1a1a1a',
          border: '#262626',
          bright: '#333333',
          hover: '#161616',
          deep: '#080808',
        },
        ink: {
          primary: '#e2d5bc',
          secondary: '#8a7f6e',
          tertiary: '#504740',
          disabled: '#322e28',
        },
        xp: {
          DEFAULT: '#d4af37',
          light: '#e8c84a',
          bright: '#f0d870',
          glow: '#a8891e',
          dark: '#7a6010',
          muted: 'rgba(212, 175, 55, 0.07)',
          border: 'rgba(212, 175, 55, 0.18)',
          text: '#d4af37',
        },
        class: {
          warrior: '#8a1c1c',
          mage: '#d4af37',
          rogue: '#2d5a27',
        },
        success: '#3d7a35',
        danger: '#8a1c1c',
        warning: '#a06820',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
        DEFAULT: '4px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
        '2xl': '10px',
        '3xl': '12px',
        'full': '9999px',
      },
      boxShadow: {
        'card': 'inset 0 1px 0 rgba(255,255,255,0.03), 0 1px 4px rgba(0,0,0,0.9)',
        'card-hover': 'inset 0 1px 0 rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.95)',
        'button': 'inset 0 1px 0 rgba(255,255,255,0.04), 0 1px 3px rgba(0,0,0,0.9)',
        'button-gold': 'inset 0 1px 0 rgba(212,175,55,0.08), 0 1px 4px rgba(0,0,0,0.9)',
        'inset-bright': 'inset 0 1px 0 rgba(255,255,255,0.05)',
        'brutal': '2px 2px 0 rgba(0,0,0,1)',
        'inner-gold': 'inset 0 0 0 1px rgba(212,175,55,0.12)',
        'xp': '0 1px 6px rgba(0,0,0,0.9)',
        'xp-strong': '0 2px 12px rgba(0,0,0,0.95)',
        'xp-sm': '0 1px 3px rgba(0,0,0,0.8)',
      },
      keyframes: {
        'ember-flicker': {
          '0%, 100%': { opacity: '1' },
          '33%': { opacity: '0.88' },
          '66%': { opacity: '0.94' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'xp-fill': {
          '0%': { width: 'var(--xp-from)' },
          '100%': { width: 'var(--xp-to)' },
        },
        'level-up-burst': {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(8px)' },
          '60%': { opacity: '1', transform: 'scale(1.02) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
      animation: {
        'ember-flicker': 'ember-flicker 4s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.35s ease forwards',
        'scale-in': 'scale-in 0.25s ease forwards',
        'float': 'float 5s ease-in-out infinite',
        'xp-fill': 'xp-fill 0.9s cubic-bezier(0.4,0,0.2,1) forwards',
        'level-up-burst': 'level-up-burst 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #a8891e 0%, #d4af37 60%, #e8c84a 100%)',
        'crimson-gradient': 'linear-gradient(135deg, #5a0f0f 0%, #8a1c1c 100%)',
        'forest-gradient': 'linear-gradient(135deg, #1a3d16 0%, #2d5a27 100%)',
        'stone-gradient': 'linear-gradient(180deg, #1e1e1e 0%, #111111 100%)',
        'track-gradient': 'linear-gradient(90deg, #1a1a1a, #111111)',
      },
    },
  },
  plugins: [],
};

export default config;