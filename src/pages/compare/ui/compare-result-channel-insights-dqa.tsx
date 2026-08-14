'use client';

/** URL로 공유 가능한 채널 인사이트 DQA 상태를 실제 결과 섹션에 연결한다. */

import { Suspense, type JSX } from 'react';
import { parseAsBoolean, parseAsStringLiteral, useQueryStates } from 'nuqs';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';

import { COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS } from './compare-result-channel-insight-card';
import { CompareResultChannelInsights } from './compare-result-channel-insights';

const CHANNEL_INSIGHT_DQA_MODES = ['channel-insight'] as const;

const channelInsightDqaQueryParsers = {
  dqa: parseAsStringLiteral(CHANNEL_INSIGHT_DQA_MODES),
  insightVariant: parseAsStringLiteral(COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS).withDefault(
    'stacked',
  ),
  insightOpen: parseAsBoolean.withDefault(true),
};

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
  const [{ dqa, insightVariant, insightOpen }, setDqaQuery] = useQueryStates(
    channelInsightDqaQueryParsers,
    {
      history: 'replace',
      shallow: true,
    },
  );
  const isDqaMode = dqa === 'channel-insight';

  const handleOpenChange = (nextOpen: boolean) => {
    void setDqaQuery({ insightOpen: nextOpen });
  };

  return (
    <CompareResultChannelInsights
      channels={channels}
      variant={isDqaMode ? insightVariant : 'stacked'}
      open={isDqaMode ? insightOpen : undefined}
      onOpenChange={isDqaMode ? handleOpenChange : undefined}
    />
  );
}
