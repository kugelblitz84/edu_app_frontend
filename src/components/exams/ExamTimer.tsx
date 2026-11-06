'use client';

import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface ExamTimerProps {
  formatted: string;
  isUrgent: boolean;
}

export function ExamTimer({ formatted, isUrgent }: ExamTimerProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
        isUrgent
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
          : 'bg-white/10 text-white border-white/15'
      }`}
    >
      {isUrgent ? (
        <AlertTriangle className="w-4 h-4 text-rose-400" />
      ) : (
        <Clock className="w-4 h-4 text-purple-300" />
      )}
      <div className="flex flex-col">
        <span className="text-[10px] text-zinc-400 uppercase font-semibold leading-none">
          {isUrgent ? 'Hurry! Time Running Out' : 'Remaining Time'}
        </span>
        <span className="text-sm sm:text-base font-mono font-bold tracking-wider leading-tight">
          {formatted}
        </span>
      </div>
    </div>
  );
}
