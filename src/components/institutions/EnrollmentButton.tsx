'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InstitutionItem } from '@/types';
import { Check, CreditCard, Send, ShieldCheck, Loader2 } from 'lucide-react';
import { formatCurrencyBDT } from '@/lib/utils/formatting';

interface EnrollmentButtonProps {
  institution: InstitutionItem;
  onEnrolled?: () => void;
}

export function EnrollmentButton({ institution, onEnrolled }: EnrollmentButtonProps) {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(!!institution.isEnrolled);
  const [loading, setLoading] = useState(false);
  const [showAppModal, setShowAppModal] = useState(false);
  const [studentId, setStudentId] = useState('');

  const handleEnroll = async () => {
    setLoading(true);

    if (institution.enrollmentType === 'PAID') {
      // Simulate SSLCommerz payment flow
      await new Promise((r) => setTimeout(r, 600));
      router.push(
        `/payments/success?institution=${encodeURIComponent(institution.name)}&amount=${
          institution.enrollmentFeeBDT || 1500
        }`
      );
      return;
    }

    if (institution.enrollmentType === 'APPLICATION') {
      setLoading(false);
      setShowAppModal(true);
      return;
    }

    // Free enrollment
    await new Promise((r) => setTimeout(r, 500));
    setEnrolled(true);
    setLoading(false);
    onEnrolled?.();
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setShowAppModal(false);
    setEnrolled(true);
    setLoading(false);
    alert('Enrollment application approved for demo student!');
    onEnrolled?.();
  };

  if (enrolled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-semibold">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Enrolled Member</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleEnroll}
        disabled={loading}
        className="px-5 py-2.5 rounded-xl bg-[#673DE6] hover:bg-[#5B21B6] text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer transition-all disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : institution.enrollmentType === 'PAID' ? (
          <>
            <CreditCard className="w-4 h-4" />
            <span>Pay &amp; Enroll ({formatCurrencyBDT(institution.enrollmentFeeBDT ? institution.enrollmentFeeBDT * 100 : 150000)})</span>
          </>
        ) : institution.enrollmentType === 'APPLICATION' ? (
          <>
            <Send className="w-4 h-4" />
            <span>Apply for Admission</span>
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            <span>Instant Free Enrollment</span>
          </>
        )}
      </button>

      {/* Application Modal */}
      {showAppModal && (
        <div className="wb-modal-backdrop">
          <div className="wb-modal-card max-w-md">
            <h3 className="text-base font-bold text-zinc-900">
              Apply to {institution.name}
            </h3>
            <p className="text-xs text-zinc-500">
              Submit your academic student ID or registration number to request verified enrollment.
            </p>
            <form onSubmit={handleApplicationSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">
                  Student / Registration ID
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 2026-CSE-4192"
                  className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppModal(false)}
                  className="px-4 py-2 text-xs text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-xs font-semibold bg-[#6219BD] text-white rounded-xl shadow-xs"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

