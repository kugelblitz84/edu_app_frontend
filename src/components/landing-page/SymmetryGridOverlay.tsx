'use client';

import React from 'react';

export function SymmetryGridOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-40 max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1440px] 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 2xl:px-8">
      <div className="grid grid-cols-10 gap-2 sm:gap-3.5 2xl:gap-5 h-full">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="h-full bg-rose-500/[0.06] border-x border-rose-500/20 flex flex-col justify-between py-2 items-center text-[10px] 2xl:text-xs font-mono text-rose-600 font-semibold"
          >
            <span>{idx + 1}/10</span>
            {idx === 1 && (
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded shadow text-[8px] sm:text-[9px] 2xl:text-[10px] whitespace-nowrap hidden sm:inline-block">
                40% Videos (4 cols)
              </span>
            )}
            {idx === 5 && (
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded shadow text-[8px] sm:text-[9px] 2xl:text-[10px] whitespace-nowrap hidden sm:inline-block">
                40% Books (4 cols)
              </span>
            )}
            {idx === 8 && (
              <span className="bg-rose-600 text-white px-1.5 py-0.5 rounded shadow text-[8px] sm:text-[9px] 2xl:text-[10px] whitespace-nowrap hidden sm:inline-block">
                20% Exams (2 cols)
              </span>
            )}
            <span>{(idx + 1) * 10}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
