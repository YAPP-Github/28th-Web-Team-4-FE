'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getChannelsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { ChannelListItemResponse, GetChannelsResponse } from '@/shared/api/generated';

function selectChannelList(data: GetChannelsResponse): ChannelListItemResponse[] {
  return data.data?.content ?? [];
}

export function usePerformanceChannelSearch(searchKeyword: string) {
  const normalizedKeyword = searchKeyword.trim();
  const queryOptions = getChannelsOptions({
    query: {
      name: normalizedKeyword || undefined,
    },
  });

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
    select: selectChannelList,
  });
}
