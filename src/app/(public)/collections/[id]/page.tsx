'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import Link from 'next/link';
import { FEATURED_COLLECTIONS } from '@/data';
import { CollectionCurriculumItem } from '@/types';
import { VideoPlayer, PdfViewer, CurriculumSidebar } from '@/components/materials';
import { AccessPolicyBadge } from '@/components/common';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

function CollectionCurriculumContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const collection = useMemo(() => {
    return FEATURED_COLLECTIONS.find((c) => c.id === id) || FEATURED_COLLECTIONS[0];
  }, [id]);

  const curriculumItems = useMemo(() => {
    return collection.items || [];
  }, [collection]);

  const [activeItem, setActiveItem] = useState<CollectionCurriculumItem>(
    curriculumItems[0] || {
      id: 'default',
      resourceId: 'res-default',
      title: 'Course Introduction & Syllabus Overview',
      type: 'VIDEO',
      duration: '15:00',
      position: 1
    }
  );

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Course Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/collections"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#6219BD] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Collections</span>
        </Link>

        <div className="flex items-center gap-2">
          <AccessPolicyBadge
            policy={collection.accessPolicy}
            priceAmountMinor={collection.priceAmountMinor}
            currency={collection.currency}
            variant="light"
          />
          {collection.institution && (
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
              {collection.institution.name}
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Left Curriculum Tree (1 col) + Right Player Stage (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Col: Curriculum Sidebar */}
        <div className="lg:col-span-1 h-[680px]">
          <CurriculumSidebar
            items={curriculumItems}
            activeItemId={activeItem.id}
            onSelectItem={setActiveItem}
            collectionTitle={collection.title}
          />
        </div>

        {/* Right 2 Cols: Active Lesson Stage */}
        <div className="lg:col-span-2 space-y-4">
          {activeItem.type === 'VIDEO' ? (
            <VideoPlayer
              title={activeItem.title}
              duration={activeItem.duration || '25:00'}
              author={collection.metadata.author}
            />
          ) : (
            <PdfViewer
              title={activeItem.title}
              pages={activeItem.pages || '32 pages'}
              author={collection.metadata.author}
            />
          )}

          {/* Active Lesson Meta & Course Overview */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-zinc-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                  Module {activeItem.position} of {curriculumItems.length}
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">{activeItem.title}</h2>
              </div>

              <button
                onClick={() => {
                  setActiveItem((prev) => ({
                    ...prev,
                    isCompleted: !prev.isCompleted
                  }));
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeItem.isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeItem.isCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                About this Course Collection
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {collection.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-zinc-100 text-xs text-zinc-500">
              <span>Lead Lecturer: <strong className="text-zinc-800">{collection.metadata.author}</strong></span>
              <span>Total Curriculum: <strong className="text-zinc-800">{collection.duration}</strong></span>
              <span>Total Modules: <strong className="text-zinc-800">{collection.itemCount} items</strong></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CollectionCurriculumPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading course curriculum...</div>}>
      <CollectionCurriculumContent params={params} />
    </Suspense>
  );
}
