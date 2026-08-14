/**
 * 채널 비교 결과에서 CPC·CPM 비용 섹션을 조립한다.
 * 지표별 표시 문구를 단일 설정으로 관리하고 카드 UI에 전달한다.
 */

import type { JSX } from 'react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { keys } from '@/shared/lib/object';
import { Box } from '@/shared/ui/layout/box';

import {
  CompareResultChannelCostCard,
  type CompareResultChannelCostConfig,
  type CompareResultChannelCostMetric,
} from './compare-result-channel-cost-card';

const COST_METRIC_CONFIG = {
  cpc: {
    title: 'CPC',
    description: '클릭 1회당 드는 비용 (단위: 원)',
    recommendation: '클릭당 비용이 가장 저렴해요',
  },
  cpm: {
    title: 'CPM',
    description: '노출 1,000회당 드는 비용 (단위: 원)',
    recommendation: '노출당 비용이 가장 저렴해요',
  },
} as const satisfies Record<CompareResultChannelCostMetric, CompareResultChannelCostConfig>;

const COST_METRIC_KEYS = keys(COST_METRIC_CONFIG);

/** CPC·CPM 비용 비교 섹션에 필요한 채널 목록. */
export type CompareResultChannelCostProps = {
  /** 같은 비용 지표로 비교할 채널. */
  channels: readonly CompareResultChannel[];
};

/** 채널별 CPC·CPM 카드를 하나의 반응형 섹션으로 표시한다. */
export function CompareResultChannelCost({ channels }: CompareResultChannelCostProps): JSX.Element {
  return (
    <Box
      as="section"
      aria-label="채널별 CPC와 CPM"
      className="gap-020 flex w-full flex-col lg:flex-row"
    >
      {COST_METRIC_KEYS.map((metric) => (
        <CompareResultChannelCostCard
          key={metric}
          channels={channels}
          metric={metric}
          config={COST_METRIC_CONFIG[metric]}
        />
      ))}
    </Box>
  );
}
