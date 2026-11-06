'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { USER_LIBRARY_DRAFTS, USER_PUBLISHED_ITEMS } from '@/data';
import { VideoItem, BookItem } from '@/types';
import { AccessPolicyBadge } from '@/components/common';
import {
  BookOpen,
  PlusCircle,
  FileText,
  Video,
  UploadCloud,
  ArrowRight
} from 'lucide-react';

export default function MyLibraryPage() {
  const [activeTab, setActiveTab] = useState<'PUBLISHED' | 'DRAFTS'>('PUBLISHED');
  const [drafts, setDrafts] = useState<(VideoItem | BookItem)[]>(USER_LIBRARY_DRAFTS);
  const [published, setPublished] = useState<(VideoItem | BookItem)[]>(USER_PUBLISHED_ITEMS);

  const handlePublishDraft = (draftId: string) => {
    const item = drafts.find((d) => d.id === draftId);
    if (!item) return;

    // Simulate optimistic version increment and publication
    const publishedItem = {
      ...item,
      status: 'PUBLISHED' as const,
      version: item.version + 1
    };

    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
    setPublished((prev) => [publishedItem, ...prev]);
    alert(`"${item.title}" successfully published to catalog (Version incremented to v${publishedItem.version})!`);
  };

  const currentList = activeTab === 'PUBLISHED' ? published : drafts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            My Study Library &amp; Drafts
          </h1>
          <p className="text-xs text-zinc-500">
            Manage your personal study uploads, unpublished drafts, and research materials.
          </p>
        </div>

        <Link
          href="/studio/new-resource"
          className="px-4 py-2 bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Upload</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-purple-100 shadow-2xs w-fit">
        <button
          onClick={() => setActiveTab('PUBLISHED')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'PUBLISHED'
              ? 'bg-[#6219BD] text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Published Content ({published.length})
        </button>
        <button
          onClick={() => setActiveTab('DRAFTS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'DRAFTS'
              ? 'bg-[#6219BD] text-white shadow-xs'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Drafts &amp; Uploads ({drafts.length})
        </button>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentList.map((item) => {
          const isVideo = item.type === 'VIDEO';
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.status} • v{item.version}
                  </span>

                  <AccessPolicyBadge
                    policy={item.accessPolicy}
                    priceAmountMinor={item.priceAmountMinor}
                    currency={item.currency}
                    variant="light"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6219BD] flex items-center justify-center shrink-0">
                    {isVideo ? <Video className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-400">
                  {isVideo
                    ? (item as VideoItem).duration
                    : (item as BookItem).pages}
                </span>

                <div className="flex items-center gap-2">
                  {activeTab === 'DRAFTS' && (
                    <button
                      onClick={() => handlePublishDraft(item.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Publish (Lock v{item.version})</span>
                    </button>
                  )}

                  <Link
                    href={`/resources/${item.id}`}
                    className="px-3 py-1.5 bg-zinc-100 hover:bg-purple-100 text-zinc-700 hover:text-purple-900 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {currentList.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-zinc-200 space-y-3">
            <BookOpen className="w-10 h-10 text-zinc-400 mx-auto" />
            <h3 className="text-base font-bold text-zinc-800">
              No {activeTab.toLowerCase()} items found
            </h3>
            <p className="text-xs text-zinc-500">
              You haven&apos;t uploaded any {activeTab.toLowerCase()} materials yet.
            </p>
            <Link
              href="/studio/new-resource"
              className="inline-flex items-center gap-1 text-xs font-semibold px-4 py-2 bg-[#6219BD] text-white rounded-xl shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create First Resource</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
