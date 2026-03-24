'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch {
      // nu facem nimic aici, eroarea e afisata din store
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      <div className="bg-surface-raised border border-surface-border rounded-2xl p-8 shadow-card">
        <div className="mb-7">
          <h2 className="text-xl font-semibold text-ink-primary tracking-tight">Welcome back</h2>
          <p className="text-sm text-ink-tertiary mt-1">Continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="hero@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input
            label="Password"
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            rightElement={
              <button type="button" onClick={() => setShowPass(!showPass)} className="text-ink-tertiary hover:text-ink-secondary transition-colors text-xs font-medium">
                {showPass ? 'Hide' : 'Show'}
              </button>
            }
          />
          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-danger bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
              {error}
            </motion.p>
          )}
          <Button type="submit" isLoading={isLoading} fullWidth size="lg" className="mt-2">Sign in</Button>
        </form>
      </div>
      <p className="text-center text-sm text-ink-tertiary mt-6">
        No account? <Link href="/register" className="text-xp-text hover:text-xp-light font-medium transition-colors">Create one</Link>
      </p>
    </motion.div>
  );
}