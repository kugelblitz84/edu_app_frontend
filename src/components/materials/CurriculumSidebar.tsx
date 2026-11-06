'use client';

import React from 'react';
import { CollectionCurriculumItem } from '@/types';
import { Video, FileText, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

interface CurriculumSidebarProps {
  items: CollectionCurriculumItem[];
  activeItemId: string;
  onSelectItem: (item: CollectionCurriculumItem) => void;
  collectionTitle: string;
}

export function CurriculumSidebar({
  items,
  activeItemId,
  onSelectItem,
  collectionTitle
}: CurriculumSidebarProps) {
  const completedCount = items.filter((i) => i.isCompleted).length;
  const progressPercent = Math.round((completedCount / (items.length || 1)) * 100);

  return (
    <div className="bg-[#181722] text-white rounded-2xl p-4 sm:p-5 flex flex-col h-full border border-white/10 shadow-lg">
      {/* Header & Progress */}
      <div className="pb-4 border-b border-white/10 space-y-2">
        <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300">
          Course Curriculum
        </span>
        <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
          {collectionTitle}
        </h3>

        {/* Progress bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Progress: {completedCount}/{items.length} Completed</span>
            <span className="font-mono text-purple-300">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2 pr-1">
        {items.map((item) => {
          const isActive = item.id === activeItemId;
          return (
            <button
              key={item.id}
              onClick={() => onSelectItem(item)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 cursor-pointer group ${
                isActive
                  ? 'bg-purple-600/30 border border-purple-500/50 text-white shadow-xs'
                  : 'hover:bg-white/5 text-zinc-300 border border-transparent'
              }`}
            >
              <div className="pt-0.5 shrink-0">
                {item.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isActive ? (
                  <PlayCircle className="w-4 h-4 text-purple-300" />
                ) : (
                  <Circle className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mb-0.5">
                  {item.type === 'VIDEO' ? (
                    <span className="flex items-center gap-1 text-purple-300">
                      <Video className="w-3 h-3" />
                      Video
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sky-300">
                      <FileText className="w-3 h-3" />
                      PDF Notes
                    </span>
                  )}
                  <span>•</span>
                  <span>{item.duration || item.pages}</span>
                </div>
                <p className={`text-xs font-medium leading-snug line-clamp-2 ${isActive ? 'text-white font-semibold' : 'text-zinc-200'}`}>
                  {item.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
