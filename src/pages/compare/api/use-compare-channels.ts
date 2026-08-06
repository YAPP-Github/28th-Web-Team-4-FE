'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { COMPARE_CHANNEL_PAGE_SIZE } from '@/pages/compare/model/channel-page';
import { getChannelsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type {
  GetChannelsResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';

function selectChannelPage(
  data: GetChannelsResponse,
): PageResponseChannelListItemResponse | undefined {
  return data.data;
}

export function useCompareChannels(searchKeyword: string, page?: number) {
  const queryOptions = getChannelsOptions({
    query: {
      name: searchKeyword || undefined,
      page,
      size: page === undefined ? undefined : COMPARE_CHANNEL_PAGE_SIZE,
    },
  });

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
    select: selectChannelPage,
  });
}
