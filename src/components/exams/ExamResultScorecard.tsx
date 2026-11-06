'use client';

import React from 'react';
import Link from 'next/link';
import { ExamResult } from '@/types';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Home,
  ChevronDown
} from 'lucide-react';
import { formatDurationSeconds } from '@/lib/utils/formatting';

interface ExamResultScorecardProps {
  result: ExamResult;
  onRetake?: () => void;
}

export function ExamResultScorecard({ result, onRetake }: ExamResultScorecardProps) {
  const [showDetailedReview, setShowDetailedReview] = React.useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Banner / Verdict */}
      <div
        className={`rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-2xl border ${
          result.isPassed
            ? 'bg-gradient-to-br from-emerald-950 via-[#181722] to-purple-950 border-emerald-500/40'
            : 'bg-gradient-to-br from-rose-950 via-[#181722] to-slate-950 border-rose-500/40'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                result.isPassed
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{result.isPassed ? 'Official Pass Verified' : 'Assessment Failed'}</span>
            </span>

            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {result.examTitle}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300">
              Pass Mark: {result.passPercentage}% • Time Spent:{' '}
              {formatDurationSeconds(result.timeSpentSeconds)}
            </p>
          </div>

          {/* Score Circle / Badge */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 text-center border border-white/20 min-w-[140px] sm:min-w-[160px]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
              Total Score
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold font-mono tracking-tight text-white my-1">
              {result.percentage.toFixed(0)}%
            </div>
            <p className="text-xs text-zinc-300 font-mono">
              {result.score} / {result.maxScore} Marks
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-400 uppercase">Total Questions</span>
          <p className="text-2xl font-extrabold text-zinc-900 font-mono">{result.totalQuestions}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-emerald-200 bg-emerald-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Correct
          </span>
          <p className="text-2xl font-extrabold text-emerald-950 font-mono">
            {result.correctAnswersCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-rose-200 bg-rose-50/30 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-rose-700 uppercase flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Incorrect
          </span>
          <p className="text-2xl font-extrabold text-rose-950 font-mono">
            {result.wrongAnswersCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-zinc-200 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-zinc-500 uppercase flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> Unanswered
          </span>
          <p className="text-2xl font-extrabold text-zinc-800 font-mono">
            {result.unansweredCount}
          </p>
        </div>
      </div>

      {/* Detailed Question Review */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-zinc-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <div>
            <h3 className="text-base font-bold text-zinc-900">Comprehensive Question Review</h3>
            <p className="text-xs text-zinc-500">Analyze correct answers and technical explanations</p>
          </div>
          <button
            onClick={() => setShowDetailedReview((s) => !s)}
            className="text-xs font-semibold text-[#6219BD] hover:text-[#4E129E] flex items-center gap-1 cursor-pointer"
          >
            <span>{showDetailedReview ? 'Hide Explanations' : 'Show Explanations'}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${showDetailedReview ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {showDetailedReview && (
          <div className="space-y-4 pt-2">
            {result.breakdown.map((item, idx) => (
              <div
                key={item.questionId}
                className={`p-4 sm:p-5 rounded-xl border space-y-3 ${
                  item.isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-zinc-700">
                      Earned {item.earnedMarks} / {item.maxMarks} Marks
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.isCorrect
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {item.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>

                <p className="text-sm font-semibold text-zinc-900 leading-snug">{item.text}</p>

                {/* Options display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {item.options.map((opt) => {
                    const isUserChoice = item.userSelectedIds.includes(opt.id);
                    const isCorrectAnswer = item.correctOptionIds.includes(opt.id);

                    let optClass = 'bg-white border-zinc-200 text-zinc-700';
                    if (isCorrectAnswer) {
                      optClass = 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold';
                    } else if (isUserChoice && !isCorrectAnswer) {
                      optClass = 'bg-rose-100/70 border-rose-300 text-rose-950 line-through';
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${optClass}`}
                      >
                        <span>{opt.text}</span>
                        {isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-bold text-emerald-700">
                            (Correct)
                          </span>
                        )}
                        {isUserChoice && !isCorrectAnswer && (
                          <span className="text-[10px] uppercase font-bold text-rose-700">
                            (Your Pick)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {item.explanation && (
                  <div className="bg-white/80 p-3 rounded-lg border border-purple-100 text-xs text-zinc-700 space-y-1">
                    <span className="font-bold text-[#6219BD]">Explanation:</span>
                    <p className="text-zinc-600 leading-relaxed">{item.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <Link
          href="/exams"
          className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center gap-2 shadow-xs transition-colors"
        >
          <Home className="w-4 h-4 text-purple-600" />
          <span>Exams Directory</span>
        </Link>

        <div className="flex items-center gap-2">
          {onRetake && (
            <button
              onClick={onRetake}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#181722] hover:bg-[#282736] text-white flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Simulation</span>
            </button>
          )}

          <Link
            href="/me/exams"
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#6219BD] hover:bg-[#5214A0] text-white shadow-sm transition-all"
          >
            <span>View All Exam History</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
