/** 채널명, 키워드, 장점을 위에서 아래로 쌓은 인사이트 카드 안을 렌더링한다. */

import type { JSX } from 'react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type CompareResultChannelInsightStackedCardProps = {
  channel: CompareResultChannel;
};

/** 채널 인사이트의 모든 정보를 단일 세로 흐름으로 표시한다. */
export function CompareResultChannelInsightStackedCard({
  channel,
}: CompareResultChannelInsightStackedCardProps): JSX.Element {
  const titleId = `compare-result-channel-${channel.id}-stacked-insight-title`;

  return (
    <Box
      as="article"
      aria-labelledby={titleId}
      className="border-outline-low p-020 flex w-full flex-col items-start rounded-[var(--radius-m)] border"
    >
      <Box className="gap-008 flex w-full flex-col items-start">
        <Box className="gap-002 flex w-full flex-col items-start">
          <Text as="h3" id={titleId} variant="subtitle-lg" className="text-text-default w-full">
            {channel.name}
          </Text>
          <Box className="gap-004 flex items-start">
            {channel.insight.keyword.map((keyword) => (
              <Text key={keyword} variant="body-sm" className="text-text-low">
                # {keyword}
              </Text>
            ))}
          </Box>
        </Box>
        <Box className="gap-002 flex w-full flex-col items-start">
          {channel.insight.advantages.map((advantage) => (
            <Text as="p" key={advantage} variant="subtitle-xxs" className="text-text-medium w-full">
              {advantage}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
