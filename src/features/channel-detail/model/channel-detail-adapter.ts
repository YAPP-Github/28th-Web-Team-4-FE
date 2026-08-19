import type {
  AudienceMetricResponse,
  ChannelDetailResponse,
  ProductResponse,
} from '@/shared/api/generated';

import { createRecommendationReason } from '@/features/channel-detail/lib/create-recommendation-reason';

import type { ChannelAudienceMetric, ChannelDetail, ChannelProductRow } from './channel-detail';

const EMPTY_VALUE = '-';

type ChannelDetailApiModel = NonNullable<ChannelDetailResponse>;
type PrimaryGender = ChannelDetailApiModel['primaryGender'];
type ChannelDetailResponseForAdapter = Omit<ChannelDetailApiModel, 'audienceTraits'> & {
  audienceTraits?: string | null;
};

function getNonEmptyText(value?: string | null): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : undefined;
}

function getNonEmptyTextList(values: readonly string[]): string[] {
  return values.flatMap((value) => {
    const text = getNonEmptyText(value);
    return text ? [text] : [];
  });
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

function formatWon(value: number): string {
  if (value >= 10_000 && value % 10_000 === 0) {
    return `${formatNumber(value / 10_000)}만 원`;
  }

  return `${formatNumber(value)}원`;
}

function formatBudgetRange(minBudgetWon?: number, maxBudgetWon?: number): string {
  if (minBudgetWon === undefined && maxBudgetWon === undefined) {
    return EMPTY_VALUE;
  }

  if (minBudgetWon !== undefined && maxBudgetWon !== undefined) {
    if (minBudgetWon === maxBudgetWon) {
      return formatWon(minBudgetWon);
    }

    return `${formatWon(minBudgetWon)}~${formatWon(maxBudgetWon)}`;
  }

  if (minBudgetWon !== undefined) {
    return `${formatWon(minBudgetWon)} 이상`;
  }

  if (maxBudgetWon !== undefined) {
    return `${formatWon(maxBudgetWon)} 이하`;
  }

  return EMPTY_VALUE;
}

function formatExpectedImpressions(product: ProductResponse): string {
  const expectedImpressions = product.expectedImpressions ?? undefined;

  if (expectedImpressions === undefined) {
    return EMPTY_VALUE;
  }

  const impressions = `${formatNumber(expectedImpressions)}회`;
  return product.expectedPeriod ? `${impressions} / ${product.expectedPeriod}` : impressions;
}

function formatExpectedClicks(product: ProductResponse): string {
  return typeof product.expectedClicks === 'number'
    ? `${formatNumber(product.expectedClicks)}회`
    : EMPTY_VALUE;
}

function toProductRow(product: ProductResponse): ChannelProductRow {
  const productName = getNonEmptyText(product.productName);
  const inventoryType = getNonEmptyText(product.inventoryType);

  return {
    id: product.id,
    name: productName ?? inventoryType ?? '상품명 미제공',
    // null → undefined 정규화 후 포맷 (null이 0으로 표시되던 문제 방지)
    budgetRange: formatBudgetRange(
      product.minBudgetWon ?? undefined,
      product.maxBudgetWon ?? undefined,
    ),
    expectedImpressions: formatExpectedImpressions(product),
    expectedClicks: formatExpectedClicks(product),
    isExecutable: product.isExecutable,
  };
}

function formatPrimaryGender(gender: PrimaryGender): string {
  switch (gender) {
    case 'MALE':
      return '남성';
    case 'FEMALE':
      return '여성';
    case 'ALL':
      return '전체';
  }
}

function toAudienceMetric(metric: AudienceMetricResponse): ChannelAudienceMetric {
  return {
    label: getNonEmptyText(metric.metricName) ?? EMPTY_VALUE,
    value: getNonEmptyText(metric.valueText) ?? EMPTY_VALUE,
  };
}

export function toChannelDetailViewModel(channel: ChannelDetailResponseForAdapter): ChannelDetail {
  const tagline = getNonEmptyText(channel.tagline) ?? '';
  const description = getNonEmptyText(channel.description);

  return {
    id: channel.id,
    name: channel.name,
    logoUrl: channel.logoUrl?.trim() ?? '',
    tagline: tagline ?? '',
    summary: {
      keywords: getNonEmptyTextList(channel.tags),
      paragraphs: description ? [description] : [],
      recommendationReason: createRecommendationReason(channel.recommendationBasis),
    },
    products: channel.products.map(toProductRow),
    productsNote: '일부 채널은 해당 지표를 공개하지 않아요.',
    audience: {
      primaryAgeBand: getNonEmptyText(channel.primaryAgeBand) ?? EMPTY_VALUE,
      primaryGender: formatPrimaryGender(channel.primaryGender),
      metrics: channel.audienceMetrics.map(toAudienceMetric),
      traits: getNonEmptyText(channel.audienceTraits) ?? EMPTY_VALUE,
    },
    similarCases: channel.references,
  };
}
