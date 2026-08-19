'use client';

/** URL로 공유 가능한 채널 인사이트 DQA 상태를 실제 결과 섹션에 연결한다. */

import { Suspense, type JSX } from 'react';
import dynamic from 'next/dynamic';
import { useQueryState } from 'nuqs';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelInsights } from './compare-result-channel-insights';
import {
  CHANNEL_INSIGHT_DQA_MODE,
  channelInsightDqaModeParser,
} from './compare-result-channel-insights-dqa-query';

const CompareResultChannelInsightsDqaPanel = dynamic(
  () =>
    import('./compare-result-channel-insights-dqa-panel').then(
      (module) => module.CompareResultChannelInsightsDqaPanel,
    ),
  { ssr: false },
);

type CompareResultChannelInsightsDqaProps = {
  channels: readonly CompareResultChannel[];
};

/** 쿼리 상태가 준비되는 동안에도 기본 인사이트 섹션을 유지한다. */
export function CompareResultChannelInsightsDqa({
  channels,
}: CompareResultChannelInsightsDqaProps): JSX.Element {
  return (
    <Suspense fallback={<CompareResultChannelInsights channels={channels} />}>
      <CompareResultChannelInsightsDqaContent channels={channels} />
    </Suspense>
  );
}

/** DQA 모드에서만 카드 안과 펼침 상태를 URL 쿼리로 제어한다. */
function CompareResultChannelInsightsDqaContent({
  channels,
}: CompareResultChannelInsightsDqaProps): JSX.Element {
  const [dqaMode] = useQueryState('dqa', channelInsightDqaModeParser);

  return dqaMode === CHANNEL_INSIGHT_DQA_MODE ? (
    <CompareResultChannelInsightsDqaPanel channels={channels} />
  ) : (
    <CompareResultChannelInsights channels={channels} />
  );
}
