'use client';

import { useQuery } from '@tanstack/react-query';

import { getChannelsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetChannelsResponse } from '@/shared/api/generated';
import { createSimulatorRecommendationSelections } from '@/pages/simulator/model/simulator-recommendation-selection';
import { useMyRecommendations } from '@/shared/api/use-my-recommendations';

const RECOMMENDATION_LIST_SIZE = 50;
const CHANNEL_LIST_SIZE = 100;

function selectChannels(data: GetChannelsResponse) {
  return data.data.content;
}

/** 시뮬레이터 추천 선택 화면에 필요한 저장 추천과 채널 식별자를 함께 조회한다. */
export function useRecommendationSelectionData() {
  const recommendationsQuery = useMyRecommendations({
    size: RECOMMENDATION_LIST_SIZE,
  });
  const recommendationSummaries = recommendationsQuery.data?.data.content ?? [];
  const shouldLoadChannels = recommendationsQuery.isSuccess && recommendationSummaries.length > 0;
  const channelsQuery = useQuery({
    ...getChannelsOptions({
      query: {
        page: 0,
        size: CHANNEL_LIST_SIZE,
      },
    }),
    enabled: shouldLoadChannels,
    retry: false,
    select: selectChannels,
  });
  const recommendations =
    shouldLoadChannels && channelsQuery.data
      ? createSimulatorRecommendationSelections(recommendationSummaries, channelsQuery.data)
      : [];

  return {
    recommendations,
    isPending: recommendationsQuery.isPending || (shouldLoadChannels && channelsQuery.isPending),
    isError: recommendationsQuery.isError || (shouldLoadChannels && channelsQuery.isError),
  };
}
