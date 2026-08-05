import type { ReactNode } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { SessionPageHeader } from '@/app/layouts/session-page-header';
import { getQueryClient } from '@/app/providers/query-client';
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
  const queryClient = getQueryClient();
  queryClient.setQueryData(authSessionQueryKey, sessionState);

  return (
    <div className="flex h-dvh min-h-0 flex-none flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SessionPageHeader />
      </HydrationBoundary>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
