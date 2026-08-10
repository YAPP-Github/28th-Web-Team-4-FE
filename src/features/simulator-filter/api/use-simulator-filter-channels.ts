'use client';

import { useQueries } from '@tanstack/react-query';

import { getChannelOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetChannelResponse } from '@/shared/api/generated';

import type { SimulatorFilterChannel } from '@/features/simulator-filter/model/simulator-filter-options';

function selectChannelInfo(response: GetChannelResponse): SimulatorFilterChannel {
  return {
    id: response.data.id,
    name: response.data.name,
  };
}

export function useSimulatorFilterChannels(channelIds: readonly string[]) {
  const queries = useQueries({
    queries: channelIds.map((channelId) => ({
      ...getChannelOptions({ path: { id: channelId } }),
      select: selectChannelInfo,
    })),
  });

  return {
    channels: queries.flatMap((query) => (query.data ? [query.data] : [])),
    isPending: queries.some((query) => query.isPending),
    isError: queries.some((query) => query.isError),
  };
}
