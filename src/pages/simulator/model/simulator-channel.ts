import type {
  CountRangeResponse,
  SimulationItemResponse,
  SimulationResponse,
} from '@/shared/api/generated';

import type { SimulatorFilterChannel } from '@/features/simulator-filter/model/simulator-filter-options';

export type ChannelType = 'naver' | 'newscash' | 'meta';

export type ChannelMetric = {
  value: string;
  fillPercentage: number;
};

export type ChannelResult = {
  channelId?: string;
  name: string;
  type?: ChannelType;
  impressions: ChannelMetric;
  clicks: ChannelMetric;
  unavailable?: boolean;
};

const NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');

export function formatSimulatorCount(value: number): string {
  return `${NUMBER_FORMATTER.format(value)}회`;
}

export function formatSimulatorCountRange(range?: CountRangeResponse): string {
  if (!range) {
    return formatSimulatorCount(0);
  }

  const min = NUMBER_FORMATTER.format(range.min);
  const max = NUMBER_FORMATTER.format(range.max);

  return range.min === range.max ? `${min}회` : `${min}~${max}회`;
}

function getMetricRange(
  item: SimulationItemResponse | undefined,
  metric: 'impressions' | 'clicks',
): CountRangeResponse | undefined {
  return metric === 'impressions' ? item?.estImpressions : item?.estClicks;
}

function getRangeCenter(range?: CountRangeResponse): number {
  return range ? (range.min + range.max) / 2 : 0;
}

function getFillPercentage(value: number, maxValue: number): number {
  if (maxValue === 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, (value / maxValue) * 100));
}

export function createChannelResults(
  channels: readonly SimulatorFilterChannel[],
  simulationResult?: SimulationResponse | null,
): readonly ChannelResult[] {
  if (!simulationResult) {
    return channels.map((channel) => ({
      channelId: channel.id,
      name: channel.name,
      impressions: { value: formatSimulatorCount(0), fillPercentage: 0 },
      clicks: { value: formatSimulatorCount(0), fillPercentage: 0 },
    }));
  }

  const resultByChannelId = new Map(
    simulationResult.items.map((item) => [item.channelId, item] as const),
  );
  const channelItems = channels.map((channel) => ({
    channel,
    item: resultByChannelId.get(channel.id),
  }));
  const maxImpressions = Math.max(
    ...channelItems.map(({ item }) => getRangeCenter(getMetricRange(item, 'impressions'))),
    0,
  );
  const maxClicks = Math.max(
    ...channelItems.map(({ item }) => getRangeCenter(getMetricRange(item, 'clicks'))),
    0,
  );

  return channelItems.map(({ channel, item }) => {
    const impressions = getMetricRange(item, 'impressions');
    const clicks = getMetricRange(item, 'clicks');

    return {
      channelId: channel.id,
      name: item?.channelName ?? channel.name,
      impressions: {
        value: formatSimulatorCountRange(impressions),
        fillPercentage: getFillPercentage(getRangeCenter(impressions), maxImpressions),
      },
      clicks: {
        value: formatSimulatorCountRange(clicks),
        fillPercentage: getFillPercentage(getRangeCenter(clicks), maxClicks),
      },
      unavailable: item ? !item.isExecutable : true,
    };
  });
}
