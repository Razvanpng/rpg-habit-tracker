'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: '8+ chars', pass: password.length >= 8 },
    { label: 'Upper', pass: /[A-Z]/.test(password) },
    { label: 'Lower', pass: /[a-z]/.test(password) },
    { label: 'Num', pass: /\d/.test(password) },
  ];

  const score = checks.filter((c) => c.pass).length;
  const colors = ['bg-surface-border', 'bg-danger', 'bg-warning', 'bg-warning', 'bg-success'];

  if (!password) return null;

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex flex-col gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= score ? colors[score] : 'bg-surface-border'}`} />
        ))}
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    try {
      await register({ email, password });
      router.push('/dashboard');
    } catch {}
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      <div className="bg-surface-raised border border-surface-border rounded-2xl p-8 shadow-card">
        <div className="mb-7">
          <h2 className="text-xl font-semibold text-ink-primary tracking-tight">Begin your journey</h2>
          <p className="text-sm text-ink-tertiary mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label="Email" type="email" placeholder="hero@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="flex flex-col gap-2">
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
            <PasswordStrength password={password} />
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-danger bg-danger/5 border border-danger/20 rounded-lg px-3 py-2">
              {error}
            </motion.p>
          )}

          <Button type="submit" isLoading={isLoading} fullWidth size="lg" className="mt-2">Create account</Button>
        </form>
      </div>
      <p className="text-center text-sm text-ink-tertiary mt-6">
        Already have an account? <Link href="/login" className="text-xp-text hover:text-xp-light font-medium transition-colors">Sign in</Link>
      </p>
    </motion.div>
  );
}