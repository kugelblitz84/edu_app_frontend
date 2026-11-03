'use client';

import React, { createContext, useContext, useState } from 'react';

export interface PublicSearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  accessFilter: string;
  setAccessFilter: (filter: string) => void;
}

const PublicSearchContext = createContext<PublicSearchContextType>({
  searchQuery: '',
  setSearchQuery: () => {},
  accessFilter: 'ALL',
  setAccessFilter: () => {}
});

export function PublicSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [accessFilter, setAccessFilter] = useState('ALL');

  return (
    <PublicSearchContext.Provider
      value={{ searchQuery, setSearchQuery, accessFilter, setAccessFilter }}
    >
      {children}
    </PublicSearchContext.Provider>
  );
}

export function usePublicSearch() {
  return useContext(PublicSearchContext);
}
