'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ArrowRight } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const institutionName = searchParams.get('institution') || 'Void Pavilion Institute';
  const amount = searchParams.get('amount') || '1500';

  const [transactionId] = useState('TXN-SSL-84910284');

  return (
    <div className="max-w-md mx-auto my-10 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl text-center space-y-6 animate-in fade-in-50 duration-300">
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
          SSLCommerz Gateway Verified
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight pt-1">
          Payment Successful!
        </h2>
        <p className="text-xs text-zinc-500">
          Your enrollment and verified access have been activated.
        </p>
      </div>

      {/* Invoice receipt breakdown */}
      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 text-left text-xs space-y-2">
        <div className="flex justify-between text-zinc-600">
          <span>Institution:</span>
          <span className="font-semibold text-zinc-900">{institutionName}</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Amount Paid:</span>
          <span className="font-bold text-zinc-900 font-mono">৳{amount} BDT</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Transaction ID:</span>
          <span className="font-mono text-purple-700">{transactionId}</span>
        </div>
        <div className="flex justify-between text-zinc-600">
          <span>Access Decision:</span>
          <span className="font-semibold text-emerald-700">GRANTED (Permanent)</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Link
          href="/collections"
          className="w-full py-2.5 px-4 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Start Learning Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/me/profile"
          className="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-xl transition-colors"
        >
          View My Profile &amp; Badges
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-400">Verifying transaction...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
