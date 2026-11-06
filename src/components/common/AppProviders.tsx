'use client';

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import { PublicSearchProvider } from '@/hooks/usePublicSearch';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <PublicSearchProvider>
        {children}
      </PublicSearchProvider>
    </AuthProvider>
  );
}

