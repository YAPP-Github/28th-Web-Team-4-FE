'use client';

import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { createComparisonChannelOptions } from '@/pages/compare/model/comparison-channel-option';
import {
  getChannelsOptions,
  getRecommendationsOptions,
} from '@/shared/api/generated/@tanstack/react-query.gen';
import type {
  ChannelListItemResponse,
  GetChannelsResponse,
  GetRecommendationsResponse,
  RecommendationItemResponse,
} from '@/shared/api/generated';

const EMPTY_CHANNELS: ChannelListItemResponse[] = [];
const EMPTY_RECOMMENDATIONS: RecommendationItemResponse[] = [];

function selectChannelList(data: GetChannelsResponse): ChannelListItemResponse[] {
  return data.data?.content ?? EMPTY_CHANNELS;
}

function selectRecommendationList(data: GetRecommendationsResponse): RecommendationItemResponse[] {
  return data.data ?? EMPTY_RECOMMENDATIONS;
}

type UseComparisonChannelOptionsParams = {
  onboardingId: string | null;
  open: boolean;
  searchKeyword: string;
  selectedChannelIds: readonly string[];
};

/** 비교 결과에 추가할 검색·추천 채널 옵션을 조회한다. */
export function useComparisonChannelOptions({
  onboardingId,
  open,
  searchKeyword,
  selectedChannelIds,
}: UseComparisonChannelOptionsParams) {
  const hasOnboardingId = onboardingId !== null && onboardingId.length > 0;
  const normalizedSearchKeyword = searchKeyword.trim();
  const isSearchEnabled = open && normalizedSearchKeyword.length > 0;
  const isRecommendationEnabled = open && hasOnboardingId;
  const [channelsQuery, recommendationsQuery] = useQueries({
    queries: [
      {
        ...getChannelsOptions({
          query: { name: normalizedSearchKeyword || undefined },
        }),
        enabled: isSearchEnabled,
        placeholderData: keepPreviousData,
        retry: false,
        select: selectChannelList,
      },
      {
        ...getRecommendationsOptions({
          query: { onboardingId: onboardingId ?? '' },
        }),
        enabled: isRecommendationEnabled,
        retry: false,
        select: selectRecommendationList,
      },
    ],
  });
  const searchedChannels = isSearchEnabled
    ? (channelsQuery.data ?? EMPTY_CHANNELS)
    : EMPTY_CHANNELS;
  const recommendations = isRecommendationEnabled
    ? (recommendationsQuery.data ?? EMPTY_RECOMMENDATIONS)
    : EMPTY_RECOMMENDATIONS;
  const isError = isSearchEnabled && channelsQuery.isError;
  const isPending =
    isSearchEnabled &&
    !isError &&
    (channelsQuery.isPending || (isRecommendationEnabled && recommendationsQuery.isPending));

  return {
    options: createComparisonChannelOptions({
      recommendations,
      searchedChannels,
      selectedChannelIds,
    }),
    isPending,
    isError,
    refetch: channelsQuery.refetch,
  };
}
