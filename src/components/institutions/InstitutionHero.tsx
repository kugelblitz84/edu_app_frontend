'use client';

import React from 'react';
import { InstitutionItem } from '@/types';
import { CheckCircle2, MapPin, Globe } from 'lucide-react';
import { EnrollmentButton } from './EnrollmentButton';

interface InstitutionHeroProps {
  institution: InstitutionItem;
}

export function InstitutionHero({ institution }: InstitutionHeroProps) {
  return (
    <div className="rounded-2xl sm:rounded-3xl bg-[#181722] text-white p-6 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background radial accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-600/30 text-purple-200 border border-purple-400/40 flex items-center justify-center font-bold font-mono text-xl sm:text-2xl shadow-xl shrink-0">
            {institution.badge}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
                {institution.name}
              </h1>
              {institution.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Campus
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
              {institution.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  {institution.location}
                </span>
              )}
              {institution.website && (
                <a
                  href={institution.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-purple-300 hover:text-purple-200 hover:underline"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {institution.website.replace('https://', '')}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Enrollment action button */}
        <div className="shrink-0">
          <EnrollmentButton institution={institution} />
        </div>
      </div>

      <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed max-w-3xl">
        {institution.description}
      </p>

      {/* Metrics Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Curated Courses</span>
          <span className="text-lg font-extrabold text-white font-mono">{institution.courses}</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Certification Exams</span>
          <span className="text-lg font-extrabold text-white font-mono">{institution.exams}</span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Enrolled Students</span>
          <span className="text-lg font-extrabold text-white font-mono">
            {institution.studentCount ? institution.studentCount.toLocaleString() : '12,500+'}
          </span>
        </div>
        <div className="bg-white/5 rounded-xl p-3">
          <span className="text-[10px] text-zinc-400 uppercase font-semibold block">Accreditation</span>
          <span className="text-lg font-extrabold text-purple-300 font-mono">Tier-1 Verified</span>
        </div>
      </div>
    </div>
  );
}
