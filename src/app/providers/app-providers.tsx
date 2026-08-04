'use client';

import type { ReactNode } from 'react';
import { OverlayProvider } from 'overlay-kit';

import { ToastProvider } from '@/shared/ui/toast';

import { AuthSessionManager } from '@/features/auth/session';

import { GoogleAnalyticsProvider } from './google-analytics-provider';
import QueryProvider from './query-provider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthSessionManager />
      <OverlayProvider>
        <ToastProvider>
          {children}
          <GoogleAnalyticsProvider />
        </ToastProvider>
      </OverlayProvider>
    </QueryProvider>
  );
}
