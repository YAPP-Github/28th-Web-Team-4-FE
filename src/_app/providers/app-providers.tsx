'use client';

import type { ReactNode } from 'react';

import { GoogleAnalyticsProvider } from './google-analytics-provider';
import QueryProvider from './query-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <GoogleAnalyticsProvider />
    </QueryProvider>
  );
}
