import { Suspense, type JSX } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';
import { getQueryClient } from '@/shared/lib/query-client';
import { Placeholder } from '@/shared/ui/placeholder';

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

function RecommendResultLoadingFallback(): JSX.Element {
  return (
    <main className="bg-surface-background-default px-016 py-040 flex min-h-0 flex-1 items-center justify-center">
      <Placeholder
        title="추천 채널을 불러오고 있어요"
        subtitle="입력한 온보딩을 바탕으로 결과를 준비하고 있습니다"
      />
    </main>
  );
}
