import type { ChannelComparisonItemResponse, CountRangeResponse } from '@/shared/api/generated';
import { formatCountRange, formatWon } from '@/shared/lib/number-format';

import type { CompareResultChannel, CompareResultChannelMetric } from './compare-result-channel';
import { getTemporaryChannelLogoSrc } from './temporary-channel-logo';

const UNAVAILABLE_LABEL = '확인 불가';
const EMPTY_DETAIL_LABEL = '정보 없음';

function formatList(values: readonly string[]): string {
  return values.length > 0 ? values.join(' · ') : EMPTY_DETAIL_LABEL;
}

function formatNullableDetail(value: string | null): string {
  const normalizedValue = value?.trim();

  return normalizedValue && normalizedValue.length > 0 ? normalizedValue : EMPTY_DETAIL_LABEL;
}

function getRangeCenter(range: CountRangeResponse | null): number | null {
  return range ? (range.min + range.max) / 2 : null;
}

function getMaximumRangeCenter(
  items: readonly ChannelComparisonItemResponse[],
  rangeKey: 'estImpressions' | 'estClicks',
): number {
  return items.reduce((maximum, item) => {
    const center = getRangeCenter(item[rangeKey]);

    return center === null ? maximum : Math.max(maximum, center);
  }, 0);
}

function createMetric(
  range: CountRangeResponse | null,
  maximumRangeCenter: number,
): CompareResultChannelMetric {
  const center = getRangeCenter(range);

  if (!range || center === null) {
    return {
      value: UNAVAILABLE_LABEL,
      fillPercentage: 0,
      available: false,
    };
  }

  return {
    value: formatCountRange(range),
    fillPercentage: maximumRangeCenter === 0 ? 0 : (center / maximumRangeCenter) * 100,
    available: true,
  };
}

function withInformationFallback(values: readonly string[]): readonly string[] {
  return values.length > 0 ? values : [EMPTY_DETAIL_LABEL];
}

export function mapChannelComparisonItemsToChannels(
  items: readonly ChannelComparisonItemResponse[],
): CompareResultChannel[] {
  const maximumImpressions = getMaximumRangeCenter(items, 'estImpressions');
  const maximumClicks = getMaximumRangeCenter(items, 'estClicks');

  return items.map((item) => {
    const logoSrc = getTemporaryChannelLogoSrc(item.channelName);

    return {
      id: item.channelId,
      name: item.channelName,
      matchRate: item.matchRate,
      logoSrc,
      cropIcon: logoSrc === '/compare-assets/naver.png',
      impressions: createMetric(item.estImpressions, maximumImpressions),
      clicks: createMetric(item.estClicks, maximumClicks),
      details: {
        minimumBudget:
          item.minBudgetWon === null ? EMPTY_DETAIL_LABEL : formatWon(item.minBudgetWon),
        primaryAudience: formatNullableDetail(item.audienceSummary),
        adFormats: formatList(item.adFormats),
        targetingMethods: formatList(item.targetingMethods),
      },
      cpc: item.cpcWon,
      cpm: item.cpmWon,
      insight: {
        keyword: withInformationFallback(item.tags),
        advantages: withInformationFallback(item.advantages),
      },
    };
  });
}
