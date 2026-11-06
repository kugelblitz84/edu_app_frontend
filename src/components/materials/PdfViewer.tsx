'use client';

import React, { useState } from 'react';
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  BookOpen,
  Share2,
  Check
} from 'lucide-react';

interface PdfViewerProps {
  title: string;
  pages?: string;
  author?: string;
  pdfUrl?: string;
}

export function PdfViewer({
  title,
  pages = '142 pages',
  author = 'WitBase Faculty',
  pdfUrl
}: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [copied, setCopied] = useState(false);

  const totalPagesCount = parseInt(pages) || 45;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-xl flex flex-col h-[650px] w-full">
      {/* Top Toolbar */}
      <div className="bg-[#181722] text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              {title}
            </h4>
            <p className="text-[11px] text-zinc-400">Author: {author}</p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Page controls */}
          <div className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-xs">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1 hover:bg-white/20 rounded disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono px-1">
              {currentPage} / {totalPagesCount}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPagesCount, p + 1))}
              disabled={currentPage >= totalPagesCount}
              className="p-1 hover:bg-white/20 rounded disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-white/10 px-2 py-1 rounded-lg text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(70, z - 10))}
              className="p-1 hover:bg-white/20 rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
              className="p-1 hover:bg-white/20 rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="p-1.5 hover:bg-white/10 rounded-lg cursor-pointer text-zinc-300 hover:text-white"
            title="Share material link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <a
            href={pdfUrl || '#download'}
            download
            onClick={(e) => {
              if (!pdfUrl) {
                e.preventDefault();
                alert('Demo: PDF download link successfully resolved with signed storage token.');
              }
            }}
            className="bg-[#673DE6] hover:bg-[#5B21B6] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>
        </div>
      </div>

      {/* Reading Canvas Area */}
      <div className="flex-1 bg-[#F4F3F8] overflow-auto p-4 sm:p-8 flex justify-center items-start">
        <div
          style={{ width: `${zoomLevel}%`, maxWidth: '850px' }}
          className="bg-white rounded-xl shadow-md border border-zinc-200/80 p-8 sm:p-14 space-y-6 text-zinc-800 transition-all duration-200 min-h-[500px]"
        >
          {/* Header of Simulated Page */}
          <div className="border-b border-zinc-200 pb-4 flex justify-between items-center text-xs text-zinc-400 font-mono">
            <span>WITBASE ACADEMIC ARCHIVE • REF: WB-DOC-{currentPage.toString().padStart(3, '0')}</span>
            <span>Page {currentPage} of {totalPagesCount}</span>
          </div>

          {/* Document Content Simulation */}
          <div className="space-y-4">
            <span className="inline-block text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
              Chapter {Math.ceil(currentPage / 5)}: Core Theorems &amp; Derivations
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-zinc-600 leading-relaxed">
              This document contains comprehensive notes, formal proofs, step-by-step mathematical calculations, and practical diagrams authored by {author}. The formulations presented below serve as the official curriculum reference.
            </p>

            <div className="bg-purple-50/50 border-l-4 border-[#6219BD] p-4 rounded-r-lg space-y-2">
              <h5 className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                Definition {currentPage}.1 (Fundamental Equations &amp; Properties)
              </h5>
              <p className="text-xs text-purple-950 font-serif leading-relaxed italic">
                &ldquo;Let S be a continuous state manifold where potential and kinetic gradients satisfy the conservative energy principle: &Delta;E = &nabla;H(p, q) - &Phi;(t). All bounded trajectories remain stable under conservative perturbation.&rdquo;
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase">Property &Alpha;</span>
                <p className="text-xs text-zinc-800 font-medium">Uniform Convergence Guarantee</p>
                <p className="text-[11px] text-zinc-500">Verified through numerical simulation across 10,000 runs.</p>
              </div>
              <div className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/50 space-y-1">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase">Property &Beta;</span>
                <p className="text-xs text-zinc-800 font-medium">Optimistic Version Synchronization</p>
                <p className="text-[11px] text-zinc-500">Zero-loss reconciliation for concurrent client writes.</p>
              </div>
            </div>

            <p className="text-sm text-zinc-600 leading-relaxed">
              For complete derivations and homework problem sets, refer to the accompanying exercise syllabus or join the discussion forum on the WitBase platform.
            </p>
          </div>

          {/* Footer of Simulated Page */}
          <div className="border-t border-zinc-200 pt-4 flex justify-between items-center text-xs text-zinc-400">
            <span>&copy; WitBase Certified Publication</span>
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Verified Reader Canvas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

