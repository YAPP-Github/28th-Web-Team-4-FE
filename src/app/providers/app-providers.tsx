'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from 'overlay-kit';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { ToastProvider } from '@/shared/ui/toast';

import { GoogleAnalyticsProvider } from './google-analytics-provider';
import QueryProvider from './query-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <QueryProvider>
        <OverlayProvider>
          <ToastProvider>
            {children}
            <GoogleAnalyticsProvider />
          </ToastProvider>
        </OverlayProvider>
      </QueryProvider>
    </NuqsAdapter>
  );
}
