'use client';

import { Suspense, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useChannelComparisonResultQueryState } from '@/features/channel-comparison';

import { useChannelComparison } from '@/pages/compare/api/use-channel-comparison';
import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';

import { CompareResultChannelCards } from './compare-result-channel-cards';
import { CompareResultChannelCost } from './compare-result-channel-cost';
import { CompareResultChannelDetailsTable } from './compare-result-channel-details';
import { CompareResultChannelInsightsDqa } from './compare-result-channel-insights-dqa';
import { CompareResultChannelPerformance } from './compare-result-channel-performance';
import { CompareResultErrorState, CompareResultLoadingState } from './compare-result-query-states';
import { CompareResultSubHeader } from './compare-result-sub-header';

function CompareResultPageContent(): JSX.Element | null {
  const { channelIds, onboardingId, isValid } = useChannelComparisonResultQueryState();

  if (!isValid) {
    return null;
  }

  return <CompareResultWithQuery channelIds={channelIds} onboardingId={onboardingId} />;
}

type CompareResultWithQueryProps = {
  channelIds: readonly string[];
  onboardingId: string | null;
};

function CompareResultWithQuery({
  channelIds,
  onboardingId,
}: CompareResultWithQueryProps): JSX.Element {
  const router = useRouter();
  const { isPending, isError, refetch } = useChannelComparison({
    channelIds,
    onboardingId,
  });

  if (isPending) {
    return <CompareResultLoadingState />;
  }

  if (isError) {
    return (
      <CompareResultErrorState
        onRetry={() => void refetch()}
        onReselectChannels={() => router.push('/compare')}
      />
    );
  }

  return (
    <>
      <CompareResultSubHeader />
      <main className="bg-surface-low px-016 sm:px-032 flex min-h-0 flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="gap-020 py-040 flex w-full max-w-[792px] flex-col">
          <CompareResultChannelCards channels={MOCK_COMPARE_RESULT_CHANNELS} />
          <CompareResultChannelPerformance channels={MOCK_COMPARE_RESULT_CHANNELS} />
          <CompareResultChannelDetailsTable channels={MOCK_COMPARE_RESULT_CHANNELS} />
          <CompareResultChannelCost channels={MOCK_COMPARE_RESULT_CHANNELS} />
          <CompareResultChannelInsightsDqa channels={MOCK_COMPARE_RESULT_CHANNELS} />
        </Box>
      </main>
    </>
  );
}

export function CompareResultPage(): JSX.Element {
  return (
    <Suspense>
      <CompareResultPageContent />
    </Suspense>
  );
}
