'use client';

import { Suspense, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthSession } from '@/features/auth/session';
import { useChannelComparisonResultQueryState } from '@/features/channel-comparison';

import { useChannelComparison } from '@/pages/compare/api/use-channel-comparison';
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
  const { data: authSession } = useAuthSession();
  const comparisonQuery = useChannelComparison({
    channelIds,
    onboardingId,
  });

  if (comparisonQuery.isPending) {
    return <CompareResultLoadingState />;
  }

  if (comparisonQuery.isError) {
    return (
      <CompareResultErrorState
        onRetry={() => void comparisonQuery.refetch()}
        onReselectChannels={() => router.push('/compare')}
      />
    );
  }

  return (
    <>
      <CompareResultSubHeader isGuest={authSession?.authenticated === false} />
      <main className="bg-surface-low px-016 sm:px-032 flex min-h-0 flex-1 justify-center overflow-y-auto lg:px-120">
        <Box className="gap-020 py-040 flex w-full max-w-[792px] flex-col">
          <CompareResultChannelCards channels={comparisonQuery.data} />
          <CompareResultChannelPerformance channels={comparisonQuery.data} />
          <CompareResultChannelDetailsTable channels={comparisonQuery.data} />
          <CompareResultChannelCost channels={comparisonQuery.data} />
          <CompareResultChannelInsightsDqa channels={comparisonQuery.data} />
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
