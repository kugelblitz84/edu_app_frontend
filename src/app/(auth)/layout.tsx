'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F5FC] text-zinc-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-1.5 select-none">
          <span className="wb-header-logo-text">
            Wit<span className="text-[#3F3D56]">Base</span>
          </span>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#6219BD] bg-white/70 hover:bg-white px-3 py-1.5 rounded-xl border border-purple-200/50 shadow-2xs transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Centered Auth Card Area */}
      <div className="w-full max-w-md mx-auto my-8">
        {children}
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-zinc-400 space-y-1">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>WitBase Single Sign-On &amp; Session Guard</span>
        </div>
        <p>&copy; 2026 WitBase Education Inc. All rights reserved.</p>
      </div>
    </div>
  );
}
