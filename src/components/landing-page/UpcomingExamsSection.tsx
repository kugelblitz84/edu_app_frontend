'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { UpcomingExamItem } from '@/types';
import { NotchedSectionContainer } from './NotchedSectionContainer';

interface UpcomingExamsSectionProps {
  exams: UpcomingExamItem[];
  showSymmetryGrid?: boolean;
  onRegisterExam?: (exam: UpcomingExamItem) => void;
  onVisitGym?: () => void;
}

export function UpcomingExamsSection({
  exams,
  showSymmetryGrid = false,
  onRegisterExam,
  onVisitGym
}: UpcomingExamsSectionProps) {
  return (
    <div className="wb-bento-exam-col">
      <NotchedSectionContainer
        title="Upcoming Exams"
        badge={showSymmetryGrid ? '20%' : null}
        actionLabel="Visit Gym"
        actionIcon="arrow"
        bgClass="bg-[#DFC184]"
        titleColorClass="text-[#18181B]"
        compactHeader={true}
        onActionClick={onVisitGym}
      >
        <div className="flex flex-col gap-2 2xl:gap-2.5">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="wb-exam-card"
            >
              {/* Top Row: Exam Title + Visibility Pill */}
              <div className="flex items-start justify-between gap-1.5">
                <h4
                  className="text-[11px] 2xl:text-xs font-semibold text-zinc-900 leading-tight line-clamp-1"
                  title={exam.title}
                >
                  {exam.title}
                </h4>
                <span className="bg-[#7C3AED] text-white text-[8px] 2xl:text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 leading-none">
                  {exam.visibility}
                </span>
              </div>

              {/* Bottom Row: Compact Red Timer + Dark Register Button */}
              <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-zinc-100">
                <span className="text-[9px] 2xl:text-[10px] font-semibold text-rose-600 truncate">
                  ⏳ {exam.timeRemaining}
                </span>

                <button
                  onClick={() => onRegisterExam?.(exam)}
                  className="bg-[#09090B] hover:bg-[#6219BD] text-white text-[9px] 2xl:text-[10px] font-medium px-2 py-1 2xl:px-2.5 2xl:py-1.5 rounded-[5px] 2xl:rounded-[7px] shrink-0 transition-colors cursor-pointer leading-none"
                >
                  Register
                </button>
              </div>
            </div>
          ))}

          {/* Bottom Expand Chevron */}
          <button
            aria-label="Show more exams"
            className="mx-auto mt-0.5 text-zinc-900/80 hover:text-zinc-950 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>
      </NotchedSectionContainer>
    </div>
  );
}
