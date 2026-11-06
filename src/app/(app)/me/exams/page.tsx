'use client';

import React from 'react';
import Link from 'next/link';
import { DEMO_EXAM_HISTORY } from '@/data';
import {
  GraduationCap,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { formatDate } from '@/lib/utils/formatting';

export default function MyExamHistoryPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            My Exam Attempt History
          </h1>
          <p className="text-xs text-zinc-500">
            Review your past examination performance, score breakdowns, and verified grade certifications.
          </p>
        </div>

        <Link
          href="/exams"
          className="px-4 py-2 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Browse Active Exams</span>
        </Link>
      </div>

      {/* History Grid */}
      <div className="space-y-3">
        {DEMO_EXAM_HISTORY.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-purple-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    item.isPassed
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}
                >
                  {item.isPassed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Passed</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Failed</span>
                    </>
                  )}
                </span>

                <span className="text-xs text-zinc-400 font-mono">
                  Ref: {item.id}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-900">{item.examTitle}</h3>

              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-purple-600" />
                  {formatDate(item.date)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-600" />
                  Time spent: {item.durationMinutes} mins
                </span>
              </div>
            </div>

            {/* Score pill & action */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-900">
                  {item.percentage.toFixed(0)}%
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  {item.score} / {item.maxScore} Marks
                </div>
              </div>

              <Link
                href={`/exams/${item.examId}/live`}
                className="px-4 py-2 bg-zinc-100 hover:bg-purple-100 text-zinc-700 hover:text-purple-900 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Retake / Review</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
