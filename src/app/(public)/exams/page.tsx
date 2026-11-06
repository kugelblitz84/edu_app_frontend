'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { UPCOMING_EXAMS } from '@/data';
import {
  GraduationCap,
  Clock,
  Sparkles,
  Search,
  Play
} from 'lucide-react';

export default function ExamsDirectoryPage() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'LIVE' | 'PRACTICE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = useMemo(() => {
    return UPCOMING_EXAMS.filter((exam) => {
      const isPractice = exam.timeRemaining.includes('Available Now');
      const matchesTab =
        activeTab === 'ALL' ||
        (activeTab === 'LIVE' && !isPractice) ||
        (activeTab === 'PRACTICE' && isPractice);

      const matchesSearch =
        !searchQuery.trim() ||
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.category?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#171424] via-[#2A183C] to-[#141418] text-white p-6 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Realtime Proctored Arena &amp; Practice Gym</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Exams &amp; Certification Gym
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed">
            Take timed proctored examinations with live WebSocket autosaving and instant disaster recovery, or hone your skills in self-paced practice mode.
          </p>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-xl">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ALL'
                ? 'bg-white text-[#6219BD] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            All Assessments ({UPCOMING_EXAMS.length})
          </button>
          <button
            onClick={() => setActiveTab('LIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'LIVE'
                ? 'bg-white text-[#6219BD] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Scheduled &amp; Live</span>
          </button>
          <button
            onClick={() => setActiveTab('PRACTICE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'PRACTICE'
                ? 'bg-white text-[#6219BD] shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-emerald-500" />
            <span>Practice Gym</span>
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exams..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
          />
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredExams.map((exam) => {
          const isPractice = exam.timeRemaining.includes('Available Now');
          return (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-6 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700">
                    {exam.category || 'General CS'}
                  </span>

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isPractice
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>{exam.timeRemaining}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 group-hover:text-[#6219BD] transition-colors leading-snug line-clamp-2">
                  {exam.title}
                </h3>

                <p className="text-xs text-zinc-500 leading-relaxed">
                  {isPractice
                    ? 'Self-paced simulation with instant answers and full score analysis.'
                    : 'Proctored live examination with zero-loss WebSocket syncing and anti-cheat validation.'}
                </p>

                {/* Exam Specs */}
                <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-xl bg-zinc-50 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block">Time</span>
                    <span className="font-bold text-zinc-800 font-mono">
                      {exam.durationMinutes || 45}m
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block">Marks</span>
                    <span className="font-bold text-zinc-800 font-mono">
                      {exam.totalMarks || 50}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase block">Type</span>
                    <span className="font-bold text-purple-700">
                      {exam.visibility}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-400">
                  {exam.questionCount ? `${exam.questionCount} Questions` : '5 Questions'}
                </span>

                <Link
                  href={`/exams/${exam.id}/live`}
                  className="px-4 py-2 rounded-xl bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{isPractice ? 'Practice Now' : 'Enter Arena'}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
