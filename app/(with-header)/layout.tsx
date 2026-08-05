import type { ReactNode } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import { SessionPageHeader } from '@/app/layouts/session-page-header';
import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import { readAuthSession } from '@/shared/lib/auth/session-cookie';

export default async function WithHeaderLayout({ children }: { children: ReactNode }) {
  const session = await readAuthSession();
  const sessionState =
    session && session.refreshTokenExpiresAt > Date.now()
      ? {
          authenticated: true as const,
          accessTokenExpiresAt: session.accessTokenExpiresAt,
        }
      : { authenticated: false as const };
  const queryClient = new QueryClient();
  queryClient.setQueryData(authSessionQueryKey, sessionState);

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionPageHeader />
      </HydrationBoundary>
      {children}
    </>
  );
}
