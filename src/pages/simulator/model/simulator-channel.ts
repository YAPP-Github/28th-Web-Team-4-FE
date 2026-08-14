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
  range?: CountRangeResponse;
};

export type ChannelResult = {
  channelId?: string;
  name: string;
  type?: ChannelType;
  budgetWon?: number;
  cpcWon?: number | null;
  impressions: ChannelMetric;
  clicks: ChannelMetric;
  unavailable?: boolean;
};

const NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');
const MAN_NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR', {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});
const COUNT_UNIT = 10_000;

export type SimulatorCountDisplay = {
  value: number;
  suffix: string;
  format?: Pick<Intl.NumberFormatOptions, 'maximumFractionDigits' | 'minimumFractionDigits'>;
};

export function getSimulatorCountDisplay(value: number): SimulatorCountDisplay {
  if (value >= COUNT_UNIT) {
    return {
      value: value / COUNT_UNIT,
      suffix: '만 회',
      format: {
        maximumFractionDigits: 1,
        minimumFractionDigits: 1,
      },
    };
  }

  return { value, suffix: '회' };
}

export function formatSimulatorCount(value: number): string {
  if (value >= COUNT_UNIT) {
    return `${MAN_NUMBER_FORMATTER.format(value / COUNT_UNIT)}만 회`;
  }

  return `${NUMBER_FORMATTER.format(value)}회`;
}

export function formatSimulatorCountRange(range?: CountRangeResponse): string {
  if (!range) {
    return formatSimulatorCount(0);
  }

  const useManUnit = range.min >= COUNT_UNIT || range.max >= COUNT_UNIT;

  if (useManUnit) {
    const min = MAN_NUMBER_FORMATTER.format(range.min / COUNT_UNIT);
    const max = MAN_NUMBER_FORMATTER.format(range.max / COUNT_UNIT);

    return range.min === range.max ? `${min}만 회` : `${min}~${max}만 회`;
  }

  const min = NUMBER_FORMATTER.format(range.min);
  const max = NUMBER_FORMATTER.format(range.max);

  return range.min === range.max ? `${min}회` : `${min}~${max}회`;
}

export function formatSimulatorTableCountRange(range?: CountRangeResponse): string {
  if (!range) {
    return '-';
  }

  const min = NUMBER_FORMATTER.format(range.min);
  const max = NUMBER_FORMATTER.format(range.max);

  return range.min === range.max ? `${min}회` : `${min}~${max}회`;
}

export function formatSimulatorBudget(value = 0): string {
  if (value % COUNT_UNIT === 0) {
    return `${NUMBER_FORMATTER.format(value / COUNT_UNIT)}만 원`;
  }

  return `${NUMBER_FORMATTER.format(value)}원`;
}

export function formatSimulatorCpc(value?: number | null): string {
  return typeof value === 'number' ? `${NUMBER_FORMATTER.format(value)}원` : '-';
}

function getMetricRange(
  item: SimulationItemResponse | undefined,
  metric: 'impressions' | 'clicks',
): CountRangeResponse | undefined {
  return (metric === 'impressions' ? item?.estImpressions : item?.estClicks) ?? undefined;
}

function getRangeCenter(range?: CountRangeResponse): number {
  return range ? (range.min + range.max) / 2 : 0;
}

function getFillPercentage(value: number, maxValue: number): number {
  if (maxValue === 0) {
    return 0;
  }

  const normalizedValue = Math.min(1, Math.max(0, value / maxValue));

  return Math.sqrt(normalizedValue) * 100;
}

export function createChannelResults(
  channels: readonly SimulatorFilterChannel[],
  simulationResult?: SimulationResponse | null,
): readonly ChannelResult[] {
  if (!simulationResult) {
    return channels.map((channel) => ({
      channelId: channel.id,
      name: channel.name,
      budgetWon: 0,
      cpcWon: null,
      impressions: {
        value: formatSimulatorCount(0),
        fillPercentage: 0,
        range: { min: 0, max: 0 },
      },
      clicks: {
        value: formatSimulatorCount(0),
        fillPercentage: 0,
        range: { min: 0, max: 0 },
      },
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
  return channelItems.map(({ channel, item }) => {
    const impressions = getMetricRange(item, 'impressions');
    const clicks = getMetricRange(item, 'clicks');

    return {
      channelId: channel.id,
      name: item?.channelName ?? channel.name,
      budgetWon: item?.allocatedBudgetWon ?? 0,
      cpcWon: item?.cpcWon,
      impressions: {
        value: formatSimulatorCountRange(impressions),
        fillPercentage: getFillPercentage(getRangeCenter(impressions), maxImpressions),
        range: impressions,
      },
      clicks: {
        value: formatSimulatorCountRange(clicks),
        fillPercentage: getFillPercentage(getRangeCenter(clicks), maxImpressions),
        range: clicks,
      },
      unavailable: item ? !item.isExecutable : true,
    };
  });
}
