'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, Sparkles, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="wb-footer">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 2xl:gap-10 pb-8 border-b border-white/10">
        {/* Brand & Description (Col 1-2 on desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="wb-header-logo-text">
              Wit<span className="text-purple-300">Base</span>
            </Link>
            <span className="inline-flex items-center gap-1 text-[10px] 2xl:text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              v1.0 Live
            </span>
          </div>
          <p className="text-xs 2xl:text-sm text-zinc-300/80 leading-relaxed max-w-sm">
            Everything Learnable, in one place. Curated course collections, video masterclasses, verified university notes, and real-time proctored exams.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Verified Educational Platform &amp; API Protocol</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="wb-footer-heading">Explore</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/collections" className="wb-footer-link">Featured Courses</Link>
            </li>
            <li>
              <Link href="/resources?type=VIDEO" className="wb-footer-link">Video Lectures</Link>
            </li>
            <li>
              <Link href="/resources?type=PDF" className="wb-footer-link">Handbooks &amp; Notes</Link>
            </li>
            <li>
              <Link href="/exams" className="wb-footer-link">Upcoming Exams</Link>
            </li>
          </ul>
        </div>

        {/* Institutions Links */}
        <div>
          <h4 className="wb-footer-heading">Institutions</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/institutions/inst-void" className="wb-footer-link">Void Pavilion</Link>
            </li>
            <li>
              <Link href="/institutions/inst-diu" className="wb-footer-link">Daffodil Intl. University</Link>
            </li>
            <li>
              <Link href="/institutions/inst-stamford" className="wb-footer-link">Stamford University</Link>
            </li>
            <li>
              <Link href="/institutions/inst-ist" className="wb-footer-link">IST University</Link>
            </li>
          </ul>
        </div>

        {/* Platform & Community */}
        <div>
          <h4 className="wb-footer-heading">Platform</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/articles" className="wb-footer-link">Research &amp; Articles</Link>
            </li>
            <li>
              <Link href="/studio/new-resource" className="wb-footer-link">Creator Studio</Link>
            </li>
            <li>
              <Link href="/me/library" className="wb-footer-link">Student Library</Link>
            </li>
            <li>
              <Link href="/me/exams" className="wb-footer-link">My Exam History</Link>
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
