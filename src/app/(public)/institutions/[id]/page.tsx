'use client';

import React, { useState, useMemo, use, Suspense } from 'react';
import Link from 'next/link';
import {
  TOP_INSTITUTIONS,
  FEATURED_COLLECTIONS,
  FEATURED_VIDEOS,
  FEATURED_BOOKS,
  UPCOMING_EXAMS
} from '@/data';
import { InstitutionHero } from '@/components/institutions';
import { AccessPolicyBadge } from '@/components/common';
import {
  BookOpen,
  FileText,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Building
} from 'lucide-react';

function InstitutionProfileContent({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const institution = useMemo(() => {
    return TOP_INSTITUTIONS.find((i) => i.id === id) || TOP_INSTITUTIONS[0];
  }, [id]);

  const [activeTab, setActiveTab] = useState<'COURSES' | 'MATERIALS' | 'EXAMS' | 'ABOUT'>('COURSES');

  // Filter collections by institution
  const institutionCourses = useMemo(() => {
    return FEATURED_COLLECTIONS.filter(
      (c) => c.institution?.id === institution.id || !c.institution
    );
  }, [institution]);

  // Filter resources by institution
  const institutionResources = useMemo(() => {
    const all = [...FEATURED_VIDEOS, ...FEATURED_BOOKS];
    return all.filter((r) => r.institution?.id === institution.id);
  }, [institution]);

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#6219BD] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Institutions Directory</span>
        </Link>
      </div>

      {/* Hero Header */}
      <InstitutionHero institution={institution} />

      {/* Tabs Row */}
      <div className="border-b border-zinc-200 bg-white rounded-2xl px-4 pt-2 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('COURSES')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'COURSES'
              ? 'border-[#6219BD] text-[#6219BD]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Offered Courses ({institutionCourses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('MATERIALS')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'MATERIALS'
              ? 'border-[#6219BD] text-[#6219BD]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Study Materials ({institutionResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('EXAMS')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'EXAMS'
              ? 'border-[#6219BD] text-[#6219BD]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Departmental Exams</span>
        </button>

        <button
          onClick={() => setActiveTab('ABOUT')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ABOUT'
              ? 'border-[#6219BD] text-[#6219BD]'
              : 'border-transparent text-zinc-500 hover:text-zinc-800'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>About Campus &amp; Faculty</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'COURSES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutionCourses.map((col) => (
            <div
              key={col.id}
              className={`rounded-2xl p-5 bg-gradient-to-br ${col.accent} text-white shadow-md flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-purple-200">
                  {col.badgeText}
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-2">{col.title}</h3>
                <p className="text-xs text-zinc-300/80 line-clamp-2">{col.description}</p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span>{col.duration}</span>
                <Link
                  href={`/collections/${col.id}`}
                  className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-purple-950 font-semibold transition-all flex items-center gap-1"
                >
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'MATERIALS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {institutionResources.length > 0 ? (
            institutionResources.map((res) => (
              <Link
                key={res.id}
                href={`/resources/${res.id}`}
                className="bg-white rounded-2xl p-5 border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-700">
                      {res.type === 'VIDEO' ? 'Video Lecture' : 'PDF Document'}
                    </span>
                    <AccessPolicyBadge
                      policy={res.accessPolicy}
                      priceAmountMinor={res.priceAmountMinor}
                      currency={res.currency}
                      variant="light"
                    />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 line-clamp-2">{res.title}</h3>
                  <p className="text-xs text-zinc-500 line-clamp-2">{res.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400">
                  <span>Author: {res.metadata?.author || 'Faculty'}</span>
                  <span className="font-semibold text-[#6219BD] flex items-center gap-1">
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-zinc-200">
              <p className="text-xs text-zinc-500">No standalone materials published for this campus yet.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'EXAMS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UPCOMING_EXAMS.map((exam) => (
            <div
              key={exam.id}
              className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-700 px-2 py-0.5 rounded-full bg-purple-50">
                    {exam.category || 'Proctored Exam'}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500 font-mono">
                    {exam.timeRemaining}
                  </span>
                </div>
                <h3 className="text-base font-bold text-zinc-900">{exam.title}</h3>
                <p className="text-xs text-zinc-500">
                  Official semester examination. Proctored via WitBase Realtime Gateway.
                </p>
              </div>

              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">Duration: {exam.durationMinutes || 45} mins</span>
                <Link
                  href={`/exams/${exam.id}/live`}
                  className="px-4 py-2 rounded-xl bg-[#6219BD] hover:bg-[#5214A0] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Enter Arena</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'ABOUT' && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-zinc-900">About {institution.name}</h3>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {institution.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-purple-700">Accreditation</span>
              <p className="text-xs text-zinc-800 font-semibold">Tier-1 Ministry &amp; Board Approved</p>
              <p className="text-xs text-zinc-500">All certificates issued are cryptographically anchored.</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1.5">
              <span className="text-[11px] font-bold uppercase text-purple-700">Digital Library Policy</span>
              <p className="text-xs text-zinc-800 font-semibold">Open Access for Enrolled Students</p>
              <p className="text-xs text-zinc-500">Enrolled members receive automatic PIN bypass for study materials.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InstitutionProfilePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading campus profile...</div>}>
      <InstitutionProfileContent params={params} />
    </Suspense>
  );
}
