'use client';

import React from 'react';
import { WifiOff, AlertCircle } from 'lucide-react';

interface ExamRecoveryBannerProps {
  isSaving: boolean;
  isOnline: boolean;
  wasRecovered?: boolean;
}

export function ExamRecoveryBanner({
  isSaving,
  isOnline,
  wasRecovered
}: ExamRecoveryBannerProps) {
  return (
    <div className="flex items-center gap-2">
      {wasRecovered && (
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium bg-amber-500/20 text-amber-200 border border-amber-400/30 px-2.5 py-1 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>Session Recovered from Local Storage</span>
        </span>
      )}

      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
          !isOnline
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            : isSaving
            ? 'bg-purple-500/20 text-purple-200 border border-purple-400/30'
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            <span>Offline (Saving Locally)</span>
          </>
        ) : isSaving ? (
          <>
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
            <span>Syncing answer...</span>
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">WebSocket Synced</span>
            <span className="sm:hidden">Synced</span>
          </>
        )}
      </div>
    </div>
  );
}
