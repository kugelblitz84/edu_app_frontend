'use client';

import React from 'react';
import Link from 'next/link';
import { useArticleEditorStore } from './store/useArticleEditorStore';
import {
  ArrowLeft,
  Check,
  Loader2,
  Monitor,
  Tablet,
  Smartphone,
  Eye,
  Edit3,
  Sliders,
  Send,
  CloudOff,
  RefreshCw,
  HardDrive,
} from 'lucide-react';

export const ArticleBuilderHeader: React.FC = () => {
  const {
    title,
    status,
    version,
    viewport,
    viewMode,
    isInspectorOpen,
    localStatus,
    serverStatus,
    serverError,
    isSubmitting,
    setViewport,
    setViewMode,
    toggleInspector,
    syncWithServer,
    submitForReview,
  } = useArticleEditorStore();

  const statusBadge = {
    DRAFT: 'bg-amber-50 text-amber-700 border-amber-200',
    PENDING_REVIEW: 'bg-blue-50 text-blue-700 border-blue-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    PUBLISHED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ARCHIVED: 'bg-zinc-100 text-zinc-600 border-zinc-200',
  }[status];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-zinc-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md">
      {/* Left: Navigation + Title + Separate Local & Server Persistence Statuses */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/me/library"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors shrink-0"
          title="Back to Studio Library"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="truncate text-xs sm:text-sm font-bold text-zinc-900">
              {title || 'Untitled Article'}
            </span>
            <span
              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shrink-0 ${statusBadge}`}
            >
              {status.replace('_', ' ')}
            </span>
          </div>

          {/* DUAL PERSISTENCE STATUS INDICATOR */}
          <div className="flex items-center gap-3 text-[11px] text-zinc-400">
            {/* 1. Local Storage Persistence */}
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-zinc-400" />
              {localStatus === 'saving' ? (
                <span className="text-zinc-500">Saving local...</span>
              ) : localStatus === 'saved' ? (
                <span className="text-zinc-600 font-medium">Local draft saved</span>
              ) : (
                <span className="text-red-500">Local save error</span>
              )}
            </span>

            <span>•</span>

            {/* 2. Server Cloud Persistence */}
            <div className="flex items-center gap-1.5">
              {serverStatus === 'saving' ? (
                <span className="flex items-center gap-1 text-purple-600 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Syncing cloud...</span>
                </span>
              ) : serverStatus === 'synced' ? (
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Check className="w-3 h-3" />
                  <span>Cloud synced · v{version}</span>
                </span>
              ) : serverStatus === 'error' ? (
                <div className="flex items-center gap-1.5 text-amber-600 font-medium">
                  <CloudOff className="w-3 h-3" />
                  <span title={serverError || 'Server offline'}>Cloud sync failed</span>
                  <button
                    type="button"
                    onClick={() => syncWithServer()}
                    title="Retry server sync"
                    className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[10px] bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 cursor-pointer"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>Retry</span>
                  </button>
                </div>
              ) : (
                <span className="text-zinc-400">Cloud ready</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center: Responsive Viewport Switcher */}
      <div className="hidden lg:flex items-center gap-1 rounded-xl bg-zinc-100 p-1 text-xs">
        <button
          type="button"
          onClick={() => setViewport('desktop')}
          title="Desktop layout (12-column grid)"
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
            viewport === 'desktop'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Desktop</span>
        </button>

        <button
          type="button"
          onClick={() => setViewport('tablet')}
          title="Tablet responsive preview"
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
            viewport === 'tablet'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Tablet className="w-3.5 h-3.5" />
          <span>Tablet</span>
        </button>

        <button
          type="button"
          onClick={() => setViewport('mobile')}
          title="Mobile responsive reflow view"
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-all cursor-pointer ${
            viewport === 'mobile'
              ? 'bg-white text-zinc-900 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Mobile Reflow</span>
        </button>
      </div>

      {/* Right: Actions (Preview mode, Settings inspector, Submit) */}
      <div className="flex items-center gap-2">
        {/* Edit / Preview Toggle */}
        <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50 p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold cursor-pointer transition-colors ${
              viewMode === 'edit'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Editor</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 font-semibold cursor-pointer transition-colors ${
              viewMode === 'preview'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </button>
        </div>

        {/* Toggle Inspector */}
        <button
          type="button"
          onClick={toggleInspector}
          title="Toggle Document Settings"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors cursor-pointer ${
            isInspectorOpen
              ? 'border-purple-300 bg-purple-50 text-[#6219BD]'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Submit for Review */}
        <button
          type="button"
          disabled={isSubmitting || status === 'PENDING_REVIEW'}
          onClick={submitForReview}
          className="flex items-center gap-1.5 rounded-xl bg-[#6219BD] px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20 hover:bg-[#5213a0] disabled:opacity-50 transition-all cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">
            {status === 'PENDING_REVIEW' ? 'Submitted' : 'Submit for Review'}
          </span>
        </button>
      </div>
    </header>
  );
};
