/**
 * Recharts 비용 막대와 추천 Tooltip을 렌더링하는 Client Component다.
 * 막대 높이를 기준으로 숫자와 Tooltip 위치를 함께 계산한다.
 */

'use client';

import type { JSX } from 'react';
import { Bar, BarChart, LabelList, type LabelProps, YAxis } from 'recharts';

import { Box } from '@/shared/ui/layout/box';
import { Tooltip } from '@/shared/ui/tooltip';

const COST_FORMATTER = new Intl.NumberFormat('ko-KR');
const COST_CHART_HEIGHT = 86;
const COST_CHART_MARGIN_TOP = 24;
const COST_CHART_PLOT_HEIGHT = COST_CHART_HEIGHT - COST_CHART_MARGIN_TOP;
const COST_VALUE_LABEL_OFFSET = 8;
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
  /** 최저값이 유일한 채널일 때만 추천 Tooltip을 표시한다. */
  showRecommendation?: boolean;
};

/** 추천 Tooltip을 막대 내부 좌표의 anchor 위에 표시한다. */
type RecommendationCalloutProps = {
  children: string;
  /** 차트 상단을 기준으로 한 숫자 중심의 y 좌표. */
  anchorTop: number;
};

type CostValueLabelProps = Pick<LabelProps, 'width' | 'x' | 'y'> & {
  available: boolean;
  label: string;
  recommended: boolean;
};

function getCostValueLabelClassName(available: boolean, recommended: boolean): string {
  if (!available) {
    return 'typo-body-xs fill-text-low';
  }

  return recommended ? 'typo-subtitle-lg fill-text-primary' : 'typo-subtitle-md fill-text-low';
}

/** Recharts가 전달한 막대 좌표를 기준으로 비용 라벨을 한 줄로 표시한다. */
function CostValueLabel({
  available,
  label,
  recommended,
  width = 0,
  x = 0,
  y = 0,
}: CostValueLabelProps): JSX.Element {
  const labelX = Number(x) + Number(width) / 2;
  const labelY = Number(y) - COST_VALUE_LABEL_OFFSET;

  return (
    <text
      x={labelX}
      y={labelY}
      textAnchor="middle"
      className={getCostValueLabelClassName(available, recommended)}
    >
      {label}
    </text>
  );
}

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
 * 값이 없으면 Recharts의 최소 막대 높이로 32×2px 기준선을 표시한다.
 */
export function CompareResultChannelCostBar({
  value,
  maximumValue,
  recommended,
  recommendation,
  showRecommendation = recommended,
}: CompareResultChannelCostBarProps): JSX.Element {
  const available = value !== null;
  const label = available ? COST_FORMATTER.format(value) : '확인 불가';
  const barHeight = available ? (value / maximumValue) * COST_CHART_PLOT_HEIGHT : 0;
  // Tooltip이 카드가 아닌 현재 막대의 숫자 중심을 따라가도록 y 좌표를 맞춘다.
  const recommendationAnchorTop = COST_CHART_HEIGHT - barHeight - COST_VALUE_LABEL_CENTER_OFFSET;

  return (
    <Box
      className="relative h-[86px] w-[94px]"
      data-availability={available ? 'available' : 'unavailable'}
      data-recommended={recommended ? 'true' : 'false'}
    >
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
            barSize={32}
            minPointSize={available ? 0 : 2}
          >
            <LabelList
              dataKey="label"
              content={
                <CostValueLabel available={available} label={label} recommended={recommended} />
              }
            />
          </Bar>
        </BarChart>
      </Box>
      {showRecommendation ? (
        <RecommendationCallout anchorTop={recommendationAnchorTop}>
          {recommendation}
        </RecommendationCallout>
      ) : null}
    </Box>
  );
}
