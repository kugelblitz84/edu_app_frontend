'use client';

import React from 'react';
import { Layers, Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="wb-footer">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 2xl:gap-10 pb-8 border-b border-white/10">
        {/* Brand & Description (Col 1-2 on desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <span className="wb-header-logo-text">
              Wit<span className="text-purple-300">Base</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] 2xl:text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              v1.0
            </span>
          </div>
          <p className="text-xs 2xl:text-sm text-zinc-300/80 leading-relaxed max-w-sm">
            Everything Learnable, in one place. Curated course collections, video masterclasses, verified university notes, and certification tracks.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Educational Platform &amp; API</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="wb-footer-heading">Explore</h4>
          <ul className="space-y-2">
            <li>
              <a href="#courses" className="wb-footer-link">Featured Courses</a>
            </li>
            <li>
              <a href="#videos" className="wb-footer-link">Video Lectures</a>
            </li>
            <li>
              <a href="#books" className="wb-footer-link">Handbooks &amp; Notes</a>
            </li>
            <li>
              <a href="#exams" className="wb-footer-link">Upcoming Exams</a>
            </li>
          </ul>
        </div>

        {/* Institutions Links */}
        <div>
          <h4 className="wb-footer-heading">Institutions</h4>
          <ul className="space-y-2">
            <li>
              <a href="#institutions" className="wb-footer-link">Void Pavilion</a>
            </li>
            <li>
              <a href="#institutions" className="wb-footer-link">Daffodil Intl. University</a>
            </li>
            <li>
              <a href="#institutions" className="wb-footer-link">Stamford University</a>
            </li>
            <li>
              <a href="#institutions" className="wb-footer-link">IST University</a>
            </li>
          </ul>
        </div>

        {/* Developers & Platform Links */}
        <div>
          <h4 className="wb-footer-heading">Developers</h4>
          <ul className="space-y-2">
            <li>
              <a href="#api" className="wb-footer-link">Resources API Docs</a>
            </li>
            <li>
              <a href="#endpoints" className="wb-footer-link">REST Endpoints</a>
            </li>
            <li>
              <a href="#privacy" className="wb-footer-link">Privacy Policy</a>
            </li>
            <li>
              <a href="#terms" className="wb-footer-link">Terms of Service</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs 2xl:text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>&copy; 2026 WitBase Education Inc. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            API Online (200 OK)
          </span>
        </div>
      </div>
    </footer>
  );
}
