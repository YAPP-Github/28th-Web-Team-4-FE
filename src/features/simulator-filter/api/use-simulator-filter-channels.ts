'use client';

import { useQueries } from '@tanstack/react-query';

import { getChannelOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetChannelResponse, PricingResponse } from '@/shared/api/generated';

import type {
  SimulatorChannelCost,
  SimulatorFilterChannel,
} from '@/features/simulator-filter/model/simulator-filter-options';

function getCheapestCost(
  pricings: readonly PricingResponse[],
  pricingModel?: PricingResponse['pricingModel'],
): SimulatorChannelCost | null {
  return pricings.reduce<SimulatorChannelCost | null>((cheapest, pricing) => {
    if (
      pricing.currency !== 'KRW' ||
      typeof pricing.value !== 'number' ||
      (pricingModel && pricing.pricingModel !== pricingModel)
    ) {
      return cheapest;
    }

    if (!cheapest || pricing.value < cheapest.value) {
      return {
        pricingModel: pricing.pricingModel,
        value: pricing.value,
        valueMax: pricing.valueMax,
      };
    }

    return cheapest;
  }, null);
}

function selectRepresentativeCost(response: GetChannelResponse): SimulatorChannelCost | null {
  const pricings = response.data.products.flatMap((product) => product.pricing);

  return getCheapestCost(pricings, 'CPC') ?? getCheapestCost(pricings, 'CPM');
}

function selectChannelInfo(response: GetChannelResponse): SimulatorFilterChannel {
  return {
    id: response.data.id,
    name: response.data.name,
    cost: selectRepresentativeCost(response),
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
