'use client';

import React from 'react';
import { ExamQuestion, ExamAnswer } from '@/types';
import { Flag, Send } from 'lucide-react';

interface QuestionPaletteProps {
  questions: ExamQuestion[];
  currentIndex: number;
  answers: Record<string, ExamAnswer>;
  onSelectIndex: (idx: number) => void;
  onSubmitExam: () => void;
  isSubmitting?: boolean;
}

export function QuestionPalette({
  questions,
  currentIndex,
  answers,
  onSelectIndex,
  onSubmitExam,
  isSubmitting
}: QuestionPaletteProps) {
  const answeredCount = Object.values(answers).filter(
    (a) => a.selectedOptionIds && a.selectedOptionIds.length > 0
  ).length;

  const flaggedCount = Object.values(answers).filter((a) => a.isFlagged).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="bg-[#181722] text-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full border border-white/10 shadow-xl space-y-4">
      <div className="space-y-4">
        <div>
          <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-purple-300">
            Question Palette
          </h4>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Jump to any question or review flagged items
          </p>
        </div>

        {/* Legend status indicators */}
        <div className="grid grid-cols-3 gap-2 text-[11px] bg-white/5 p-2 rounded-xl">
          <div className="flex items-center gap-1.5 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Answered ({answeredCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Flagged ({flaggedCount})</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
            <span>Remaining ({unansweredCount})</span>
          </div>
        </div>

        {/* Question Grid Buttons */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {questions.map((q, idx) => {
            const answer = answers[q.id];
            const hasAnswer = answer?.selectedOptionIds?.length > 0;
            const isFlagged = !!answer?.isFlagged;
            const isCurrent = idx === currentIndex;

            let bgClass = 'bg-white/10 text-zinc-300 hover:bg-white/20';
            if (isFlagged) {
              bgClass = 'bg-amber-500/20 text-amber-300 border border-amber-400/60 font-bold';
            } else if (hasAnswer) {
              bgClass = 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 font-bold';
            }

            return (
              <button
                key={q.id}
                onClick={() => onSelectIndex(idx)}
                className={`relative h-10 rounded-xl text-xs font-mono transition-all flex items-center justify-center cursor-pointer ${bgClass} ${
                  isCurrent ? 'ring-2 ring-purple-400 scale-105 shadow-md shadow-purple-900/50' : ''
                }`}
              >
                <span>{idx + 1}</span>
                {isFlagged && (
                  <Flag className="w-2.5 h-2.5 text-amber-400 absolute top-1 right-1 fill-amber-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        <button
          onClick={onSubmitExam}
          disabled={isSubmitting}
          className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-gradient-to-r from-[#6219BD] to-[#673DE6] hover:from-[#5214A0] hover:to-[#5B21B6] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 cursor-pointer active:scale-98 transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Finalizing Exam...' : 'Finish & Submit Exam'}</span>
        </button>
        <p className="text-[10px] text-zinc-400 text-center">
          Answers are synced in real time. You can safely review answers until submission.
        </p>
      </div>
    </div>
  );
}
