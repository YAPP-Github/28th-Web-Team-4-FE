/**
 * Recharts 비용 막대와 추천 Tooltip을 렌더링하는 Client Component다.
 * 막대 높이를 기준으로 숫자와 Tooltip 위치를 함께 계산한다.
 */

'use client';

import type { JSX } from 'react';
import { Bar, BarChart, LabelList, YAxis } from 'recharts';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Tooltip } from '@/shared/ui/tooltip';

const COST_FORMATTER = new Intl.NumberFormat('ko-KR');
const COST_CHART_HEIGHT = 86;
const COST_CHART_MARGIN_TOP = 24;
const COST_CHART_PLOT_HEIGHT = COST_CHART_HEIGHT - COST_CHART_MARGIN_TOP;
const COST_VALUE_LABEL_GAP = 4;
const COST_VALUE_LABEL_RENDERED_HEIGHT = 18;
const COST_VALUE_LABEL_CENTER_OFFSET = COST_VALUE_LABEL_GAP + COST_VALUE_LABEL_RENDERED_HEIGHT / 2;

/** 비용 막대 하나를 렌더링하는 데 필요한 값과 추천 상태. */
type CompareResultChannelCostBarProps = {
  /** 원 단위 비용. 값이 없으면 null이다. */
  value: number | null;
  /** 같은 지표에 속한 채널 중 가장 큰 비용. */
  maximumValue: number;
  /** 최저 비용 채널로 강조할지 여부. */
  recommended: boolean;
  /** 추천 Tooltip에 표시할 안내 문구. */
  recommendation: string;
};

/** 추천 Tooltip을 막대 내부 좌표의 anchor 위에 표시한다. */
type RecommendationCalloutProps = {
  children: string;
  /** 차트 상단을 기준으로 한 숫자 중심의 y 좌표. */
  anchorTop: number;
};

/** 공용 Tooltip을 항상 보이는 추천 안내로 배치한다. */
function RecommendationCallout({ children, anchorTop }: RecommendationCalloutProps): JSX.Element {
  return (
    <Tooltip.Root
      placement="top"
      offset={16}
      strategy="absolute"
      allowFlip={false}
      allowShift={false}
    >
      <Tooltip.Anchor
        aria-hidden="true"
        className="absolute left-1/2 size-px -translate-x-1/2"
        style={{ top: anchorTop }}
      />
      <Tooltip.Content
        className="bg-surface-highest"
        arrowClassName="bg-surface-highest rotate-0 [clip-path:polygon(0_0,100%_0,50%_100%)]"
      >
        {children}
      </Tooltip.Content>
    </Tooltip.Root>
  );
}

/**
 * 비용을 막대 높이와 한국어 숫자 형식으로 표시한다.
 * Recharts의 기본 막대 애니메이션은 유지한다.
 */
export function CompareResultChannelCostBar({
  value,
  maximumValue,
  recommended,
  recommendation,
}: CompareResultChannelCostBarProps): JSX.Element {
  const label = value === null ? '-' : COST_FORMATTER.format(value);
  const barHeight = value === null ? 0 : (value / maximumValue) * COST_CHART_PLOT_HEIGHT;
  // Tooltip이 카드가 아닌 현재 막대의 숫자 중심을 따라가도록 y 좌표를 맞춘다.
  const recommendationAnchorTop = COST_CHART_HEIGHT - barHeight - COST_VALUE_LABEL_CENTER_OFFSET;

  return (
    <Box className="relative h-[86px] w-[94px]">
      <Box aria-hidden="true">
        <BarChart
          width={94}
          height={COST_CHART_HEIGHT}
          data={[{ value: value ?? 0, label }]}
          margin={{ top: COST_CHART_MARGIN_TOP, right: 0, bottom: 0, left: 0 }}
        >
          <YAxis type="number" domain={[0, maximumValue]} hide />
          <Bar
            dataKey="value"
            fill={recommended ? 'var(--color-text-primary)' : 'var(--color-surface-default)'}
            radius={4}
            barSize={33}
            minPointSize={value === null ? 2 : 0}
          >
            <LabelList
              dataKey="label"
              position="top"
              offset={8}
              className={cn(
                'typo-subtitle-lg',
                recommended ? 'fill-text-primary' : 'fill-text-low',
              )}
            />
          </Bar>
        </BarChart>
      </Box>
      {recommended ? (
        <RecommendationCallout anchorTop={recommendationAnchorTop}>
          {recommendation}
        </RecommendationCallout>
      ) : null}
    </Box>
  );
}
