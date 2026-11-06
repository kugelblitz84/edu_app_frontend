'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import Link from 'next/link';
import {
  FEATURED_VIDEOS,
  FEATURED_BOOKS,
  USER_PUBLISHED_ITEMS
} from '@/data';
import { VideoItem, BookItem } from '@/types';
import { AccessPolicyBadge } from '@/components/common';
import { VideoPlayer, PdfViewer, PinUnlockDialog } from '@/components/materials';
import {
  Lock,
  KeyRound,
  ArrowLeft,
  Tag
} from 'lucide-react';

function ResourceViewerContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  // Find resource from all mock datasets
  const resource = useMemo(() => {
    const all = [...FEATURED_VIDEOS, ...FEATURED_BOOKS, ...USER_PUBLISHED_ITEMS];
    return all.find((r) => r.id === id);
  }, [id]);

  // PIN Unlock State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);

  if (!resource) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-zinc-900">Resource Not Found</h2>
        <p className="text-xs text-zinc-500">The study material requested does not exist or has been archived.</p>
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#6219BD] text-white text-xs font-semibold rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Resources Catalog</span>
        </Link>
      </div>
    );
  }

  const isVideo = resource.type === 'VIDEO';
  const requiresPin = resource.hasPin && !isUnlocked;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#6219BD] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Resources</span>
        </Link>

        <div className="flex items-center gap-2">
          <AccessPolicyBadge
            policy={resource.accessPolicy}
            priceAmountMinor={resource.priceAmountMinor}
            currency={resource.currency}
            variant="light"
          />
          {resource.institution && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {resource.institution.name}
            </span>
          )}
        </div>
      </div>

      {/* Main Content Viewer or Locked State */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Media Viewer or Locked Gate */}
        <div className="lg:col-span-2 space-y-4">
          {requiresPin ? (
            <div className="rounded-2xl bg-gradient-to-br from-[#181722] via-[#221B33] to-[#181722] text-white p-8 sm:p-12 border border-white/10 shadow-2xl text-center space-y-5 aspect-video flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
                <Lock className="w-8 h-8" />
              </div>

              <div className="max-w-md space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  Content Locked by Author
                </h3>
                <p className="text-xs text-zinc-300/80 leading-relaxed">
                  This {isVideo ? 'video lecture' : 'handbook'} requires a 4-digit verification PIN to unlock. If you have enrolled or purchased access, enter your PIN below.
                </p>
                <p className="text-[11px] font-mono text-purple-300">
                  (Demo Hint: Use PIN <strong>1234</strong>)
                </p>
              </div>

              <button
                onClick={() => setShowPinModal(true)}
                className="px-6 py-2.5 rounded-xl bg-[#673DE6] hover:bg-[#5B21B6] text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/40 cursor-pointer transition-all active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>Enter PIN to Decrypt</span>
              </button>
            </div>
          ) : isVideo ? (
            <VideoPlayer
              title={resource.title}
              duration={(resource as VideoItem).duration}
              author={resource.metadata?.author}
            />
          ) : (
            <PdfViewer
              title={resource.title}
              pages={(resource as BookItem).pages}
              author={resource.metadata?.author}
            />
          )}

          {/* Description & Overview */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-zinc-900">{resource.title}</h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {resource.description || 'Comprehensive study resource curated on WitBase.'}
            </p>

            {resource.metadata?.tags && resource.metadata.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-100">
                <span className="text-xs text-zinc-400 flex items-center gap-1 mr-1">
                  <Tag className="w-3.5 h-3.5" />
                  Tags:
                </span>
                {resource.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Metadata & Author Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-sm space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Material Details
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-zinc-500">Format</span>
                <span className="font-semibold text-zinc-800">
                  {isVideo ? 'Streaming MP4 / HLS' : 'Portable Document (PDF)'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-zinc-500">Duration / Length</span>
                <span className="font-semibold text-zinc-800 font-mono">
                  {isVideo ? (resource as VideoItem).duration : (resource as BookItem).pages}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-zinc-500">Author / Faculty</span>
                <span className="font-semibold text-purple-700">
                  {resource.metadata?.author || 'WitBase Instructor'}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-zinc-500">Access Mode</span>
                <span className="font-semibold text-zinc-800">{resource.accessPolicy}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">API Entity Version</span>
                <span className="font-mono text-zinc-400">v{resource.version} (Optimistic Locked)</span>
              </div>
            </div>
          </div>

          {/* Quick Related Collections Shortcut */}
          <div className="bg-[#181722] text-white rounded-2xl p-5 border border-white/10 shadow-sm space-y-3">
            <span className="text-[10px] uppercase font-bold text-purple-300">
              Part of a Curriculum?
            </span>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Explore our structured multi-module course collections for complete certification tracks.
            </p>
            <Link
              href="/collections"
              className="inline-block w-full text-center py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </div>

      {/* PIN Unlock Modal */}
      <PinUnlockDialog
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => setIsUnlocked(true)}
        resourceTitle={resource.title}
        expectedPin="1234"
      />
    </div>
  );
}

export default function ResourceViewerPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading study material...</div>}>
      <ResourceViewerContent params={params} />
    </Suspense>
  );
}
