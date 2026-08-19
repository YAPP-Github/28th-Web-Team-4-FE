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
import { CompareResultSaveButton } from './compare-result-save-button';
import { CompareResultSubHeader } from './compare-result-sub-header';

function CompareResultPageContent(): JSX.Element | null {
  const { channelIds, onboardingId, isValid, setChannelIds } =
    useChannelComparisonResultQueryState();

  if (!isValid) {
    return null;
  }

  return (
    <CompareResultWithQuery
      channelIds={channelIds}
      onboardingId={onboardingId}
      setChannelIds={setChannelIds}
    />
  );
}

type CompareResultWithQueryProps = {
  channelIds: readonly string[];
  onboardingId: string | null;
  setChannelIds: (channelIds: readonly string[]) => Promise<URLSearchParams>;
};

function CompareResultWithQuery({
  channelIds,
  onboardingId,
  setChannelIds,
}: CompareResultWithQueryProps): JSX.Element {
  const router = useRouter();
  const { data: authSession } = useAuthSession();
  const comparisonQuery = useChannelComparison({
    channelIds,
    onboardingId,
  });

  const removeChannel = (channelId: string) => {
    if (channelIds.length !== 3) {
      return;
    }

    void setChannelIds(channelIds.filter((id) => id !== channelId));
  };

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
      <CompareResultSubHeader
        action={
          <CompareResultSaveButton
            channelIds={channelIds}
            isGuest={authSession?.authenticated === false}
            onboardingId={onboardingId}
          />
        }
      />
      <main
        aria-busy={comparisonQuery.isPlaceholderData}
        className="bg-surface-low px-016 sm:px-032 flex min-h-0 flex-1 justify-center overflow-y-auto lg:px-120"
      >
        <Box className="gap-020 pt-040 pb-072 flex w-full max-w-[792px] flex-col self-start">
          {comparisonQuery.isPlaceholderData ? (
            <span role="status" className="sr-only">
              변경된 채널의 비교 결과를 불러오는 중이에요
            </span>
          ) : null}
          <CompareResultChannelCards
            channels={comparisonQuery.data}
            removeDisabled={comparisonQuery.isPlaceholderData}
            onRemoveChannel={removeChannel}
          />
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
