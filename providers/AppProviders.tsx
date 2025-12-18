import React, { ReactNode } from 'react';
import { DatabaseProvider } from '@/database/DatabaseProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { AuthProvider } from '@/hooks/auth/AuthContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <DatabaseProvider>
        <AuthProvider>{children}</AuthProvider>
      </DatabaseProvider>
    </QueryProvider>
  );
}


