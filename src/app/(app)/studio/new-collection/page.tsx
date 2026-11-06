'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FEATURED_VIDEOS, FEATURED_BOOKS } from '@/data';
import { CollectionCurriculumItem } from '@/types';
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  CheckCircle2,
  Save,
  Video,
  FileText
} from 'lucide-react';

export default function NewCollectionBuilderPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [accent, setAccent] = useState('from-indigo-900 via-purple-900 to-slate-900');
  const [accessPolicy, setAccessPolicy] = useState<'FREE' | 'PURCHASE' | 'ENROLLED'>('FREE');

  // Bundled items list
  const [items, setItems] = useState<CollectionCurriculumItem[]>([
    {
      id: 'item-b1',
      resourceId: FEATURED_VIDEOS[0].id,
      title: FEATURED_VIDEOS[0].title,
      type: 'VIDEO',
      duration: FEATURED_VIDEOS[0].duration,
      position: 1
    },
    {
      id: 'item-b2',
      resourceId: FEATURED_BOOKS[0].id,
      title: FEATURED_BOOKS[0].title,
      type: 'PDF',
      pages: FEATURED_BOOKS[0].pages,
      position: 2
    }
  ]);

  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const moveItem = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const copy = [...items];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    // re-index positions
    const reindexed = copy.map((item, idx) => ({ ...item, position: idx + 1 }));
    setItems(reindexed);
  };

  const removeItem = (id: string) => {
    const filtered = items.filter((i) => i.id !== id);
    setItems(filtered.map((item, idx) => ({ ...item, position: idx + 1 })));
  };

  const handleSaveCollection = async () => {
    if (!title.trim()) {
      alert('Please enter a collection title.');
      return;
    }
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setIsSaved(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          Collection Curriculum Builder
        </h1>
        <p className="text-xs text-zinc-500">
          Curate and order multiple resources into an interactive modular curriculum course.
        </p>
      </div>

      {isSaved ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-purple-100 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">
            Collection Curriculum Created!
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Your collection &ldquo;{title}&rdquo; with {items.length} modules has been created and published.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/collections"
              className="px-5 py-2.5 bg-[#6219BD] text-white rounded-xl text-xs font-semibold shadow-xs"
            >
              View in Courses Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Col: Metadata */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
              Course Details
            </h3>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Collection Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full-Stack Systems Mastery"
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe this curriculum bundle..."
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Access Policy
              </label>
              <select
                value={accessPolicy}
                onChange={(e) => setAccessPolicy(e.target.value as 'FREE' | 'PURCHASE' | 'ENROLLED')}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700"
              >
                <option value="FREE">FREE</option>
                <option value="PURCHASE">PURCHASE</option>
                <option value="ENROLLED">ENROLLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Visual Card Accent
              </label>
              <select
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700"
              >
                <option value="from-indigo-900 via-purple-900 to-slate-900">Deep Purple / Indigo</option>
                <option value="from-violet-950 via-fuchsia-900 to-indigo-950">Violet / Fuchsia</option>
                <option value="from-slate-900 via-purple-950 to-indigo-900">Dark Charcoal / Purple</option>
              </select>
            </div>
          </div>

          {/* Right 2 Cols: Reordering & Modules */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">
                  Curriculum Module Order
                </h3>
                <p className="text-xs text-zinc-500">
                  Arrange the learning sequence. Calls <code className="bg-zinc-100 px-1 py-0.5 rounded text-[10px]">PUT /items/order</code>.
                </p>
              </div>

              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-purple-50 text-[#6219BD]">
                {items.length} Modules
              </span>
            </div>

            {/* List */}
            <div className="space-y-2.5">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-zinc-200/90 bg-zinc-50/50 hover:bg-white flex items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-[#6219BD]/10 text-[#6219BD] font-bold font-mono text-xs flex items-center justify-center shrink-0">
                      {item.position}
                    </span>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-zinc-400">
                        {item.type === 'VIDEO' ? (
                          <span className="flex items-center gap-1 text-purple-700">
                            <Video className="w-3 h-3" /> Video
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sky-700">
                            <FileText className="w-3 h-3" /> PDF
                          </span>
                        )}
                        <span>•</span>
                        <span>{item.duration || item.pages}</span>
                      </div>
                      <p className="text-xs font-semibold text-zinc-800 truncate">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* Move Up/Down/Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'UP')}
                      className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-600 disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'DOWN')}
                      className="p-1.5 rounded-lg hover:bg-zinc-200 text-zinc-600 disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 cursor-pointer"
                      title="Remove from collection"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save Action */}
            <div className="pt-4 border-t border-zinc-100 flex justify-end">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveCollection}
                className="px-6 py-2.5 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Building Collection...' : 'Save & Publish Collection'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
