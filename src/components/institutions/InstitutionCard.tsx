'use client';

import React from 'react';
import Link from 'next/link';
import { InstitutionItem } from '@/types';
import { CheckCircle2, MapPin, ArrowRight } from 'lucide-react';

interface InstitutionCardProps {
  institution: InstitutionItem;
}

export function InstitutionCard({ institution }: InstitutionCardProps) {
  return (
    <div className="wb-institution-spotlight group hover:scale-[1.01] transition-all duration-300">
      <div className="space-y-4">
        {/* Header with Badge & Verified icon */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-400/30 flex items-center justify-center font-bold font-mono text-sm shadow-inner">
              {institution.badge}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  {institution.name}
                </h3>
                {institution.verified && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
              {institution.location && (
                <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-purple-400" />
                  <span>{institution.location}</span>
                </p>
              )}
            </div>
          </div>

          {institution.enrollmentType && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                institution.enrollmentType === 'FREE'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                  : institution.enrollmentType === 'PAID'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
              }`}
            >
              {institution.enrollmentType}
            </span>
          )}
        </div>

        <p className="text-xs text-zinc-300/80 leading-relaxed line-clamp-2">
          {institution.description}
        </p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="bg-white/5 rounded-lg py-1.5 px-2">
            <span className="text-[10px] text-zinc-400 uppercase block">Courses</span>
            <span className="text-xs font-bold text-white font-mono">{institution.courses}</span>
          </div>
          <div className="bg-white/5 rounded-lg py-1.5 px-2">
            <span className="text-[10px] text-zinc-400 uppercase block">Exams</span>
            <span className="text-xs font-bold text-white font-mono">{institution.exams}</span>
          </div>
          <div className="bg-white/5 rounded-lg py-1.5 px-2">
            <span className="text-[10px] text-zinc-400 uppercase block">Learners</span>
            <span className="text-xs font-bold text-white font-mono">
              {institution.studentCount ? `${(institution.studentCount / 1000).toFixed(1)}k` : '10k+'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-2">
        <Link
          href={`/institutions/${institution.id}`}
          className="w-full py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <span>Explore Institution Hub</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
