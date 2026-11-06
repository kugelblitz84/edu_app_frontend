'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const { login } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login({ usernameOrEmail, password });
      router.push(redirectPath);
    } catch {
      setError('Invalid credentials. Please verify your username and password.');
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = (role: 'STUDENT' | 'CREATOR') => {
    setUsernameOrEmail(role === 'STUDENT' ? 'abrar.fahim@witbase.edu' : 'arifur.architect@witbase.edu');
    setPassword('demopass123');
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Sign In to WitBase
        </h2>
        <p className="text-xs text-zinc-500">
          Enter your credentials to access your courses, exams, and notes.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* One-click demo credentials */}
      <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-purple-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo Fill
          </span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('STUDENT')}
            className="flex-1 py-1.5 px-2 bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-lg text-[11px] font-medium cursor-pointer transition-colors"
          >
            Learner Student
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('CREATOR')}
            className="flex-1 py-1.5 px-2 bg-white hover:bg-purple-100 border border-purple-200 text-purple-900 rounded-lg text-[11px] font-medium cursor-pointer transition-colors"
          >
            Tutor / Creator
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Email or Username
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="e.g. fahim_learner"
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-zinc-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] text-[#6219BD] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="font-semibold text-[#6219BD] hover:underline">
          Create student account
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
