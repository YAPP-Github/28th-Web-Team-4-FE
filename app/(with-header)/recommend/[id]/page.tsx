import { Suspense, type JSX } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/app/providers/query-client';
import { RecommendResultWithRecommendations } from '@/pages/recommend-result';
import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { Placeholder } from '@/shared/ui/placeholder';

type RecommendResultRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RecommendResultRoute({
  params,
}: RecommendResultRouteProps): Promise<JSX.Element> {
  const { id } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    getRecommendationsOptions({
      query: { onboardingId: id },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecommendResultLoadingFallback />}>
        <RecommendResultWithRecommendations onboardingId={id} />
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
