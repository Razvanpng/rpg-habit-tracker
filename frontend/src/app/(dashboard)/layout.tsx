'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, fetchMe, isLoading } = useAuthStore();

  useEffect(() => {
    void fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    // redirect la login daca nu e logat dupa ce se termina fetch-ul
    if (!isLoading && user === null) {
      router.replace('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-xp border-t-transparent animate-spin" />
      </div>
    );
  }

  return <div className="min-h-dvh bg-surface">{children}</div>;
}