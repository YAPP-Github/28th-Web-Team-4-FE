'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from 'overlay-kit';

import { GoogleAnalyticsProvider } from './google-analytics-provider';
import QueryProvider from './query-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <OverlayProvider>
        {children}
        <GoogleAnalyticsProvider />
      </OverlayProvider>
    </QueryProvider>
  );
}
