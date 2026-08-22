import { Suspense, type JSX } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';
import { getQueryClient } from '@/shared/lib/query-client';

import { RecommendResultLoadingFallback } from './recommend-result-loading-fallback';
import { RecommendResultWithRecommendations } from './recommend-result-page';

type RecommendResultRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function RecommendResultRoute({
  params,
}: RecommendResultRouteProps): Promise<JSX.Element> {
  const [{ id }, isAuthenticated] = await Promise.all([params, hasActiveAuthSession()]);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    getRecommendationsOptions({
      query: { onboardingId: id },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecommendResultLoadingFallback />}>
        <RecommendResultWithRecommendations isGuest={!isAuthenticated} onboardingId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
