'use client';

import type { ReactNode } from 'react';

import { AuthSessionManager } from '@/features/auth/session';

import { GoogleAnalyticsProvider } from './google-analytics-provider';
import QueryProvider from './query-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthSessionManager />
      {children}
      <GoogleAnalyticsProvider />
    </QueryProvider>
  );
}
