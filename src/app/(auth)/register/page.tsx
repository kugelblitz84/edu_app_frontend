'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { User, Mail, Lock, UserCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'CREATOR'>('STUDENT');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await register({
        fullName,
        username,
        email,
        password,
        role
      });
      router.push('/');
    } catch {
      setError('Registration failed. Please check inputs.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Join WitBase
        </h2>
        <p className="text-xs text-zinc-500">
          Create an account to explore curriculums and take verified exams.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl">
        <button
          type="button"
          onClick={() => setRole('STUDENT')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            role === 'STUDENT'
              ? 'bg-white text-[#6219BD] shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Enrolled Student
        </button>
        <button
          type="button"
          onClick={() => setRole('CREATOR')}
          className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            role === 'CREATOR'
              ? 'bg-white text-[#6219BD] shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Author / Creator
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Abrar Fahim"
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Username
          </label>
          <div className="relative">
            <UserCheck className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              placeholder="fahim_dev"
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@witbase.edu"
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-700 mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full pl-9 pr-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-2"
        >
          <span>{isSubmitting ? 'Registering Account...' : 'Complete Registration'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-[#6219BD] hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}
