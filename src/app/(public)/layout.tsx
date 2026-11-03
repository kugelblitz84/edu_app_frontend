'use client';

import React from 'react';
import { Navbar, Footer } from '@/components/common';
import { PublicSearchProvider, usePublicSearch } from '@/hooks';

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
    <PublicSearchProvider>
      <div className="wb-page-root">
        <div className="wb-container">
          <PublicHeader />
          <main className="space-y-4 2xl:space-y-6 flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </PublicSearchProvider>
  );
}
