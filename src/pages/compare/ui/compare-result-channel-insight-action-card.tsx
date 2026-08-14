/** 설명과 키워드를 압축하고 화살표를 더한 인사이트 카드 안을 렌더링한다. */

import type { JSX } from 'react';
import { ChevronRight } from 'lucide-react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

type CompareResultChannelInsightActionCardProps = {
  channel: CompareResultChannel;
};

/** 채널 인사이트를 화살표가 있는 컴팩트한 카드 형태로 표시한다. */
export function CompareResultChannelInsightActionCard({
  channel,
}: CompareResultChannelInsightActionCardProps): JSX.Element {
  const titleId = `compare-result-channel-${channel.id}-action-insight-title`;

  return (
    <Box
      as="article"
      aria-labelledby={titleId}
      className="bg-surface-lowest border-outline-low px-016 py-014 flex w-full items-center rounded-[var(--radius-s)] border"
    >
      <Box className="gap-010 flex min-w-0 flex-1 flex-col items-start">
        <Box className="gap-002 flex w-full flex-col items-start">
          <Text as="h3" id={titleId} variant="subtitle-md" className="text-text-high w-full">
            {channel.name}
          </Text>
          <Box className="gap-002 flex w-full flex-col items-start">
            {channel.insight.advantages.map((advantage) => (
              <Text
                as="p"
                key={advantage}
                variant="subtitle-xxs"
                className="text-text-medium w-full"
              >
                {advantage}
              </Text>
            ))}
          </Box>
        </Box>
        <Box className="gap-006 flex items-center">
          {channel.insight.keyword.map((keyword) => (
            <Badge key={keyword} frame="badge" tone="deep-gray">
              {keyword}
            </Badge>
          ))}
        </Box>
      </Box>
      <ChevronRight
        aria-hidden="true"
        className="text-icon-default size-020 shrink-0"
        strokeWidth={1.6}
      />
    </Box>
  );
}
