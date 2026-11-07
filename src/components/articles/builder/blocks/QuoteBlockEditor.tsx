'use client';

import React from 'react';
import { QuoteBlock } from '@/types';
import { useArticleEditorStore } from '../store/useArticleEditorStore';
import { Quote as QuoteIcon, Trash2, GripVertical } from 'lucide-react';

interface QuoteBlockEditorProps {
  block: QuoteBlock;
  sectionId: string;
  columnId: string;
  onChange: (updated: QuoteBlock) => void;
  onDelete: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export const QuoteBlockEditor: React.FC<QuoteBlockEditorProps> = ({
  block,
  sectionId,
  columnId,
  onChange,
  onDelete,
  dragHandleProps,
}) => {
  const {
    setActiveSelection,
    setActiveEditor,
    setSpecialBlockFormatting,
    activeBlockId,
    sections,
  } = useArticleEditorStore();
  const isSelected = activeBlockId === block.id;
  const sectionTextColor = sections.find((section) => section.id === sectionId)?.style?.textColor;
  const textColor =
    sectionTextColor ||
    {
      modern: '#27272A',
      classic: '#3F3F46',
      highlight: '#3B0764',
    }[block.style || 'modern'];

  const styleClass = {
    modern: 'border-l-4 border-[#6219BD] bg-purple-50/40 pl-4 py-2 rounded-r-xl',
    classic: 'border-l-4 border-zinc-400 font-serif italic pl-4 py-2',
    highlight:
      'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/60 p-4 rounded-2xl',
  }[block.style || 'modern'];

  return (
    <div
      data-article-block
      onClick={() => {
        setActiveSelection(sectionId, columnId, block.id);
        setSpecialBlockFormatting('quote');
      }}
      className={`group relative rounded-2xl border p-2.5 transition-all ${
        isSelected
          ? 'border-purple-300 ring-2 ring-purple-500/10'
          : 'border-transparent hover:border-zinc-200'
      }`}
    >
      {/* Action controls */}
      <div className="absolute right-2 top-2 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <div
          {...dragHandleProps}
          aria-label="Move quote block"
          title="Drag to move; press Space and use arrow keys"
          className="flex min-h-9 min-w-9 cursor-grab items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <select
          value={block.style || 'modern'}
          onChange={(e) =>
            onChange({
              ...block,
              style: e.target.value as 'modern' | 'classic' | 'highlight',
            })
          }
          aria-label="Quote style"
          className="min-h-9 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-600"
        >
          <option value="modern">Modern</option>
          <option value="classic">Classic</option>
          <option value="highlight">Highlight</option>
        </select>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActiveSelection(sectionId, columnId, block.id);
            onDelete();
          }}
          title="Delete quote"
          aria-label="Delete quote"
          className="flex min-h-9 min-w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className={`${styleClass} transition-colors space-y-2`} style={{ color: textColor }}>
        <div className="flex items-start gap-2">
          <QuoteIcon className="w-4 h-4 text-[#6219BD] opacity-60 shrink-0 mt-0.5" />
          <textarea
            rows={2}
            value={block.text || ''}
            onChange={(e) => onChange({ ...block, text: e.target.value })}
            onFocus={() => {
              setActiveSelection(sectionId, columnId, block.id);
              setActiveEditor(null, block.id);
              setSpecialBlockFormatting('quote');
            }}
            placeholder="Quote text..."
            className="w-full resize-none bg-transparent font-serif text-sm italic focus:outline-hidden placeholder:text-zinc-300 sm:text-base"
          />
        </div>

        <div className="text-right">
          <input
            type="text"
            value={block.author || ''}
            onChange={(e) => onChange({ ...block, author: e.target.value })}
            onFocus={() => {
              setActiveSelection(sectionId, columnId, block.id);
              setActiveEditor(null, block.id);
              setSpecialBlockFormatting('quote');
            }}
            placeholder="— Author attribution"
            className="w-48 bg-transparent text-right text-xs font-semibold text-zinc-500 focus:outline-hidden placeholder:text-zinc-300"
          />
        </div>
      </div>
    </div>
  );
};
