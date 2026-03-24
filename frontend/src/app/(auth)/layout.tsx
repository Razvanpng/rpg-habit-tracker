import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-surface bg-grid flex items-center justify-center p-4">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-xp/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-xp-muted border border-xp/20 mb-4">
            <span className="text-2xl" role="img" aria-label="sword">⚔️</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink-primary">RPG Habit Tracker</h1>
          <p className="text-sm text-ink-tertiary mt-1">Level up your life, one habit at a time</p>
        </div>
        {children}
      </div>
    </div>
  );
}