'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FEATURED_COLLECTIONS } from '@/data';
import { AccessPolicyBadge } from '@/components/common';
import { Search, Sparkles, ArrowRight, Clock } from 'lucide-react';

export default function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPolicy, setFilterPolicy] = useState('ALL');

  const filteredCollections = useMemo(() => {
    return FEATURED_COLLECTIONS.filter((col) => {
      const matchesPolicy = filterPolicy === 'ALL' || col.accessPolicy === filterPolicy;
      const matchesSearch =
        !searchQuery.trim() ||
        col.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.metadata.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.metadata.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesPolicy && matchesSearch;
    });
  }, [searchQuery, filterPolicy]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1E1135] via-[#2A1647] to-[#181722] text-white p-6 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Structured Learning Tracks</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Curated Collections &amp; Courses
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed">
            Multi-module curricula combining interactive video masterclasses, verified PDF lecture notes, and proctored exam milestones.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-700">Showing {filteredCollections.length} Curriculums</span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections..."
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
            <option value="PURCHASE">PURCHASE</option>
            <option value="ENROLLED">ENROLLED</option>
          </select>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCollections.map((col) => (
          <div
            key={col.id}
            className={`rounded-2xl p-6 bg-gradient-to-br ${col.accent} text-white shadow-xl flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01] border border-white/10 space-y-5`}
          >
            <div className="space-y-3">
              {/* Badge & Policy */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-purple-200">
                  {col.badgeText}
                </span>

                <AccessPolicyBadge
                  policy={col.accessPolicy}
                  priceAmountMinor={col.priceAmountMinor}
                  currency={col.currency}
                  variant="dark"
                />
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-2">
                  {col.title}
                </h3>
                <p className="text-xs text-zinc-300/80 mt-1 line-clamp-2 leading-relaxed">
                  {col.description}
                </p>
              </div>

              {/* Tags */}
              {col.metadata?.tags && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {col.metadata.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-medium bg-black/30 px-2 py-0.5 rounded text-purple-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-300" />
                <span>{col.duration}</span>
                <span>•</span>
                <span>{col.itemCount} Modules</span>
              </div>

              <Link
                href={`/collections/${col.id}`}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-purple-950 font-semibold transition-all flex items-center gap-1"
              >
                <span>Curriculum</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
