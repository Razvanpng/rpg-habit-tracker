import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      colors: {
        surface: {
          DEFAULT: '#09090b',
          raised:  '#111113',
          overlay: '#16161a',
          border:  '#27272a',
          hover:   '#1c1c1f',
          glass:   'rgba(17, 17, 19, 0.7)',
        },
        ink: {
          primary:   '#fafafa',
          secondary: '#a1a1aa',
          tertiary:  '#52525b',
          disabled:  '#3f3f46',
        },
        xp: {
          DEFAULT: '#7c3aed',
          light:   '#8b5cf6',
          bright:  '#a78bfa',
          glow:    '#6d28d9',
          dark:    '#4c1d95',
          muted:   'rgba(124, 58, 237, 0.12)',
          border:  'rgba(124, 58, 237, 0.25)',
        },
        class: {
          warrior: '#dc2626',
          mage:    '#7c3aed',
          rogue:   '#16a34a',
        },
        success: '#22c55e',
        danger:  '#ef4444',
        warning: '#f59e0b',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'xp':          '0 0 20px rgba(124, 58, 237, 0.3)',
        'xp-strong':   '0 0 40px rgba(124, 58, 237, 0.5), 0 0 80px rgba(124, 58, 237, 0.2)',
        'xp-sm':       '0 0 10px rgba(124, 58, 237, 0.25)',
        'warrior':     '0 0 30px rgba(220, 38, 38, 0.35)',
        'mage':        '0 0 30px rgba(124, 58, 237, 0.4)',
        'rogue':       '0 0 30px rgba(22, 163, 74, 0.35)',
        'card':        '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
        'card-lg':     '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'glass':       'inset 0 1px 0 rgba(255,255,255,0.04)',
        'success':     '0 0 16px rgba(34, 197, 94, 0.3)',
      },
      keyframes: {
        'xp-fill': {
          '0%':   { width: 'var(--xp-from)' },
          '100%': { width: 'var(--xp-to)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6), 0 0 60px rgba(124, 58, 237, 0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'particle-burst': {
          '0%':   { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
      },
      animation: {
        'xp-fill':       'xp-fill 1s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'pulse-glow':    'pulse-glow 2.5s ease-in-out infinite',
        'float':         'float 4s ease-in-out infinite',
        'shimmer':       'shimmer 2.5s linear infinite',
        'fade-in-up':    'fade-in-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in':      'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'spin-slow':     'spin-slow 8s linear infinite',
        'particle-burst':'particle-burst 0.8s ease-out forwards',
      },
      backgroundImage: {
        'xp-gradient':      'linear-gradient(135deg, #7c3aed, #a78bfa)',
        'xp-gradient-h':    'linear-gradient(90deg, #6d28d9, #8b5cf6, #a78bfa)',
        'warrior-gradient': 'linear-gradient(135deg, #7f1d1d, #dc2626)',
        'mage-gradient':    'linear-gradient(135deg, #4c1d95, #7c3aed)',
        'rogue-gradient':   'linear-gradient(135deg, #14532d, #16a34a)',
        'glass-gradient':   'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0))',
        'radial-glow':      'radial-gradient(ellipse at center, var(--glow-color, rgba(124, 58, 237, 0.2)) 0%, transparent 70%)',
      },
    },
  },
  plugins: [],
};

export default config;