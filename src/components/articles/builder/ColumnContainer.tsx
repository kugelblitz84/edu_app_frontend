'use client';

import React, { useState } from 'react';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import { ArticleColumn, ArticleBlock } from '@/types';
import { useArticleEditorStore } from './store/useArticleEditorStore';
import {
  TextBlockEditor,
  ImageBlockEditor,
  DividerBlockEditor,
  QuoteBlockEditor,
} from './blocks';
import {
  Plus,
  Type,
  Heading as HeadingIcon,
  Image as ImageIcon,
  Quote as QuoteIcon,
  Minus,
} from 'lucide-react';

interface ColumnContainerProps {
  sectionId: string;
  column: ArticleColumn;
  rowGap?: 'none' | 'small' | 'normal' | 'large';
  viewport?: 'desktop' | 'tablet' | 'mobile';
}

interface DraggableRowProps {
  block: ArticleBlock;
  sectionId: string;
  columnId: string;
  index: number;
}

const DraggableRow: React.FC<DraggableRowProps> = ({
  block,
  sectionId,
  columnId,
  index,
}) => {
  const { updateBlock, removeBlock, activeDragBlockId } = useArticleEditorStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  } = useDraggable({
    id: block.id,
    data: {
      type: 'block',
      block,
      sectionId,
      columnId,
      index,
    },
  });

  // Droppable slot for snapping above this item
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop-${columnId}-${index}`,
    data: {
      sectionId,
      columnId,
      index,
    },
  });

  const isCurrentDragSource = activeDragBlockId === block.id;

  const renderBlockContent = () => {
    switch (block.type) {
      case 'HEADING':
      case 'PARAGRAPH':
        return (
          <TextBlockEditor
            block={block}
            sectionId={sectionId}
            columnId={columnId}
            onChange={(updated) => updateBlock(sectionId, columnId, block.id, updated)}
            onDelete={() => removeBlock(sectionId, columnId, block.id)}
            dragHandleProps={{ ...attributes, ...listeners }}
          />
        );

      case 'IMAGE':
        return (
          <ImageBlockEditor
            block={block}
            sectionId={sectionId}
            columnId={columnId}
            onChange={(updated) => updateBlock(sectionId, columnId, block.id, updated)}
            onDelete={() => removeBlock(sectionId, columnId, block.id)}
            dragHandleProps={{ ...attributes, ...listeners }}
          />
        );

      case 'QUOTE':
        return (
          <QuoteBlockEditor
            block={block}
            sectionId={sectionId}
            columnId={columnId}
            onChange={(updated) => updateBlock(sectionId, columnId, block.id, updated)}
            onDelete={() => removeBlock(sectionId, columnId, block.id)}
            dragHandleProps={{ ...attributes, ...listeners }}
          />
        );

      case 'DIVIDER':
        return (
          <DividerBlockEditor
            block={block}
            sectionId={sectionId}
            columnId={columnId}
            onChange={(updated) => updateBlock(sectionId, columnId, block.id, updated)}
            onDelete={() => removeBlock(sectionId, columnId, block.id)}
            dragHandleProps={{ ...attributes, ...listeners }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div ref={setDropRef} className="relative w-full">
      {/* Alignment Guide Snap Line when item is dragged over this slot */}
      {isOver && !isCurrentDragSource && (
        <div className="absolute -top-2 left-0 right-0 z-30 flex items-center justify-center">
          <div className="h-1 w-full rounded-full bg-[#6219BD] ring-2 ring-purple-300 shadow-md animate-pulse" />
          <span className="absolute rounded-full bg-[#6219BD] px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
            Snap to Row
          </span>
        </div>
      )}

      <div
        ref={setNodeRef}
        className={`w-full transition-opacity ${
          isDragging ? 'opacity-30' : 'opacity-100'
        }`}
      >
        {renderBlockContent()}
      </div>
    </div>
  );
};

export const ColumnContainer: React.FC<ColumnContainerProps> = ({
  sectionId,
  column,
  rowGap = 'normal',
}) => {
  const { addBlock } = useArticleEditorStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Droppable target at the bottom of the column
  const { setNodeRef: setBottomDropRef, isOver: isBottomOver } = useDroppable({
    id: `drop-${column.id}-${column.blocks.length}`,
    data: {
      sectionId,
      columnId: column.id,
      index: column.blocks.length,
    },
  });

  const rowGapClass = {
    none: 'space-y-0',
    small: 'space-y-2',
    normal: 'space-y-4',
    large: 'space-y-6',
  }[rowGap];

  return (
    <div className="min-w-0 w-full flex flex-col justify-start rounded-xl p-1.5 flex-1">
      {/* Rows of blocks */}
      <div className={`w-full ${rowGapClass}`}>
        {column.blocks.map((block, idx) => (
          <DraggableRow
            key={block.id}
            block={block}
            sectionId={sectionId}
            columnId={column.id}
            index={idx}
          />
        ))}
      </div>

      {/* Empty State placeholder */}
      {column.blocks.length === 0 && (
        <div className="flex min-h-[100px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 p-4 text-center text-zinc-400">
          <p className="text-xs font-semibold text-zinc-500">Empty column</p>
          <span className="text-[11px] text-zinc-400">Add content below or drag a block here</span>
        </div>
      )}

      {/* Drop Zone at bottom of column */}
      <div ref={setBottomDropRef} className="relative mt-2">
        {isBottomOver && (
          <div className="my-2 flex items-center justify-center">
            <div className="h-1 w-full rounded-full bg-[#6219BD] ring-2 ring-purple-300 shadow-md animate-pulse" />
            <span className="absolute rounded-full bg-[#6219BD] px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
              Snap to End
            </span>
          </div>
        )}

        {/* Quick Add Row in this Column */}
        <div className="relative mt-2">
          {!showAddMenu ? (
            <button
              type="button"
              onClick={() => setShowAddMenu(true)}
              className="group/btn flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-200/90 py-1.5 text-[11px] font-semibold text-zinc-400 hover:border-purple-300 hover:bg-purple-50/50 hover:text-[#6219BD] transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3 group-hover/btn:scale-110 transition-transform" />
              <span>Add row in column</span>
            </button>
          ) : (
            <div
              className="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-purple-200 bg-white p-1.5 shadow-sm animate-in fade-in zoom-in-95"
              onMouseLeave={() => setShowAddMenu(false)}
            >
              <button
                type="button"
                onClick={() => {
                  addBlock(sectionId, column.id, 'PARAGRAPH');
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-purple-50 hover:text-[#6219BD] cursor-pointer"
              >
                <Type className="w-3 h-3" />
                <span>Text</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addBlock(sectionId, column.id, 'HEADING');
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-purple-50 hover:text-[#6219BD] cursor-pointer"
              >
                <HeadingIcon className="w-3 h-3" />
                <span>Heading</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addBlock(sectionId, column.id, 'IMAGE');
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-purple-50 hover:text-[#6219BD] cursor-pointer"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Image</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addBlock(sectionId, column.id, 'QUOTE');
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-purple-50 hover:text-[#6219BD] cursor-pointer"
              >
                <QuoteIcon className="w-3 h-3" />
                <span>Quote</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addBlock(sectionId, column.id, 'DIVIDER');
                  setShowAddMenu(false);
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-purple-50 hover:text-[#6219BD] cursor-pointer"
              >
                <Minus className="w-3 h-3" />
                <span>Divider</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
