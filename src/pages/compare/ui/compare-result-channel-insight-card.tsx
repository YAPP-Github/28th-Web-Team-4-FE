/** DQA에서 선택한 레이아웃에 맞는 채널 인사이트 카드 안을 연결한다. */

import type { JSX } from 'react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelInsightActionCard } from './compare-result-channel-insight-action-card';
import { CompareResultChannelInsightSplitCard } from './compare-result-channel-insight-split-card';
import { CompareResultChannelInsightStackedCard } from './compare-result-channel-insight-stacked-card';

export const COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS = ['split', 'action', 'stacked'] as const;

/** DQA에서 비교할 수 있는 채널 인사이트 카드 레이아웃. */
export type CompareResultChannelInsightVariant =
  (typeof COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS)[number];

type CompareResultChannelInsightCardProps = {
  channel: CompareResultChannel;
  variant: CompareResultChannelInsightVariant;
};

/** 선택된 variant에 대응하는 인사이트 카드만 렌더링한다. */
export function CompareResultChannelInsightCard({
  channel,
  variant,
}: CompareResultChannelInsightCardProps): JSX.Element {
  if (variant === 'split') {
    return <CompareResultChannelInsightSplitCard channel={channel} />;
  }

  if (variant === 'action') {
    return <CompareResultChannelInsightActionCard channel={channel} />;
  }

  return <CompareResultChannelInsightStackedCard channel={channel} />;
}
