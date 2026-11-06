'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function PaymentCancelledPage() {
  return (
    <div className="max-w-md mx-auto my-10 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-xl text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
          Payment Cancelled
        </h2>
        <p className="text-xs text-zinc-500">
          You cancelled the checkout session before completing the transaction.
        </p>
      </div>

      <div className="flex flex-col gap-2 pt-2">
        <Link
          href="/collections"
          className="w-full py-2.5 px-4 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>Return to Courses</span>
        </Link>
        <Link
          href="/"
          className="w-full py-2 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium rounded-xl transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
