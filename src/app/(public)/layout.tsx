'use client';

import React, { Suspense } from 'react';
import { Navbar, Footer } from '@/components/common';
import { usePublicSearch } from '@/hooks';

function PublicHeader() {
  const { searchQuery, setSearchQuery, accessFilter, setAccessFilter } = usePublicSearch();

  return (
    <Navbar
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      accessFilter={accessFilter}
      onFilterChange={setAccessFilter}
    />
  );
}

export default function PublicLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="wb-page-root">
      <div className="wb-container">
        <Suspense fallback={<div className="h-14 rounded-2xl bg-[#E8E6F5] animate-pulse" />}>
          <PublicHeader />
        </Suspense>
        <main className="space-y-4 2xl:space-y-6 flex-1">
          <Suspense fallback={<div className="py-20 text-center text-xs text-zinc-400">Loading content...</div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
      </div>
    </div>
  );
}
