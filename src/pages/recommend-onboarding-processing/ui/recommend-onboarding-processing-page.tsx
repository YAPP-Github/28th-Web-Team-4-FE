import { Suspense, type JSX } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import { getQueryClient } from '@/shared/lib/query-client';
import { Placeholder } from '@/shared/ui/placeholder';

import { RecommendOnboardingProcessingClient } from './recommend-onboarding-processing-client';

type RecommendOnboardingProcessingPageProps = {
  params: Promise<{
    onboardingId: string;
  }>;
};

export async function RecommendOnboardingProcessingPage({
  params,
}: RecommendOnboardingProcessingPageProps): Promise<JSX.Element> {
  const { onboardingId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    getRecommendationsOptions({
      query: { onboardingId },
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RecommendOnboardingProcessingFallback />}>
        <RecommendOnboardingProcessingClient onboardingId={onboardingId} />
      </Suspense>
    </HydrationBoundary>
  );
}

function RecommendOnboardingProcessingFallback(): JSX.Element {
  return (
    <main className="bg-surface-background-default px-016 py-040 flex min-h-0 flex-1 items-center justify-center">
      <Placeholder
        title="추천 채널을 찾고 있어요"
        subtitle="입력한 온보딩을 바탕으로 채널을 조회하고 있습니다"
      />
    </main>
  );
}
