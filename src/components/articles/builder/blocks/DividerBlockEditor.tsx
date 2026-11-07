'use client';

import React from 'react';
import { DividerBlock } from '@/types';
import { useArticleEditorStore } from '../store/useArticleEditorStore';
import { Trash2, GripVertical } from 'lucide-react';

interface DividerBlockEditorProps {
  block: DividerBlock;
  sectionId: string;
  columnId: string;
  onChange: (updated: DividerBlock) => void;
  onDelete: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export const DividerBlockEditor: React.FC<DividerBlockEditorProps> = ({
  block,
  sectionId,
  columnId,
  onChange,
  onDelete,
  dragHandleProps,
}) => {
  const { setActiveSelection, activeBlockId } = useArticleEditorStore();
  const isSelected = activeBlockId === block.id;

  const borderClass = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  }[block.style || 'solid'];

  return (
    <div
      data-article-block
      onClick={() => setActiveSelection(sectionId, columnId, block.id)}
      className={`group relative rounded-xl border p-2 transition-all ${
        isSelected
          ? 'border-purple-300 bg-purple-50/10'
          : 'border-transparent hover:border-zinc-200 hover:bg-zinc-50/50'
      }`}
    >
      <div className="flex items-center justify-between gap-3 py-2">
        <div
          {...dragHandleProps}
          aria-label="Move divider block"
          title="Drag to move; press Space and use arrow keys"
          className="flex min-h-9 min-w-9 cursor-grab items-center justify-center rounded-lg text-zinc-300 opacity-0 transition-colors group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-zinc-100 hover:text-zinc-600 active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1">
          <hr className={`w-full border-t border-zinc-300 ${borderClass}`} />
        </div>

        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
          <select
            value={block.style || 'solid'}
            onChange={(e) =>
              onChange({ ...block, style: e.target.value as 'solid' | 'dashed' | 'dotted' })
            }
            aria-label="Divider style"
            className="min-h-9 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-600"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>

          <button
            type="button"
            aria-label="Delete divider"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSelection(sectionId, columnId, block.id);
              onDelete();
            }}
            title="Delete divider"
            className="p-1 rounded text-zinc-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
