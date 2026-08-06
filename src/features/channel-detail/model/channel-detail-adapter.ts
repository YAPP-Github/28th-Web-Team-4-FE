import type {
  AudienceMetricResponse,
  ChannelDetailResponse,
  ProductResponse,
} from '@/shared/api/generated';

import type { ChannelDetail, ChannelProductRow } from './channel-detail';

const EMPTY_VALUE = '-';

function getNonEmptyText(value?: string | null): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : undefined;
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

function formatCtr(product: ProductResponse): string | null {
  if (product.ctr !== undefined) {
    return `${formatNumber(product.ctr)}%`;
  }

  if (product.ctrMin !== undefined && product.ctrMax !== undefined) {
    return `${formatNumber(product.ctrMin)}~${formatNumber(product.ctrMax)}%`;
  }

  if (product.ctrMin !== undefined) {
    return `${formatNumber(product.ctrMin)}% 이상`;
  }

  if (product.ctrMax !== undefined) {
    return `${formatNumber(product.ctrMax)}% 이하`;
  }

  return null;
}

function formatExpectedImpressions(product: ProductResponse): string {
  if (product.expectedImpressions === undefined) {
    return EMPTY_VALUE;
  }

  const impressions = `${formatNumber(product.expectedImpressions)}회`;
  return product.expectedPeriod ? `${impressions} / ${product.expectedPeriod}` : impressions;
}

function toProductRow(product: ProductResponse): ChannelProductRow {
  const productName = getNonEmptyText(product.productName);
  const inventoryType = getNonEmptyText(product.inventoryType);

  return {
    id: product.id,
    name: productName ?? inventoryType ?? '상품명 미제공',
    budgetRange: formatBudgetRange(product.minBudgetWon, product.maxBudgetWon),
    expectedImpressions: formatExpectedImpressions(product),
    ctr: formatCtr(product),
  };
}

function formatPrimaryGender(gender: NonNullable<ChannelDetailResponse>['primaryGender']): string {
  switch (gender) {
    case 'MALE':
      return '남성';
    case 'FEMALE':
      return '여성';
    case 'ALL':
      return '전체';
    case undefined:
      return EMPTY_VALUE;
  }
}

function formatAudienceMetric(metric: AudienceMetricResponse): string {
  const textValue = metric.valueText?.trim();
  if (textValue) {
    return textValue;
  }

  if (metric.valueNumeric === null || metric.valueNumeric === undefined) {
    return EMPTY_VALUE;
  }

  return `${formatNumber(metric.valueNumeric)}${metric.unit?.trim() ?? ''}`;
}

export function toChannelDetailViewModel(
  channel: NonNullable<ChannelDetailResponse>,
): ChannelDetail {
  return {
    id: channel.id,
    name: channel.name,
    logoUrl: channel.logoUrl?.trim() ?? '',
    tagline: channel.description?.trim() ?? '',
    summary: {
      paragraphs: [channel.description, ...(channel.advantages ?? [])]
        .map((paragraph) => paragraph?.trim())
        .filter((paragraph): paragraph is string => Boolean(paragraph)),
    },
    products: channel.products.map(toProductRow),
    productsNote: '일부 채널은 해당 지표를 공개하지 않아요.',
    audience: {
      primaryAgeBand: getNonEmptyText(channel.primaryAgeBand) ?? EMPTY_VALUE,
      primaryGender: formatPrimaryGender(channel.primaryGender),
      traits:
        getNonEmptyText(channel.audienceTraits) ??
        getNonEmptyText(channel.audienceSummary) ??
        EMPTY_VALUE,
      metrics: channel.audienceMetrics.map((metric) => ({
        label: metric.period?.trim()
          ? `${metric.metricName} (${metric.period.trim()})`
          : metric.metricName,
        value: formatAudienceMetric(metric),
      })),
    },
    similarCases: channel.references,
  };
}
