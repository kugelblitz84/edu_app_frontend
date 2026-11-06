'use client';

import React from 'react';
import { ExamQuestion, ExamAnswer } from '@/types';
import { Flag, Trash2, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface QuestionCardProps {
  question: ExamQuestion;
  index: number;
  totalQuestions: number;
  answer?: ExamAnswer;
  onSelectOption: (optionId: string) => void;
  onToggleFlag: () => void;
  onClearAnswer: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function QuestionCard({
  question,
  index,
  totalQuestions,
  answer,
  onSelectOption,
  onToggleFlag,
  onClearAnswer,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: QuestionCardProps) {
  const selectedOptionIds = answer?.selectedOptionIds || [];
  const isFlagged = !!answer?.isFlagged;

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-8 border border-purple-100 shadow-xl flex flex-col justify-between h-full space-y-6">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-100 text-[#6219BD]">
              Question {index + 1} of {totalQuestions}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700">
              {question.marks} Marks
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFlag}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                isFlagged
                  ? 'bg-amber-50 text-amber-700 border-amber-300 font-semibold'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{isFlagged ? 'Flagged for Review' : 'Flag Question'}</span>
            </button>

            {selectedOptionIds.length > 0 && (
              <button
                onClick={onClearAnswer}
                className="text-xs text-zinc-500 hover:text-rose-600 px-2 py-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-1 cursor-pointer transition-colors"
                title="Clear selection"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-base sm:text-lg font-bold text-zinc-900 leading-snug">
          {question.text}
        </h3>

        {/* Options */}
        <div className="space-y-2.5 pt-2">
          {question.options.map((option, optIdx) => {
            const isSelected = selectedOptionIds.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => onSelectOption(option.id)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all flex items-start gap-3 cursor-pointer group ${
                  isSelected
                    ? 'border-[#6219BD] bg-purple-50/70 text-zinc-900 ring-1 ring-[#6219BD]/30 shadow-xs'
                    : 'border-zinc-200/90 hover:border-purple-200 hover:bg-zinc-50/80 text-zinc-700'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg text-xs font-mono font-bold shrink-0 flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-[#6219BD] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 group-hover:bg-purple-100 group-hover:text-purple-800'
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : optionLetters[optIdx]}
                </div>
                <span className="text-xs sm:text-sm font-medium leading-relaxed pt-0.5">
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="px-4 py-2 rounded-xl text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#181722] hover:bg-[#252433] text-white disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 cursor-pointer transition-all shadow-xs"
        >
          <span>Next Question</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

