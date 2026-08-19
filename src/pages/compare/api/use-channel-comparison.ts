'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getChannelComparisonOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetChannelComparisonResponse } from '@/shared/api/generated';
import { mapChannelComparisonItemsToChannels } from '@/pages/compare/model/channel-comparison-adapter';

type UseChannelComparisonOptions = {
  channelIds: readonly string[];
  onboardingId: string | null;
};

function selectChannelComparison(data: GetChannelComparisonResponse) {
  return mapChannelComparisonItemsToChannels(data.data.items);
}

export function useChannelComparison({ channelIds, onboardingId }: UseChannelComparisonOptions) {
  const queryOptions = getChannelComparisonOptions({
    query: {
      channelIds: [...channelIds],
      ...(onboardingId === null ? {} : { onboardingId }),
    },
  });
  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
    select: selectChannelComparison,
  });
}
