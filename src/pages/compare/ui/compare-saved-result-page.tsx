'use client';

import type { JSX } from 'react';

import { useSavedChannelComparison } from '@/pages/compare/api/use-saved-channel-comparison';
import { mapChannelComparisonItemsToChannels } from '@/pages/compare/model/channel-comparison-adapter';
import { Box } from '@/shared/ui/layout/box';
import { Placeholder } from '@/shared/ui/placeholder';

import { CompareResultChannelCards } from './compare-result-channel-cards';
import { CompareResultChannelCost } from './compare-result-channel-cost';
import { CompareResultChannelDetailsTable } from './compare-result-channel-details';
import { CompareResultChannelInsightsDqa } from './compare-result-channel-insights-dqa';
import { CompareResultChannelPerformance } from './compare-result-channel-performance';
import { CompareResultSubHeader } from './compare-result-sub-header';

function SavedComparisonState({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}): JSX.Element {
  return (
    <main className="bg-surface-background-default px-016 py-040 flex min-h-0 flex-1 items-center justify-center">
      <Placeholder title={title} subtitle={subtitle} />
    </main>
  );
}

/** 마이페이지에서 진입한 저장된 채널 비교 상세 화면. */
export function CompareSavedResultPage({ comparisonId }: { comparisonId: string }): JSX.Element {
  const comparisonQuery = useSavedChannelComparison(comparisonId);

  if (comparisonQuery.isPending) {
    return (
      <SavedComparisonState
        title="비교 결과를 불러오고 있어요"
        subtitle="저장된 결과를 준비하고 있습니다"
      />
    );
  }

  if (comparisonQuery.isError) {
    return (
      <SavedComparisonState
        title="비교 결과를 불러오지 못했어요"
        subtitle="잠시 후 다시 시도해 주세요"
      />
    );
  }

  const channels = mapChannelComparisonItemsToChannels(comparisonQuery.data.data.items);

  return (
    <main className="bg-surface-low flex min-h-0 flex-1 flex-col overflow-hidden">
      <CompareResultSubHeader title="저장된 채널 비교 결과예요" action={null} />
      <Box className="px-016 sm:px-032 flex min-h-0 w-full flex-1 justify-center overflow-y-auto overscroll-y-contain lg:px-120">
        <Box className="gap-020 pt-040 pb-072 flex w-full max-w-[792px] flex-col self-start">
          <CompareResultChannelCards
            channels={channels}
            readOnly
            removeDisabled
            onRemoveChannel={() => undefined}
          />
          <CompareResultChannelPerformance channels={channels} />
          <CompareResultChannelDetailsTable channels={channels} />
          <CompareResultChannelCost channels={channels} />
          <CompareResultChannelInsightsDqa channels={channels} />
        </Box>
      </Box>
    </main>
  );
}
