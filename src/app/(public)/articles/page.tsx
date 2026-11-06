'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ARTICLES_DATA } from '@/data';
import { Sparkles, Search, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatting';

export default function ArticlesFeedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = useMemo(() => {
    const set = new Set(ARTICLES_DATA.map((a) => a.category));
    return ['ALL', ...Array.from(set)];
  }, []);

  const filteredArticles = useMemo(() => {
    return ARTICLES_DATA.filter((art) => {
      const matchesCategory =
        selectedCategory === 'ALL' || art.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#171622] via-[#241A3A] to-[#141418] text-white p-6 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Academic Research &amp; Engineering Essays</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Articles &amp; Editorial Feed
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed">
            Peer-reviewed perspectives on distributed computing, cryptographic verifiable credentials, and modern educational technology.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#6219BD] text-white shadow-xs'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'
              }`}
            >
              {cat === 'ALL' ? 'All Topics' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="bg-white rounded-2xl p-6 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {article.category}
                </span>
                <span className="text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#6219BD] transition-colors leading-snug line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs text-zinc-500 leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {article.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Author Row */}
            <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-[10px] font-bold">
                  {article.author.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-zinc-800">{article.author.name}</p>
                  <p className="text-[10px] text-zinc-400">{formatDate(article.publishedAt)}</p>
                </div>
              </div>

              <span className="text-[#6219BD] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                <span>Read</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
