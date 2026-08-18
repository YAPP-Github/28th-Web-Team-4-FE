'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import { getRecommendationsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetRecommendationsResponse } from '@/shared/api/generated/types.gen';
import { mapRecommendationItemsToChannels } from '@/pages/recommend-result/model/recommended-channels';

function selectRecommendationChannels(data: GetRecommendationsResponse) {
  return mapRecommendationItemsToChannels(data.data ?? []);
}

export function useRecommendations(onboardingId: string) {
  const queryOptions = getRecommendationsOptions({
    query: {
      onboardingId,
    },
  });

  return useSuspenseQuery({
    ...queryOptions,
    select: selectRecommendationChannels,
  });
}
