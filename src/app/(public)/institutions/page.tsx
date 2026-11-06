'use client';

import React, { useState, useMemo } from 'react';
import { TOP_INSTITUTIONS } from '@/data';
import { InstitutionCard } from '@/components/institutions';
import { Search, ShieldCheck } from 'lucide-react';

export default function InstitutionsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredInstitutions = useMemo(() => {
    return TOP_INSTITUTIONS.filter((inst) => {
      const matchesType =
        filterType === 'ALL' || inst.enrollmentType === filterType;
      const matchesSearch =
        !searchQuery.trim() ||
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.location?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [searchQuery, filterType]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#1D1B26] via-[#2A1E3C] to-[#141418] text-white p-6 sm:p-10 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Accredited Academic Campuses</span>
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Institutions &amp; Universities
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300/80 leading-relaxed">
            Discover premier universities, academies, and learning foundations providing verified course collections and departmental proctored exams.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-zinc-700">
            {filteredInstitutions.length} Partner Campuses
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[220px] flex-1 sm:flex-initial">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campus, location..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6219BD]/30"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 cursor-pointer focus:outline-none"
          >
            <option value="ALL">All Enrollment Models</option>
            <option value="FREE">Free Instant Enroll</option>
            <option value="PAID">Paid Tuition</option>
            <option value="APPLICATION">Application Required</option>
          </select>
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInstitutions.map((institution) => (
          <InstitutionCard key={institution.id} institution={institution} />
        ))}
      </div>
    </div>
  );
}
