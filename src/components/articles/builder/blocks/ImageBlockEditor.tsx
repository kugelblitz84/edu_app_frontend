'use client';

import React, { useState } from 'react';
import { ImageBlock } from '@/types';
import { useArticleEditorStore } from '../store/useArticleEditorStore';
import {
  Image as ImageIcon,
  Sliders,
  Trash2,
  GripVertical,
  Link as LinkIcon,
} from 'lucide-react';

interface ImageBlockEditorProps {
  block: ImageBlock;
  sectionId: string;
  columnId: string;
  onChange: (updated: ImageBlock) => void;
  onDelete: () => void;
  dragHandleProps?: Record<string, unknown>;
}

export const ImageBlockEditor: React.FC<ImageBlockEditorProps> = ({
  block,
  sectionId,
  columnId,
  onChange,
  onDelete,
  dragHandleProps,
}) => {
  const { setActiveSelection, activeBlockId } = useArticleEditorStore();
  const [showSettings, setShowSettings] = useState(false);

  const isSelected = activeBlockId === block.id;

  const aspectClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    auto: 'aspect-auto max-h-96',
  }[block.aspectRatio || '16:9'];

  const widthStyle = block.widthPercentage ? `${block.widthPercentage}%` : '100%';
  const borderRadiusStyle = block.borderRadius !== undefined ? `${block.borderRadius}px` : '12px';

  return (
    <div
      data-article-block
      onClick={() => setActiveSelection(sectionId, columnId, block.id)}
      className={`group relative rounded-2xl border p-3 transition-all ${
        isSelected
          ? 'border-purple-300 bg-purple-50/10 shadow-xs ring-2 ring-purple-500/10'
          : 'border-zinc-200 bg-white hover:border-purple-200 hover:shadow-xs'
      }`}
    >
      {/* Top Header / Actions Bar */}
      <div className="mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-zinc-700">
          <div
            {...dragHandleProps}
            aria-label="Move image block"
            title="Drag to move; press Space and use arrow keys"
            className="flex min-h-9 min-w-9 cursor-grab items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 active:cursor-grabbing"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <ImageIcon className="w-3.5 h-3.5 text-[#6219BD]" />
          <span>Image</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Image options"
            aria-pressed={showSettings}
            onClick={(e) => {
              e.stopPropagation();
              setActiveSelection(sectionId, columnId, block.id);
              setShowSettings(!showSettings);
            }}
            className={`flex min-h-9 items-center gap-1 rounded-lg px-2.5 text-xs transition-colors ${
              showSettings
                ? 'bg-purple-100 font-bold text-[#6219BD]'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Sliders className="w-3 h-3" />
            <span>Options</span>
          </button>

          <button
            type="button"
            aria-label="Delete image"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSelection(sectionId, columnId, block.id);
              onDelete();
            }}
            title="Delete image"
            className="flex min-h-9 min-w-9 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Preview & URL action */}
      <div className="flex justify-center">
        <div
          className="relative overflow-hidden border border-zinc-200/80 bg-zinc-50 shadow-xs group/img"
          style={{ width: widthStyle, borderRadius: borderRadiusStyle }}
        >
          {block.url ? (
            <img
              src={block.url}
              alt={block.altText || 'Article media'}
              className={`w-full object-cover ${aspectClass}`}
              loading="lazy"
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center p-6 text-center text-zinc-400">
              <ImageIcon className="w-8 h-8 opacity-40 mb-2" />
              <p className="text-xs">No image URL configured</p>
            </div>
          )}

          {/* Overlay to edit image URL */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveSelection(sectionId, columnId, block.id);
                const nextUrl = window.prompt('Enter Image URL:', block.url);
                if (nextUrl !== null) onChange({ ...block, url: nextUrl });
              }}
              className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-md hover:bg-zinc-100 cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5 text-[#6219BD]" />
              <span>{block.url ? 'Change Image' : 'Set URL'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Caption Input */}
      <div className="mt-2 text-center">
        <input
          type="text"
          value={block.caption || ''}
          onChange={(e) => onChange({ ...block, caption: e.target.value })}
          placeholder="Add an optional caption..."
          className="w-full bg-transparent text-center text-xs text-zinc-500 italic focus:outline-hidden placeholder:text-zinc-300"
        />
      </div>

      {/* Collapsible Advanced Settings */}
      {showSettings && (
        <div className="mt-3 rounded-xl border border-zinc-200 bg-zinc-50 p-3 text-xs space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                Aspect Ratio
              </label>
              <select
                value={block.aspectRatio || '16:9'}
                onChange={(e) =>
                  onChange({
                    ...block,
                    aspectRatio: e.target.value as '16:9' | '4:3' | '1:1' | 'auto',
                  })
                }
                className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
              >
                <option value="16:9">16:9 (Widescreen)</option>
                <option value="4:3">4:3 (Standard)</option>
                <option value="1:1">1:1 (Square)</option>
                <option value="auto">Auto Height</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                Width: {block.widthPercentage || 100}%
              </label>
              <input
                type="range"
                min="25"
                max="100"
                step="5"
                value={block.widthPercentage || 100}
                onChange={(e) => onChange({ ...block, widthPercentage: Number(e.target.value) })}
                className="w-full accent-[#6219BD]"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-zinc-600 block mb-1">
              Alt Text (Accessibility)
            </label>
            <input
              type="text"
              value={block.altText || ''}
              onChange={(e) => onChange({ ...block, altText: e.target.value })}
              placeholder="Descriptive image summary for screen readers..."
              className="w-full rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs focus:outline-purple-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
