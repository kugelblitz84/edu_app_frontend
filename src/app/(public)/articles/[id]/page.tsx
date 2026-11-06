'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import Link from 'next/link';
import { ARTICLES_DATA } from '@/data';
import { ArrowLeft, Clock, ThumbsUp, Share2, Check } from 'lucide-react';
import { formatDate } from '@/lib/utils/formatting';

function ArticleReaderContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const article = useMemo(() => {
    return ARTICLES_DATA.find((a) => a.id === id) || ARTICLES_DATA[0];
  }, [id]);

  const [likes, setLikes] = useState(article.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((l) => l + 1);
      setHasLiked(true);
    } else {
      setLikes((l) => l - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#6219BD] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Articles Feed</span>
        </Link>
      </div>

      {/* Article Container */}
      <article className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-12 border border-purple-100 shadow-xl space-y-8">
        {/* Header */}
        <div className="space-y-4 border-b border-zinc-100 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full">
              {article.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-serif">
            {article.excerpt}
          </p>

          {/* Author Byline */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
                {article.author.name[0]}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-zinc-900">{article.author.name}</p>
                <p className="text-[11px] text-zinc-400">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                  hasLiked
                    ? 'bg-purple-50 text-[#6219BD] border-purple-300'
                    : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-xs text-zinc-600 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 cursor-pointer"
                title="Share article"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-zinc max-w-none text-zinc-800 text-sm sm:text-base leading-relaxed space-y-4">
          <div className="whitespace-pre-line font-sans text-sm sm:text-[15px] leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Tags footer */}
        <div className="pt-6 border-t border-zinc-100 flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400">Indexed Tags:</span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium bg-purple-50 text-purple-800 px-3 py-1 rounded-lg"
            >
              #{tag}
            </span>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function ArticleReaderPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading article...</div>}>
      <ArticleReaderContent params={params} />
    </Suspense>
  );
}
