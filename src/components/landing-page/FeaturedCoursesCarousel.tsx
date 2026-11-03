'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { CollectionItem } from '@/types';
import { NotchedSectionContainer } from './NotchedSectionContainer';
import { AccessPolicyBadge } from './AccessPolicyBadge';

interface FeaturedCoursesCarouselProps {
  collections: CollectionItem[];
  activeIdx: number;
  setActiveIdx: React.Dispatch<React.SetStateAction<number>>;
  viewMode: 'rich' | 'wireframe';
  onSelectCourse: (course: CollectionItem) => void;
}

export function FeaturedCoursesCarousel({
  collections,
  activeIdx,
  setActiveIdx,
  viewMode,
  onSelectCourse
}: FeaturedCoursesCarouselProps) {
  const totalCourses = collections.length;
  const prevIdx = (activeIdx - 1 + totalCourses) % totalCourses;
  const nextIdx = (activeIdx + 1) % totalCourses;

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + totalCourses) % totalCourses);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % totalCourses);
  };

  const currentCourse = collections[activeIdx] || collections[0];
  const prevCourse = collections[prevIdx] || collections[0];
  const nextCourse = collections[nextIdx] || collections[0];

  return (
    <section aria-label="Featured Courses">
      <NotchedSectionContainer
        title="Featured Courses"
        subtitle={
          viewMode === 'rich'
            ? 'Curated Resource Collections (GET /resource-collections?featured=true)'
            : null
        }
        actionLabel="Explore Courses"
        actionIcon="grid"
        bgClass="bg-gradient-to-br from-[#6528D7] via-[#6219BD] to-[#4E129E]"
        titleColorClass="text-white"
        subtitleColorClass="text-purple-200/75"
        onActionClick={() => onSelectCourse(currentCourse)}
      >
        {/* Symmetric Coverflow Stage */}
        <div className="relative flex items-center justify-between gap-2 sm:gap-4 2xl:gap-6 pb-2 px-1 sm:px-2">
          {/* Left Chevron Button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Featured Course"
            className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-full hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7 stroke-[1.75]" />
          </button>

          {/* Left Preview Card */}
          <div
            onClick={handlePrev}
            className="wb-carousel-preview-card"
          >
            {viewMode === 'wireframe' ? (
              <div className="w-full h-full bg-[#D9DBD9]" />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${prevCourse.accent} p-3.5 2xl:p-4.5 flex flex-col justify-between relative border border-white/15 opacity-85 hover:opacity-100 transition-opacity`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] 2xl:text-[10px] font-medium px-2 py-0.5 2xl:px-2.5 2xl:py-0.5 rounded bg-white/10 text-purple-100">
                    {prevCourse.badgeText}
                  </span>
                  <AccessPolicyBadge item={prevCourse} darkBg />
                </div>
                <div>
                  <h3 className="text-xs 2xl:text-[13px] font-semibold text-white line-clamp-2 hover:text-purple-200 transition-colors">
                    {prevCourse.title}
                  </h3>
                  <p className="text-[10px] 2xl:text-[11px] text-purple-200/70 mt-0.5 2xl:mt-1">
                    By {prevCourse.metadata.author}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Center Active Spotlight Card */}
          <div
            onClick={() => onSelectCourse(currentCourse)}
            className="wb-carousel-spotlight-card group"
          >
            {viewMode === 'wireframe' ? (
              <div className="w-full h-full bg-[#D9DBD9]" />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${currentCourse.accent} p-3.5 sm:p-4 2xl:p-5.5 flex flex-col justify-between relative border border-white/25`}
              >
                <div className="absolute -right-8 -top-8 w-32 h-32 2xl:w-44 2xl:h-44 rounded-full bg-purple-400/15 blur-2xl pointer-events-none" />
                <div className="absolute right-3 bottom-8 2xl:right-5 2xl:bottom-10 opacity-10 pointer-events-none">
                  <Layers className="w-20 h-20 2xl:w-28 2xl:h-28 text-white" />
                </div>

                {/* Top Row Badges */}
                <div className="flex items-center justify-between gap-2 relative z-10">
                  <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] 2xl:text-[11px] font-semibold px-2 py-0.5 2xl:px-2.5 2xl:py-0.5 rounded bg-white/15 text-white backdrop-blur-sm">
                      <Sparkles className="w-2.5 h-2.5 2xl:w-3 2xl:h-3 text-amber-300" />
                      COLLECTION
                    </span>
                    <span className="text-[10px] 2xl:text-[11px] text-purple-200/90 truncate max-w-[120px] sm:max-w-none">
                      {currentCourse.itemCount} Modules • {currentCourse.duration}
                    </span>
                  </div>
                  <AccessPolicyBadge item={currentCourse} darkBg />
                </div>

                {/* Center Title & Description */}
                <div className="relative z-10 my-auto py-1">
                  <h3 className="text-xs sm:text-base 2xl:text-lg font-bold text-white leading-snug group-hover:text-purple-100 transition-colors line-clamp-1">
                    {currentCourse.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] 2xl:text-xs text-purple-100/80 line-clamp-2 mt-1 2xl:mt-1.5 leading-relaxed">
                    {currentCourse.description}
                  </p>
                </div>

                {/* Bottom Author & Action Footer */}
                <div className="flex items-center justify-between pt-2 2xl:pt-2.5 border-t border-white/15 relative z-10">
                  <div className="text-[11px] 2xl:text-xs text-purple-100 truncate pr-2">
                    <span className="opacity-70">By </span>
                    <span className="font-semibold text-white">
                      {currentCourse.metadata.author}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] 2xl:text-xs font-semibold bg-white text-[#4E129E] px-2.5 py-1 2xl:px-3 2xl:py-1.5 rounded-md 2xl:rounded-lg group-hover:bg-purple-100 transition-colors shadow shrink-0">
                    Open
                    <ArrowRight className="w-3 h-3 2xl:w-3.5 2xl:h-3.5" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Preview Card */}
          <div
            onClick={handleNext}
            className="wb-carousel-preview-card"
          >
            {viewMode === 'wireframe' ? (
              <div className="w-full h-full bg-[#D9DBD9]" />
            ) : (
              <div
                className={`w-full h-full bg-gradient-to-br ${nextCourse.accent} p-3.5 2xl:p-4.5 flex flex-col justify-between relative border border-white/15 opacity-85 hover:opacity-100 transition-opacity`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] 2xl:text-[10px] font-medium px-2 py-0.5 2xl:px-2.5 2xl:py-0.5 rounded bg-white/10 text-purple-100">
                    {nextCourse.badgeText}
                  </span>
                  <AccessPolicyBadge item={nextCourse} darkBg />
                </div>
                <div>
                  <h3 className="text-xs 2xl:text-[13px] font-semibold text-white line-clamp-2 hover:text-purple-200 transition-colors">
                    {nextCourse.title}
                  </h3>
                  <p className="text-[10px] 2xl:text-[11px] text-purple-200/70 mt-0.5 2xl:mt-1">
                    By {nextCourse.metadata.author}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Chevron Button */}
          <button
            onClick={handleNext}
            aria-label="Next Featured Course"
            className="w-7 h-7 sm:w-8 sm:h-8 2xl:w-10 2xl:h-10 rounded-full hover:bg-white/15 flex items-center justify-center text-white/90 hover:text-white transition-all cursor-pointer shrink-0"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 2xl:w-7 2xl:h-7 stroke-[1.75]" />
          </button>
        </div>

        {/* Bottom Pagination Indicator */}
        <div className="flex items-center justify-center gap-1.5 2xl:gap-2">
          {collections.map((col, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={col.id}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all cursor-pointer rounded-full ${
                  isActive
                    ? 'w-10 sm:w-12 2xl:w-16 h-2 2xl:h-2.5 bg-[#D9DBD9] shadow-sm'
                    : 'w-1.5 2xl:w-2 h-1.5 2xl:h-2 border border-white/60 bg-transparent hover:bg-white/40'
                }`}
              />
            );
          })}
        </div>
      </NotchedSectionContainer>
    </section>
  );
}
