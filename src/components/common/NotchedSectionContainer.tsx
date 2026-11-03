'use client';

import React from 'react';
import { LayoutGrid, ArrowRight } from 'lucide-react';

/**
 * Signature WitBase Notched-Tab Container
 * Recreates the exact geometry from the design:
 * A rounded container where the top-right corner is recessed/notched
 * to house a dark charcoal action pill button.
 */
export interface NotchedSectionContainerProps {
  title: string;
  subtitle?: React.ReactNode;
  badge?: React.ReactNode;
  actionLabel: string;
  actionIcon?: 'grid' | 'arrow';
  onActionClick?: () => void;
  bgClass?: string;
  titleColorClass?: string;
  subtitleColorClass?: string;
  pageBgMatch?: string;
  compactHeader?: boolean;
  children: React.ReactNode;
}

export function NotchedSectionContainer({
  title,
  subtitle,
  badge,
  actionLabel,
  actionIcon = 'grid',
  onActionClick,
  bgClass = 'bg-[#6219BD]',
  titleColorClass = 'text-white',
  subtitleColorClass = 'text-purple-200/80',
  pageBgMatch = 'bg-[#F6F5FC]',
  compactHeader = false,
  children
}: NotchedSectionContainerProps) {
  return (
    <div className={`wb-notched-container ${bgClass}`}>
      {/* Top-Right Recessed Notch Cutout */}
      <div className={`wb-notched-cutout ${pageBgMatch}`}>
        {/* Top-left inverted fillet curve */}
        <svg
          className="absolute -left-[16px] sm:-left-[18px] 2xl:-left-[22px] top-0 w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] 2xl:w-[22px] 2xl:h-[22px] pointer-events-none"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path d="M18 0H0C9.94113 0 18 8.05887 18 18V0Z" fill="#F6F5FC" />
        </svg>
        {/* Bottom-right inverted fillet curve */}
        <svg
          className="absolute right-0 -bottom-[16px] sm:-bottom-[18px] 2xl:-bottom-[22px] w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] 2xl:w-[22px] 2xl:h-[22px] pointer-events-none"
          viewBox="0 0 18 18"
          fill="none"
        >
          <path d="M18 0H0C9.94113 0 18 8.05887 18 18V0Z" fill="#F6F5FC" />
        </svg>

        <button
          onClick={onActionClick}
          className={`wb-notched-action-btn ${
            compactHeader ? 'wb-notched-action-btn-compact' : 'wb-notched-action-btn-normal'
          }`}
        >
          {actionIcon === 'grid' && (
            <LayoutGrid className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 text-white fill-white/80 shrink-0" />
          )}
          <span>{actionLabel}</span>
          {actionIcon === 'arrow' && (
            <ArrowRight className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 shrink-0" />
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={`${
          compactHeader
            ? 'p-2.5 pt-2.5 sm:p-3 sm:pt-3 2xl:p-4 2xl:pt-3.5'
            : 'p-3 pt-3 sm:p-4 sm:pt-3.5 2xl:p-5 2xl:pt-4'
        } flex-1 flex flex-col justify-between`}
      >
        {/* Header Row */}
        <div
          className={`flex items-center justify-between ${
            compactHeader
              ? 'pr-20 sm:pr-24 2xl:pr-32 mb-2 sm:mb-2.5 2xl:mb-3'
              : 'pr-28 sm:pr-36 2xl:pr-48 mb-2.5 sm:mb-3 2xl:mb-4'
          }`}
        >
          <div className="flex items-center gap-1.5 sm:gap-2 2xl:gap-3 flex-wrap min-w-0">
            <h2
              className={`${
                compactHeader
                  ? 'text-xs 2xl:text-[13px] font-semibold truncate'
                  : 'text-sm sm:text-[15px] 2xl:text-[17px] font-medium'
              } tracking-tight ${titleColorClass}`}
              title={title}
            >
              {title}
            </h2>
            {badge && (
              <span className="text-[9px] 2xl:text-[10px] font-semibold px-1.5 py-0.5 2xl:px-2 2xl:py-0.5 rounded-full bg-black/10 text-current opacity-90 whitespace-nowrap">
                {badge}
              </span>
            )}
            {subtitle && (
              <span className={`text-[11px] 2xl:text-xs hidden xl:inline ${subtitleColorClass}`}>
                — {subtitle}
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between">{children}</div>
      </div>
    </div>
  );
}
