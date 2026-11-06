'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Reset Your Password
        </h2>
        <p className="text-xs text-zinc-500">
          Enter your registered email address to receive password reset instructions.
        </p>
      </div>

      {submitted ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h3 className="text-sm font-bold text-emerald-950">Reset Link Dispatched</h3>
          <p className="text-xs text-emerald-800 leading-relaxed">
            We have sent a secure recovery link to <strong>{email}</strong>. Check your inbox and spam folder.
          </p>
          <div className="pt-2">
            <Link
              href="/reset-password?token=demo_token_123"
              className="text-xs font-semibold text-[#6219BD] underline"
            >
              (Demo: Proceed to Reset Password screen)
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 mb-1">
              Registered Email
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Sending link...' : 'Send Reset Instructions'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      <div className="text-center text-xs text-zinc-500 pt-2 border-t border-zinc-100">
        Remembered your credentials?{' '}
        <Link href="/login" className="font-semibold text-[#6219BD] hover:underline">
          Return to Sign In
        </Link>
      </div>
    </div>
  );
}
