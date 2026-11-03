'use client';

import React from 'react';
import { CheckCircle2, GraduationCap, FileSpreadsheet, ArrowRight, Check, ChevronRight } from 'lucide-react';
import { InstitutionItem } from '@/types';
import { NotchedSectionContainer } from './NotchedSectionContainer';

interface TopInstitutionsSectionProps {
  institutions: InstitutionItem[];
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
  onExplore?: () => void;
  onVisit?: (institution: InstitutionItem) => void;
}

export function TopInstitutionsSection({
  institutions,
  activeIdx,
  setActiveIdx,
  onExplore,
  onVisit
}: TopInstitutionsSectionProps) {
  const spotlightInstitution = institutions[activeIdx] || institutions[0];
  const sideInstitutions = institutions.filter((_, idx) => idx !== activeIdx);

  return (
    <section aria-label="Top Institutions">
      <NotchedSectionContainer
        title="Top Institutions"
        actionLabel="Explore Institutions"
        actionIcon="grid"
        bgClass="bg-[#E5DFD6]"
        titleColorClass="text-[#18181B]"
        onActionClick={onExplore}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 2xl:gap-5 items-stretch">
          {/* Left Column: Spotlight Institution Card */}
          <div className="wb-institution-spotlight">
            <div>
              {/* Top Row: Square Avatar + Name & Verified Pill */}
              <div className="flex items-start gap-3.5 sm:gap-4 2xl:gap-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 2xl:w-24 2xl:h-24 rounded-[12px] 2xl:rounded-[15px] bg-[#D9D9D9] shrink-0" />
                <div className="min-w-0 flex-1 pt-0.5">
                  <h3 className="text-lg sm:text-2xl 2xl:text-[28px] font-normal tracking-tight text-white truncate">
                    {spotlightInstitution.name}
                  </h3>
                  <div className="mt-1.5 sm:mt-2">
                    <span className="inline-flex items-center gap-1.5 bg-white text-zinc-900 text-xs 2xl:text-[13px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Description */}
              <p className="text-xs sm:text-[13px] 2xl:text-sm text-zinc-300/85 line-clamp-3 mt-3.5 sm:mt-4 2xl:mt-5 leading-relaxed font-light">
                {spotlightInstitution.description}
              </p>
            </div>

            {/* Bottom Row: Stats & Black Visit Button */}
            <div className="flex items-center justify-between pt-3.5 sm:pt-4 mt-3.5 sm:mt-4 border-t border-white/10">
              <div className="flex items-center gap-4 sm:gap-5 2xl:gap-6 text-xs 2xl:text-[13px] text-zinc-300">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-white" />
                  {spotlightInstitution.courses} Courses
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-white" />
                  {spotlightInstitution.exams} Exams
                </span>
              </div>

              <button
                onClick={() => onVisit?.(spotlightInstitution)}
                className="bg-[#0D0D12] hover:bg-black text-white text-xs 2xl:text-[13px] font-medium px-3.5 py-1.5 sm:px-4 sm:py-2 2xl:px-5 2xl:py-2.5 rounded-[10px] 2xl:rounded-[12px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Visit</span>
                <ArrowRight className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Vertically Stacked Partner Universities */}
          <div className="flex flex-col justify-between gap-2.5 2xl:gap-3.5 h-full">
            {sideInstitutions.map((inst) => {
              const realIdx = institutions.findIndex((i) => i.id === inst.id);
              return (
                <div
                  key={inst.id}
                  onClick={() => setActiveIdx(realIdx)}
                  className="wb-institution-item group"
                >
                  {/* Square Grey Avatar with Green Check Badge */}
                  <div className="relative w-11 h-11 sm:w-14 sm:h-14 2xl:w-16 2xl:h-16 rounded-[10px] 2xl:rounded-[12px] bg-[#D9D9D9] shrink-0">
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 2xl:w-4 2xl:h-4 rounded-full bg-[#16A34A] text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5 2xl:w-3 2xl:h-3 stroke-[3]" />
                    </span>
                  </div>

                  {/* Content (Name on top, Stats + Lavender Chevron Action on bottom) */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                    <h4 className="text-xs sm:text-[15px] 2xl:text-base font-normal text-white group-hover:text-purple-200 transition-colors truncate">
                      {inst.name}
                    </h4>

                    <div className="flex items-center justify-between gap-2 pt-1 sm:pt-1.5">
                      <div className="flex items-center gap-3 sm:gap-4 2xl:gap-5 text-[10px] sm:text-[11px] 2xl:text-xs text-zinc-300">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5">
                          <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4 text-white" />
                          {inst.courses} Courses
                        </span>
                        <span className="inline-flex items-center gap-1 sm:gap-1.5">
                          <FileSpreadsheet className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4 text-white" />
                          {inst.exams} Exams
                        </span>
                      </div>

                      <div className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7 rounded-full bg-[#DBD6EC] text-[#1D1B26] group-hover:bg-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 2xl:w-4 2xl:h-4 stroke-[2.5]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </NotchedSectionContainer>
    </section>
  );
}
