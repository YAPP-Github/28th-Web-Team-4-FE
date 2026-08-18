/** 채널 정보와 장점을 좌우로 분리한 인사이트 카드 안을 렌더링한다. */

import type { JSX } from 'react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type CompareResultChannelInsightSplitCardProps = {
  channel: CompareResultChannel;
};

/** 채널명·키워드와 장점을 세로 구분선 양쪽에 배치한다. */
export function CompareResultChannelInsightSplitCard({
  channel,
}: CompareResultChannelInsightSplitCardProps): JSX.Element {
  const titleId = `compare-result-channel-${channel.id}-split-insight-title`;

  return (
    <Box
      as="article"
      aria-labelledby={titleId}
      className="border-outline-low p-020 flex w-full flex-col items-start rounded-[var(--radius-m)] border"
    >
      <Box className="gap-030 flex w-full items-start">
        <Box className="gap-008 flex w-[94px] shrink-0 flex-col items-start">
          <Text as="h3" id={titleId} variant="subtitle-lg" className="text-text-default">
            {channel.name}
          </Text>
          <Box className="gap-004 flex flex-col items-start">
            {channel.insight.keyword.map((keyword) => (
              <Text key={keyword} variant="caption-lg" className="text-text-low">
                # {keyword}
              </Text>
            ))}
          </Box>
        </Box>

        <Box className="border-outline-lower gap-002 pl-030 flex min-w-0 flex-1 flex-col self-stretch border-l">
          {channel.insight.advantages.slice(0, 2).map((advantage) => (
            <Text as="p" key={advantage} variant="subtitle-xxs" className="text-text-medium w-full">
              {advantage}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
