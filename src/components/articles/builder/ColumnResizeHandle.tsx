'use client';

import React, { useState, useRef } from 'react';
import { useArticleEditorStore } from './store/useArticleEditorStore';

interface ColumnResizeHandleProps {
  sectionId: string;
  leftColIndex: number;
  containerRef: React.RefObject<HTMLElement | null>;
  leftSpan: number;
  rightSpan: number;
}

export const ColumnResizeHandle: React.FC<ColumnResizeHandleProps> = ({
  sectionId,
  leftColIndex,
  containerRef,
  leftSpan,
  rightSpan,
}) => {
  const { resizeAdjacentColumns } = useArticleEditorStore();
  const [isDragging, setIsDragging] = useState(false);
  const [previewDeltaSpan, setPreviewDeltaSpan] = useState(0);

  const startXRef = useRef(0);
  const colWidthRef = useRef(0);
  const lastDeltaRef = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const colWidth = rect.width / 12;

    startXRef.current = e.clientX;
    colWidthRef.current = colWidth;
    lastDeltaRef.current = 0;
    setIsDragging(true);
    setPreviewDeltaSpan(0);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const deltaX = moveEvent.clientX - startXRef.current;
      const rawSpanChange = Math.round(deltaX / colWidthRef.current);

      // Enforce bounds: min 2 spans for both left and right
      const maxLeftDelta = 10 - leftSpan;
      const minLeftDelta = -(leftSpan - 2);
      const maxRightDelta = rightSpan - 2;

      const clampedSpanChange = Math.max(
        minLeftDelta,
        Math.min(maxLeftDelta, Math.min(rawSpanChange, maxRightDelta))
      );

      lastDeltaRef.current = clampedSpanChange;
      setPreviewDeltaSpan(clampedSpanChange);
    };

    const onPointerUp = () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      setIsDragging(false);

      if (lastDeltaRef.current !== 0) {
        resizeAdjacentColumns(sectionId, leftColIndex, lastDeltaRef.current);
      }
      setPreviewDeltaSpan(0);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const currentLeft = leftSpan + previewDeltaSpan;
  const currentRight = rightSpan - previewDeltaSpan;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const delta =
      event.key === 'ArrowLeft' || event.key === 'ArrowDown'
        ? -1
        : event.key === 'ArrowRight' || event.key === 'ArrowUp'
          ? 1
          : 0;

    if (delta === 0) return;
    event.preventDefault();
    resizeAdjacentColumns(sectionId, leftColIndex, delta);
  };

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={`Resize columns ${leftColIndex + 1} and ${leftColIndex + 2}`}
      aria-valuemin={2}
      aria-valuemax={10}
      aria-valuenow={currentLeft}
      aria-valuetext={`${currentLeft} / 12 and ${currentRight} / 12`}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className="group relative z-20 flex w-3 -mx-1.5 shrink-0 self-stretch cursor-col-resize select-none items-center justify-center after:absolute after:inset-y-0 after:-inset-x-2 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
      title="Drag to resize columns (snaps to grid)"
    >
      {/* Resizer track */}
      <div
        className={`h-full w-1 rounded-full transition-colors ${
          isDragging
            ? 'bg-[#6219BD] ring-4 ring-purple-500/20'
            : 'bg-zinc-200 group-hover:bg-purple-400'
        }`}
      />

      {/* Alignment Guide Line & Live Snap Indicator Badge */}
      {isDragging && (
        <>
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-purple-600/80 pointer-events-none" />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-zinc-900 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-lg pointer-events-none z-50">
            {currentLeft}/12 &bull; {currentRight}/12
          </div>
        </>
      )}
    </div>
  );
};
