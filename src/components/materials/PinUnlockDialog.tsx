'use client';

import React, { useState } from 'react';
import { Lock, KeyRound, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface PinUnlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  resourceTitle: string;
  expectedPin?: string; // Default demo pin: '1234'
}

export function PinUnlockDialog({
  isOpen,
  onClose,
  onSuccess,
  resourceTitle,
  expectedPin = '1234'
}: PinUnlockDialogProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    await new Promise((r) => setTimeout(r, 400));

    // Demo check: accepts expectedPin or '1234'
    if (pin.trim() === expectedPin || pin.trim() === '1234') {
      setSuccess(true);
      setTimeout(() => {
        setIsVerifying(false);
        onSuccess();
        onClose();
      }, 700);
    } else {
      setIsVerifying(false);
      setError('Invalid PIN code. Please check your purchase receipt or try "1234" for demo access.');
    }
  };

  return (
    <div className="wb-modal-backdrop animate-in fade-in duration-200">
      <div className="wb-modal-card max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 p-1 rounded-full cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#6219BD] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-zinc-900">Protected Material</h3>
            <p className="text-xs text-zinc-500">Security PIN required for access</p>
          </div>
        </div>

        <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-3 text-xs text-purple-900">
          <p className="font-semibold mb-0.5">{resourceTitle}</p>
          <p className="text-purple-700/80">
            This study material is secured by the author. Enter your 4-digit PIN to decrypt access.
          </p>
          <div className="mt-2 text-[11px] bg-white/80 px-2 py-1 rounded inline-block text-purple-800 font-mono">
            Demo PIN: <strong>1234</strong>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="flex items-center justify-center gap-2 py-4 text-emerald-600 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>PIN Verified! Decrypting stream...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1.5">
                4-Digit Unlock PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234)"
                  autoFocus
                  className="w-full pl-9 pr-3 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-mono tracking-widest text-center focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isVerifying || pin.length < 3}
                className="px-5 py-2 rounded-xl text-xs font-medium bg-[#6219BD] hover:bg-[#5214A0] text-white shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isVerifying ? 'Verifying...' : 'Unlock Material'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

