'use client';

import React from 'react';
import { Sparkles, Eye, Grid } from 'lucide-react';

interface DesignControlsToolbarProps {
  viewMode: 'rich' | 'wireframe';
  setViewMode: React.Dispatch<React.SetStateAction<'rich' | 'wireframe'>>;
  showSymmetryGrid: boolean;
  setShowSymmetryGrid: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DesignControlsToolbar({
  viewMode,
  setViewMode,
  showSymmetryGrid,
  setShowSymmetryGrid
}: DesignControlsToolbarProps) {
  return (
    <div className="wb-floating-toolbar">
      <span className="px-2 py-1 text-[11px] 2xl:text-xs font-semibold text-purple-300 flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
        <span className="hidden sm:inline">Design Controls:</span>
      </span>

      {/* Toggle Rich vs Wireframe */}
      <button
        onClick={() => setViewMode((m) => (m === 'rich' ? 'wireframe' : 'rich'))}
        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 2xl:px-3.5 2xl:py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
          viewMode === 'wireframe'
            ? 'bg-[#6B2CF5] text-white'
            : 'bg-white/10 hover:bg-white/20 text-zinc-200'
        }`}
      >
        <Eye className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
        <span>{viewMode === 'rich' ? 'Wireframe' : 'Rich UI'}</span>
      </button>

      {/* Toggle 40/40/20 Symmetry Overlay */}
      <button
        onClick={() => setShowSymmetryGrid((g) => !g)}
        className={`px-2.5 py-1 sm:px-3 sm:py-1.5 2xl:px-3.5 2xl:py-2 rounded-xl font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
          showSymmetryGrid
            ? 'bg-rose-600 text-white'
            : 'bg-white/10 hover:bg-white/20 text-zinc-200'
        }`}
      >
        <Grid className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
        <span>40/40/20 Grid</span>
      </button>
    </div>
  );
}
