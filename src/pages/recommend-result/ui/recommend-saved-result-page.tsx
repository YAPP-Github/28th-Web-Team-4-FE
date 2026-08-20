'use client';

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { createChannelComparisonHref } from '@/features/channel-comparison';
import { useSavedRecommendation } from '@/pages/recommend-result/api/use-saved-recommendation';
import { mapRecommendationItemsToChannels } from '@/pages/recommend-result/model/recommended-channels';
import { Placeholder } from '@/shared/ui/placeholder';

import { RecommendResultPage } from './recommend-result-page';

function SavedRecommendationState({
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

/** 마이페이지에서 진입한 저장된 채널 추천 상세 화면. */
export function RecommendSavedResultPage({
  recommendationId,
}: {
  recommendationId: string;
}): JSX.Element {
  const router = useRouter();
  const recommendationQuery = useSavedRecommendation(recommendationId);

  if (recommendationQuery.isPending) {
    return (
      <SavedRecommendationState
        title="추천 결과를 불러오고 있어요"
        subtitle="저장된 결과를 준비하고 있습니다"
      />
    );
  }

  if (recommendationQuery.isError) {
    return (
      <SavedRecommendationState
        title="추천 결과를 불러오지 못했어요"
        subtitle="잠시 후 다시 시도해 주세요"
      />
    );
  }

  const recommendationItems = recommendationQuery.data.data;

  return (
    <RecommendResultPage
      channels={mapRecommendationItemsToChannels(recommendationItems)}
      headerAction={null}
      headerTitle="저장된 채널 추천 결과예요"
      headerDescription="저장 시점의 추천 결과를 보여드려요"
      onCompare={(channelIds) => router.push(createChannelComparisonHref(channelIds))}
      serviceName="저장된 추천 결과"
    />
  );
}
