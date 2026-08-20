/**
 * 하나의 비용 지표를 카드로 표현한다.
 * 채널 값의 범위와 최저 비용 채널을 계산해 각 차트 열에 전달한다.
 */

import type { JSX } from 'react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

import { CompareResultChannelCostBar } from './compare-result-channel-cost-bar';

/** 비용 비교 카드에서 지원하는 지표. */
export type CompareResultChannelCostMetric = 'cpc' | 'cpm';

/** 비용 지표별 제목과 사용자 안내 문구. */
export type CompareResultChannelCostConfig = {
  /** 카드 제목으로 표시할 지표명. */
  title: string;
  /** 지표의 계산 기준과 단위 설명. */
  description: string;
  /** 최저 비용 채널 위에 표시할 안내 문구. */
  recommendation: string;
};

type CompareResultChannelCostCardProps = {
  channels: readonly CompareResultChannel[];
  metric: CompareResultChannelCostMetric;
  config: CompareResultChannelCostConfig;
};

type CompareResultChannelCostColumnProps = {
  channel: CompareResultChannel;
  metric: CompareResultChannelCostMetric;
  maximumValue: number;
  minimumValue: number | null;
  uniqueMinimum: boolean;
  recommendation: string;
};

function getChannelNameClassName(value: number | null, recommended: boolean): string {
  if (recommended) {
    return 'text-text-high';
  }

  return value === null ? 'text-text-low' : 'text-text-default';
}

/** 채널 하나의 비용 막대와 채널명을 카드 열로 표시한다. */
function CompareResultChannelCostColumn({
  channel,
  metric,
  maximumValue,
  minimumValue,
  uniqueMinimum,
  recommendation,
}: CompareResultChannelCostColumnProps): JSX.Element {
  const value = channel[metric];
  const recommended = value !== null && minimumValue !== null && value === minimumValue;

  return (
    <Box className="gap-010 flex min-w-0 flex-col items-center">
      <CompareResultChannelCostBar
        value={value}
        maximumValue={maximumValue}
        recommended={recommended}
        recommendation={recommendation}
        showRecommendation={recommended && uniqueMinimum}
      />
      <Text
        variant={recommended ? 'subtitle-xs' : 'subtitle-xxs'}
        className={cn('w-full truncate text-center', getChannelNameClassName(value, recommended))}
      >
        {channel.name}
      </Text>
    </Box>
  );
}

/**
 * 하나의 비용 지표를 채널별로 비교하고 최저 비용 채널을 강조한다.
 * null 값은 최댓값·최솟값 계산에서 제외한다.
 */
export function CompareResultChannelCostCard({
  channels,
  metric,
  config,
}: CompareResultChannelCostCardProps): JSX.Element {
  const availableValues = channels.flatMap((channel) => {
    const value = channel[metric];

    return value === null ? [] : [value];
  });
  const maximumValue = Math.max(...availableValues, 1);
  const minimumValue = availableValues.length > 0 ? Math.min(...availableValues) : null;
  const uniqueMinimum =
    minimumValue !== null &&
    channels.filter((channel) => channel[metric] === minimumValue).length === 1;
  const titleId = `compare-result-channel-${metric}-title`;

  return (
    <Box
      as="section"
      aria-labelledby={titleId}
      className="bg-surface-lowest px-030 py-024 flex h-[244px] w-full flex-col rounded-[var(--radius-l)] lg:w-[386px]"
    >
      <Box className="gap-002 flex flex-col">
        <Text as="h2" id={titleId} variant="heading-lg" className="text-text-highest">
          {config.title}
        </Text>
        <Text variant="body-xs" className="text-text-low">
          {config.description}
        </Text>
      </Box>
      <Box className="border-outline-low mt-012 pt-020 border-t">
        <Box
          className="gap-002 grid items-end"
          style={{ gridTemplateColumns: `repeat(${channels.length}, minmax(0, 1fr))` }}
        >
          {channels.map((channel) => (
            <CompareResultChannelCostColumn
              key={channel.id}
              channel={channel}
              metric={metric}
              maximumValue={maximumValue}
              minimumValue={minimumValue}
              uniqueMinimum={uniqueMinimum}
              recommendation={config.recommendation}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
