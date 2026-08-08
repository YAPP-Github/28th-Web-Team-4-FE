'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getChannelsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type {
  GetChannelsResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';

import { CHANNEL_PAGE_SIZE } from '@/features/channel-selection/model/channel-page';

function selectChannelPage(
  data: GetChannelsResponse,
): PageResponseChannelListItemResponse | undefined {
  return data.data;
}

export function useChannels(searchKeyword: string, page?: number) {
  const queryOptions = getChannelsOptions({
    query: {
      name: searchKeyword || undefined,
      page,
      size: page === undefined ? undefined : CHANNEL_PAGE_SIZE,
    },
  });

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
    select: selectChannelPage,
  });
}
