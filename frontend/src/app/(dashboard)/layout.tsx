'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

interface DashboardLayoutProps {
  children: ReactNode;
}

function FullScreenLoader({ label }: { label: string }) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className="w-5 h-5 border border-xp/40 border-t-xp"
      />
      <p className="text-2xs font-display text-ink-disabled tracking-widest uppercase">
        {label}
      </p>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isHydrated, isLoading, fetchMe } = useAuthStore();

  useEffect(() => {
    if (isHydrated) {
      void fetchMe();
    }
  }, [isHydrated, fetchMe]);

  useEffect(() => {
    if (!isHydrated) return;
    if (isLoading) return;
    if (!user) router.replace('/login');
  }, [isHydrated, isLoading, user, router]);

  if (!isHydrated) {
    return <FullScreenLoader label="Restoring session" />;
  }

  if (!user) {
    return <FullScreenLoader label="Authenticating" />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="min-h-dvh bg-surface"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}