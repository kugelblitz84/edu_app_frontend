'use client';

import React, { useState } from 'react';
import { useArticleEditorStore } from './store/useArticleEditorStore';
import { ArticleFontFamily } from '@/types';
import {
  Palette,
  Lock,
  Globe,
  X,
  Columns,
} from 'lucide-react';

const FONT_OPTIONS: ArticleFontFamily[] = [
  'Inter',
  'Roboto',
  'Merriweather',
  'Playfair Display',
  'Fira Code',
  'System',
];

export const ArticleInspector: React.FC = () => {
  const {
    coverImageUrl,
    tags,
    accessPolicy,
    priceAmountMinor,
    pin,
    theme,
    activeSectionId,
    sections,
    setMetadata,
    setTheme,
    updateSectionStyle,
    setInspectorOpen,
  } = useArticleEditorStore();

  const [activeTab, setActiveTab] = useState<'access' | 'theme' | 'meta' | 'section'>('access');
  const [newTagInput, setNewTagInput] = useState('');
  const [showPin, setShowPin] = useState(false);

  const activeSection = sections.find((s) => s.id === activeSectionId);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const cleanTag = newTagInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
      if (cleanTag && !tags.includes(cleanTag)) {
        setMetadata({ tags: [...tags, cleanTag] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setMetadata({ tags: tags.filter((t) => t !== tagToRemove) });
  };

  return (
    <aside className="flex h-full w-80 sm:w-96 flex-col border-l border-zinc-200 bg-white shadow-xl z-20 shrink-0">
      {/* Inspector Header */}
      <div className="flex h-14 items-center justify-between border-b border-zinc-100 px-5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-[#6219BD]">
            <Palette className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-zinc-900">Article Inspector</span>
        </div>
        <button
          type="button"
          onClick={() => setInspectorOpen(false)}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-100 bg-zinc-50/50 p-1 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('access')}
          className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
            activeTab === 'access'
              ? 'bg-white text-[#6219BD] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Access
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
            activeTab === 'theme'
              ? 'bg-white text-[#6219BD] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Theme
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('meta')}
          className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
            activeTab === 'meta'
              ? 'bg-white text-[#6219BD] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Meta
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('section')}
          className={`flex-1 rounded-lg py-2 transition-all cursor-pointer ${
            activeTab === 'section'
              ? 'bg-white text-[#6219BD] shadow-xs'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          Section
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs text-zinc-700">
        {/* TAB 1: ACCESS & MONETIZATION */}
        {activeTab === 'access' && (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block font-bold text-zinc-900">Access Policy</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMetadata({ accessPolicy: 'FREE' })}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                    accessPolicy === 'FREE'
                      ? 'border-[#6219BD] bg-purple-50/50 text-[#6219BD] ring-2 ring-purple-500/10'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-bold">Public (Free)</span>
                  <span className="text-[10px] text-zinc-400">Open to all learners</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMetadata({ accessPolicy: 'PURCHASE' })}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                    accessPolicy === 'PURCHASE'
                      ? 'border-[#6219BD] bg-purple-50/50 text-[#6219BD] ring-2 ring-purple-500/10'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  <span className="font-bold">Paid Access</span>
                  <span className="text-[10px] text-zinc-400">Purchase / PIN unlock</span>
                </button>
              </div>
            </div>

            {accessPolicy === 'PURCHASE' && (
              <div className="space-y-4 rounded-2xl border border-purple-100 bg-purple-50/30 p-4">
                <div>
                  <label className="mb-1 block font-bold text-zinc-800">
                    Unlock Price (cents)
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-zinc-400 font-bold">$</span>
                    <input
                      type="number"
                      min="50"
                      step="50"
                      value={(priceAmountMinor / 100).toFixed(2)}
                      onChange={(e) =>
                        setMetadata({
                          priceAmountMinor: Math.round(parseFloat(e.target.value || '0') * 100),
                        })
                      }
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-7 pr-3 font-mono font-bold text-zinc-900 focus:outline-purple-500"
                    />
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    e.g. 4.99 USD = 499 minor units
                  </span>
                </div>

                <div>
                  <label className="mb-1 block font-bold text-zinc-800">Access PIN</label>
                  <div className="relative flex items-center">
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setMetadata({ pin: e.target.value })}
                      placeholder="Min 4 characters..."
                      className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-16 font-mono text-xs focus:outline-purple-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-2 px-2 py-1 text-[10px] font-bold text-purple-600 hover:text-purple-800 cursor-pointer"
                    >
                      {showPin ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TYPOGRAPHY & THEME */}
        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-bold text-zinc-800">Base Font Family</label>
              <select
                value={theme.baseFont}
                onChange={(e) => setTheme({ ...theme, baseFont: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium focus:outline-purple-500"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-bold text-zinc-800">Heading Font Family</label>
              <select
                value={theme.headingFont}
                onChange={(e) => setTheme({ ...theme, headingFont: e.target.value })}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-medium focus:outline-purple-500"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block font-bold text-zinc-800">Reading Container Width</label>
              <div className="grid grid-cols-3 gap-2">
                {(['narrow', 'normal', 'wide'] as const).map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setTheme({ ...theme, containerWidth: w })}
                    className={`rounded-xl border py-2 text-center font-bold capitalize transition-all cursor-pointer ${
                      theme.containerWidth === w
                        ? 'border-[#6219BD] bg-purple-50 text-[#6219BD]'
                        : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: METADATA & SEO */}
        {activeTab === 'meta' && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block font-bold text-zinc-800">Cover Image URL</label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setMetadata({ coverImageUrl: e.target.value })}
                placeholder="https://..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs focus:outline-purple-500"
              />
            </div>

            <div>
              <label className="mb-1 block font-bold text-zinc-800">Tags</label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 rounded-lg bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-red-500 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag and press Enter..."
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs focus:outline-purple-500"
              />
            </div>
          </div>
        )}

        {/* TAB 4: ACTIVE SECTION STYLING */}
        {activeTab === 'section' && (
          <div className="space-y-4">
            {activeSection ? (
              <>
                <div className="rounded-xl bg-purple-50 p-3">
                  <span className="text-[11px] font-bold text-[#6219BD]">
                    Selected Section: {activeSection.id}
                  </span>
                  <p className="text-[10px] text-zinc-500">
                    {activeSection.columns?.length || 1} Columns &bull;{' '}
                    {activeSection.style?.isContinuousParagraph
                      ? 'Continuous paragraph'
                      : 'Separate paragraph'}
                  </p>
                </div>

                {/* Continuous paragraph switch */}
                <div>
                  <label className="mb-1 block font-bold text-zinc-800">
                    Paragraph Continuity
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateSectionStyle(activeSection.id, {
                        isContinuousParagraph: !activeSection.style?.isContinuousParagraph,
                      })
                    }
                    className={`w-full rounded-xl border py-2 text-center font-bold text-xs cursor-pointer transition-colors ${
                      activeSection.style?.isContinuousParagraph
                        ? 'border-[#6219BD] bg-purple-50 text-[#6219BD]'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                    }`}
                  >
                    {activeSection.style?.isContinuousParagraph
                      ? 'Part of Same Paragraph'
                      : 'Separate Paragraph'}
                  </button>
                </div>

                {/* Margins */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Top Margin</label>
                    <select
                      value={activeSection.style?.marginTop ?? 0}
                      onChange={(e) =>
                        updateSectionStyle(activeSection.id, {
                          marginTop: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value={0}>0px</option>
                      <option value={8}>8px</option>
                      <option value={16}>16px</option>
                      <option value={24}>24px</option>
                      <option value={32}>32px</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Bottom Margin</label>
                    <select
                      value={activeSection.style?.marginBottom ?? 24}
                      onChange={(e) =>
                        updateSectionStyle(activeSection.id, {
                          marginBottom: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value={0}>0px</option>
                      <option value={8}>8px</option>
                      <option value={16}>16px</option>
                      <option value={24}>24px</option>
                      <option value={32}>32px</option>
                    </select>
                  </div>
                </div>

                {/* Gaps */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Column Gap</label>
                    <select
                      value={activeSection.style?.columnGap || 'normal'}
                      onChange={(e) =>
                        updateSectionStyle(activeSection.id, {
                          columnGap: e.target.value as 'none' | 'small' | 'normal' | 'large',
                        })
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="none">None</option>
                      <option value="small">Small (16px)</option>
                      <option value="normal">Normal (24px)</option>
                      <option value="large">Large (40px)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Row Gap</label>
                    <select
                      value={activeSection.style?.rowGap || 'normal'}
                      onChange={(e) =>
                        updateSectionStyle(activeSection.id, {
                          rowGap: e.target.value as 'none' | 'small' | 'normal' | 'large',
                        })
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="none">None</option>
                      <option value="small">Small (8px)</option>
                      <option value="normal">Normal (16px)</option>
                      <option value="large">Large (24px)</option>
                    </select>
                  </div>
                </div>

                {/* Background & Border */}
                <div className="space-y-3 pt-2 border-t border-zinc-100">
                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Background Color</label>
                    <select
                      value={activeSection.style?.backgroundColor || ''}
                      onChange={(e) =>
                        updateSectionStyle(activeSection.id, {
                          backgroundColor: e.target.value || undefined,
                        })
                      }
                      className="w-full rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="">Default (White)</option>
                      <option value="#FBF9FE">Soft Lavender</option>
                      <option value="#F8FAFC">Cool Slate</option>
                      <option value="#FEFCE8">Warm Amber</option>
                      <option value="#18181B">Dark Mode</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block font-bold text-zinc-700">Border Radius</label>
                    <select
                      value={activeSection.style?.borderRadius ?? 16}
                      onChange={(e) =>
                        updateSectionStyle(activeSection.id, {
                          borderRadius: Number(e.target.value),
                        })
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
              </>
            ) : (
              <div className="py-8 text-center text-zinc-400">
                <Columns className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-semibold">No section selected</p>
                <p className="text-[11px] mt-1">
                  Click on any section in the canvas to customize its layout and borders.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
