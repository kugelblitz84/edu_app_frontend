'use client';

import React, { useRef, useState } from 'react';
import { ArticleSection } from '@/types';
import { useArticleEditorStore } from './store/useArticleEditorStore';
import { ColumnContainer } from './ColumnContainer';
import { ColumnResizeHandle } from './ColumnResizeHandle';
import {
  ArrowUp,
  ArrowDown,
  Copy,
  Trash2,
  Sliders,
  Plus,
} from 'lucide-react';

interface ArticleSectionItemProps {
  section: ArticleSection;
  index: number;
  totalSections: number;
  viewport: 'desktop' | 'tablet' | 'mobile';
}

export const ArticleSectionItem: React.FC<ArticleSectionItemProps> = ({
  section,
  index,
  totalSections,
  viewport,
}) => {
  const {
    activeSectionId,
    setActiveSelection,
    updateSectionStyle,
    moveSection,
    duplicateSection,
    removeSection,
    addColumn,
    removeColumn,
  } = useArticleEditorStore();

  const [showStylePanel, setShowStylePanel] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isSelected = activeSectionId === section.id;
  const style = section.style || {};

  // Paragraph continuity
  const isContinuous = !!style.isContinuousParagraph;

  // Margin styling
  const marginTopVal = isContinuous ? 0 : style.marginTop ?? 0;
  const marginBottomVal = isContinuous ? 8 : style.marginBottom ?? 24;

  // Column gap
  const columnGapClass = {
    none: 'gap-x-0',
    small: 'gap-x-4',
    normal: 'gap-x-6',
    large: 'gap-x-10',
  }[style.columnGap || 'normal'];

  // Padding
  const paddingYClass = {
    none: 'py-0',
    compact: 'py-2',
    normal: 'py-4',
    spacious: 'py-8',
  }[style.paddingY || 'normal'];

  const paddingXClass = {
    none: 'px-0',
    compact: 'px-2',
    normal: 'px-4',
    spacious: 'px-8',
  }[style.paddingX || 'normal'];

  const columns = section.columns || [];

  return (
    <div
      style={{
        marginTop: `${marginTopVal}px`,
        marginBottom: `${marginBottomVal}px`,
      }}
      className="relative transition-all"
    >
      {/* Section Container Card */}
      <section
        ref={containerRef}
        onClick={() => setActiveSelection(section.id)}
        style={{
          backgroundColor: style.backgroundColor || undefined,
          borderColor: style.borderColor || undefined,
          borderWidth: style.borderWidth !== undefined ? `${style.borderWidth}px` : undefined,
          borderRadius: style.borderRadius !== undefined ? `${style.borderRadius}px` : '16px',
        }}
        className={`group relative w-full transition-all ${paddingYClass} ${paddingXClass} ${
          isSelected
            ? 'ring-2 ring-purple-500/30 border-purple-300'
            : 'border border-zinc-200/80 hover:border-zinc-300'
        } ${!style.backgroundColor ? 'bg-white' : ''}`}
      >
        {/* Floating Top Control Bar */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-zinc-100 pb-2 text-xs">
          {/* Left: Section Label & Continuous Paragraph Badge */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold text-zinc-400">
              #{index + 1}
            </span>

            <span className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-700">
              {columns.length} {columns.length === 1 ? 'Column' : 'Columns'}
            </span>

            {/* Continuous Paragraph Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateSectionStyle(section.id, {
                  isContinuousParagraph: !isContinuous,
                });
              }}
              className={`rounded-lg px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer ${
                isContinuous
                  ? 'bg-purple-100 text-[#6219BD] font-semibold'
                  : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
              }`}
              title="Toggle whether section flows seamlessly with previous paragraph"
            >
              {isContinuous ? 'Continuous Paragraph' : 'Separate Paragraph'}
            </button>
          </div>

          {/* Right: Section Actions */}
          <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
            {/* Column count actions */}
            {columns.length < 3 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  addColumn(section.id);
                }}
                title="Add Column (up to 3)"
                className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:border-purple-300 hover:text-[#6219BD] transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Col</span>
              </button>
            )}

            {columns.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const lastCol = columns[columns.length - 1];
                  if (lastCol) removeColumn(section.id, lastCol.id);
                }}
                title="Remove Column"
                className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
              >
                - Col
              </button>
            )}

            {/* Style & Spacing Settings Toggle */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowStylePanel(!showStylePanel);
              }}
              title="Margins, Gaps & Border styling"
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium cursor-pointer transition-colors ${
                showStylePanel
                  ? 'border-purple-300 bg-purple-50 text-[#6219BD] font-bold'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
              }`}
            >
              <Sliders className="w-3 h-3" />
              <span>Style</span>
            </button>

            {/* Move Up */}
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                moveSection(index, index - 1);
              }}
              title="Move Section Up"
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-20 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>

            {/* Move Down */}
            <button
              type="button"
              disabled={index === totalSections - 1}
              onClick={(e) => {
                e.stopPropagation();
                moveSection(index, index + 1);
              }}
              title="Move Section Down"
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 disabled:opacity-20 cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            {/* Duplicate */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                duplicateSection(section.id);
              }}
              title="Duplicate Section"
              className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            {/* Delete */}
            {totalSections > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(section.id);
                }}
                title="Delete Section"
                className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Section Style & Spacing Panel */}
        {showStylePanel && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="mb-4 rounded-xl border border-purple-200 bg-purple-50/40 p-3 text-xs space-y-3 animate-in fade-in"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Top Margin */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Top Margin
                </label>
                <select
                  value={style.marginTop ?? 0}
                  onChange={(e) =>
                    updateSectionStyle(section.id, { marginTop: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value={0}>0px (None)</option>
                  <option value={8}>8px</option>
                  <option value={16}>16px</option>
                  <option value={24}>24px</option>
                  <option value={32}>32px</option>
                  <option value={48}>48px</option>
                </select>
              </div>

              {/* Bottom Margin */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Bottom Margin
                </label>
                <select
                  value={style.marginBottom ?? 24}
                  onChange={(e) =>
                    updateSectionStyle(section.id, { marginBottom: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value={0}>0px (None)</option>
                  <option value={8}>8px</option>
                  <option value={16}>16px</option>
                  <option value={24}>24px</option>
                  <option value={32}>32px</option>
                  <option value={48}>48px</option>
                </select>
              </div>

              {/* Column Gap */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Column Gap
                </label>
                <select
                  value={style.columnGap || 'normal'}
                  onChange={(e) =>
                    updateSectionStyle(section.id, {
                      columnGap: e.target.value as 'none' | 'small' | 'normal' | 'large',
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (16px)</option>
                  <option value="normal">Normal (24px)</option>
                  <option value="large">Large (40px)</option>
                </select>
              </div>

              {/* Row Gap */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Row Gap
                </label>
                <select
                  value={style.rowGap || 'normal'}
                  onChange={(e) =>
                    updateSectionStyle(section.id, {
                      rowGap: e.target.value as 'none' | 'small' | 'normal' | 'large',
                    })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value="none">None (0px)</option>
                  <option value="small">Small (8px)</option>
                  <option value="normal">Normal (16px)</option>
                  <option value="large">Large (24px)</option>
                </select>
              </div>
            </div>

            {/* Background & Border Customization */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-purple-200/60">
              {/* Background Color */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Background
                </label>
                <select
                  value={style.backgroundColor || ''}
                  onChange={(e) =>
                    updateSectionStyle(section.id, { backgroundColor: e.target.value || undefined })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value="">Default (White)</option>
                  <option value="#FBF9FE">Soft Lavender</option>
                  <option value="#F8FAFC">Cool Slate</option>
                  <option value="#FEFCE8">Warm Amber</option>
                  <option value="#F0FDF4">Soft Mint</option>
                  <option value="#18181B">Dark Mode</option>
                </select>
              </div>

              {/* Border Width */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Border Width
                </label>
                <select
                  value={style.borderWidth ?? 0}
                  onChange={(e) =>
                    updateSectionStyle(section.id, { borderWidth: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value={0}>None (0px)</option>
                  <option value={1}>1px</option>
                  <option value={2}>2px</option>
                  <option value={4}>4px</option>
                </select>
              </div>

              {/* Border Color */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Border Color
                </label>
                <select
                  value={style.borderColor || ''}
                  onChange={(e) =>
                    updateSectionStyle(section.id, { borderColor: e.target.value || undefined })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value="">Default (Zinc)</option>
                  <option value="#E4E4E7">Light Gray</option>
                  <option value="#D8B4FE">Purple Tint</option>
                  <option value="#6219BD">Brand Purple</option>
                  <option value="#CBD5E1">Slate</option>
                </select>
              </div>

              {/* Border Radius */}
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Border Radius
                </label>
                <select
                  value={style.borderRadius ?? 16}
                  onChange={(e) =>
                    updateSectionStyle(section.id, { borderRadius: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                >
                  <option value={0}>Sharp (0px)</option>
                  <option value={8}>Small (8px)</option>
                  <option value={16}>Medium (16px)</option>
                  <option value={24}>Large (24px)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Structured Column Layout Container */}
        {/* On desktop/tablet: flex-row flex-nowrap GUARANTEES all columns stay side-by-side in one row. */}
        {/* On mobile: flex-col reflows columns to stack vertically full-width. */}
        <div
          className={`flex flex-nowrap ${
            viewport === 'mobile' ? 'flex-col gap-y-4' : 'flex-row'
          } ${columnGapClass} items-stretch w-full`}
        >
          {columns.map((col, idx) => (
            <React.Fragment key={col.id}>
              {/* Column Content Wrapper */}
              <div
                style={{
                  flex:
                    viewport === 'mobile'
                      ? '1 1 100%'
                      : `${col.span || 12} ${col.span || 12} 0%`,
                  minWidth: 0,
                  width: viewport === 'mobile' ? '100%' : undefined,
                }}
                className="flex flex-col min-w-0"
              >
                <ColumnContainer
                  sectionId={section.id}
                  column={col}
                  rowGap={style.rowGap || 'normal'}
                  viewport={viewport}
                />
              </div>

              {/* Column Resizer Handle between adjacent columns on desktop */}
              {idx < columns.length - 1 && viewport !== 'mobile' && (
                <ColumnResizeHandle
                  sectionId={section.id}
                  leftColIndex={idx}
                  containerRef={containerRef}
                  leftSpan={col.span}
                  rightSpan={columns[idx + 1].span}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>
    </div>
  );
};
