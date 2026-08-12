'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getChannelsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type {
  GetChannelsResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';

import {
  type ChannelCategory,
  CHANNEL_PAGE_SIZE,
} from '@/features/channel-selection/model/channel-page';

function selectChannelPage(
  data: GetChannelsResponse,
): PageResponseChannelListItemResponse | undefined {
  return data.data;
}

type UseChannelsOptions = {
  categories: readonly ChannelCategory[];
  pageIndex: number;
  searchKeyword: string;
};

export function useChannels({ categories, pageIndex, searchKeyword }: UseChannelsOptions) {
  const queryOptions = getChannelsOptions({
    query: {
      name: searchKeyword || undefined,
      primaryCategory: categories.length > 0 ? [...categories] : undefined,
      page: pageIndex,
      size: CHANNEL_PAGE_SIZE,
    },
  });

  return useQuery({
    ...queryOptions,
    placeholderData: keepPreviousData,
    select: selectChannelPage,
  });
}
