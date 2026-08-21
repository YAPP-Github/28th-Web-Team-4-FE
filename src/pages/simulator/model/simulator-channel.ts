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
  iconUrl?: string | null;
  type?: ChannelType;
  basisNote?: string;
  isExecutable?: boolean;
  additionalBudgetWon?: number;
  budgetWon?: number;
  cpcWon?: number | null;
  impressions: ChannelMetric;
  clicks: ChannelMetric;
  unavailable?: boolean;
};

export type SimulatorBasisTooltip = {
  title: string;
  description: readonly [string, string];
};

const SIMULATOR_BASIS_TOOLTIPS = {
  unavailableImpressionData: {
    title: '정보 확인이 어려워요',
    description: ['매체 특성상 상세 데이터를', '제공하지 않아요.'],
  },
} as const satisfies Record<string, SimulatorBasisTooltip>;

export function getSimulatorBasisTooltip(
  basisNote?: string,
  additionalBudgetWon?: number,
): SimulatorBasisTooltip | undefined {
  const basisType = basisNote?.split('/')[0]?.trim().replace(/\s+/g, ' ');

  if (
    basisType?.startsWith('집행 예산 부족') ||
    basisType?.startsWith('미집행 (배분 예산 0원)') ||
    basisType?.startsWith('배분 예산이 최소 단가보다 적어 집행 불가')
  ) {
    if (additionalBudgetWon === undefined || additionalBudgetWon <= 0) {
      return undefined;
    }

    return {
      title: '예산이 부족해요',
      description: [
        `예산을 ${formatSimulatorBudget(additionalBudgetWon)} 더 추가하면`,
        '광고할 수 있어요',
      ],
    };
  }

  if (
    basisType?.startsWith('노출 정보 미제공 상품 (집행 가능 여부만 판단)') ||
    basisType?.startsWith('견적 문의 필요 (등록된 단가 정보 없음)')
  ) {
    return SIMULATOR_BASIS_TOOLTIPS.unavailableImpressionData;
  }

  return undefined;
}

function getAdditionalBudgetWon(item?: SimulationItemResponse): number | undefined {
  if (!item || item.minBudgetWon === null) {
    return undefined;
  }

  const difference = item.minBudgetWon - item.allocatedBudgetWon;

  return difference > 0 ? difference : undefined;
}

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
      iconUrl: item?.iconUrl,
      basisNote: item?.basisNote,
      isExecutable: item?.isExecutable,
      additionalBudgetWon: getAdditionalBudgetWon(item),
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
