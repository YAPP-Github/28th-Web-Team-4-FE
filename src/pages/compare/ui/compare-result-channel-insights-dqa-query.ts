/** 채널 인사이트 DQA에서 공유하는 URL 쿼리 파서를 정의한다. */

import { parseAsBoolean, parseAsStringLiteral } from 'nuqs';

import { COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS } from './compare-result-channel-insight-card';

export const CHANNEL_INSIGHT_DQA_MODE = 'channel-insight';

export const channelInsightDqaModeParser = parseAsStringLiteral([CHANNEL_INSIGHT_DQA_MODE]);

export const channelInsightVariantParser = parseAsStringLiteral(
  COMPARE_RESULT_CHANNEL_INSIGHT_VARIANTS,
)
  .withDefault('stacked')
  .withOptions({ history: 'replace', shallow: true });

export const channelInsightOpenParser = parseAsBoolean
  .withDefault(true)
  .withOptions({ history: 'replace', shallow: true });
