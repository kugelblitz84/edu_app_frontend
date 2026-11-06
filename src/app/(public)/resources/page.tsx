'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FEATURED_VIDEOS, FEATURED_BOOKS } from '@/data';
import { VideoItem, BookItem } from '@/types';
import { AccessPolicyBadge } from '@/components/common';
import {
  Video,
  FileText,
  Search,
  BookOpen,
  ArrowRight,
  Sparkles
} from 'lucide-react';

function ResourcesContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'ALL';

  const [activeTab, setActiveTab] = useState<'ALL' | 'VIDEO' | 'PDF'>(
    initialType === 'VIDEO' ? 'VIDEO' : initialType === 'PDF' ? 'PDF' : 'ALL'
  );
  const [filterPolicy, setFilterPolicy] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allResources: (VideoItem | BookItem)[] = useMemo(() => {
    return [...FEATURED_VIDEOS, ...FEATURED_BOOKS];
  }, []);

  const filteredItems = useMemo(() => {
    return allResources.filter((item) => {
      const matchesType =
        activeTab === 'ALL' ||
        (activeTab === 'VIDEO' && item.type === 'VIDEO') ||
        (activeTab === 'PDF' && item.type === 'PDF');

      const matchesPolicy = filterPolicy === 'ALL' || item.accessPolicy === filterPolicy;

      const matchesSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.metadata?.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.metadata?.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesType && matchesPolicy && matchesSearch;
    });
  }, [allResources, activeTab, filterPolicy, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#181722] via-[#231A38] to-[#181722] text-white p-6 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Study Archive</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Study Resources &amp; Handbooks
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed">
            High-definition video lectures, verified university handouts, laboratory manuals, and system architecture deep-dives.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-[#6219BD] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Items ({allResources.length})
          </button>
          <button
            onClick={() => setActiveTab('VIDEO')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'VIDEO'
                ? 'bg-white text-[#6219BD] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Videos ({FEATURED_VIDEOS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('PDF')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'PDF'
                ? 'bg-white text-[#6219BD] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Notes ({FEATURED_BOOKS.length})</span>
          </button>
        </div>

        {/* Search input & Access policy dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>

          <select
            value={filterPolicy}
            onChange={(e) => setFilterPolicy(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 cursor-pointer focus:outline-none"
          >
            <option value="ALL">All Access Policies</option>
            <option value="FREE">FREE</option>
            <option value="PURCHASE">PURCHASE (PIN)</option>
            <option value="ENROLLED">ENROLLED</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const isVideo = item.type === 'VIDEO';
          return (
            <Link
              key={item.id}
              href={`/resources/${item.id}`}
              className="bg-white rounded-2xl p-5 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {isVideo ? (
                      <span className="w-7 h-7 rounded-lg bg-purple-100 text-[#6219BD] flex items-center justify-center">
                        <Video className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5" />
                      </span>
                    )}
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      {isVideo ? 'Video Lecture' : 'PDF Handbook'}
                    </span>
                  </div>

                  <AccessPolicyBadge
                    policy={item.accessPolicy}
                    priceAmountMinor={item.priceAmountMinor}
                    currency={item.currency}
                    variant="light"
                  />
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#6219BD] transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Bottom Meta & Action */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {isVideo
                    ? (item as VideoItem).duration
                    : (item as BookItem).pages}
                  {' • '}
                  {item.metadata?.author || 'WitBase'}
                </span>

                <span className="font-semibold text-[#6219BD] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  <span>{item.hasPin ? 'PIN Access' : 'View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200 space-y-3">
          <BookOpen className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-base font-bold text-zinc-800">No matching study materials found</h3>
          <p className="text-xs text-zinc-500">
            Try adjusting your search query or reset the access policy filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterPolicy('ALL');
              setActiveTab('ALL');
            }}
            className="text-xs font-semibold px-4 py-2 bg-[#6219BD] text-white rounded-xl shadow-xs"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading resources...</div>}>
      <ResourcesContent />
    </Suspense>
  );
}
