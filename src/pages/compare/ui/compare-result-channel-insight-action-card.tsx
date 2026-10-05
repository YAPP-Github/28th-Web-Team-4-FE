/** 설명과 키워드를 압축하고 화살표를 더한 인사이트 카드 안을 렌더링한다. */

import type { JSX } from 'react';
import { ChevronRight } from 'lucide-react';

import type { CompareResultChannel } from '@/pages/compare/model/compare-result-channel';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Badge } from '@/shared/ui/badge';
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
    <HStack
      as="article"
      aria-labelledby={titleId}
      className="bg-surface-lowest border-outline-low px-016 py-014 w-full rounded-[var(--radius-s)] border"
    >
      <Stack className="gap-010 min-w-0 flex-1 items-start">
        <Stack className="gap-002 w-full items-start">
          <Text as="h3" id={titleId} variant="subtitle-md" className="text-text-high w-full">
            {channel.name}
          </Text>
          <Stack className="gap-002 w-full items-start">
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
          </Stack>
        </Stack>
        <HStack className="gap-006">
          {channel.insight.keyword.map((keyword) => (
            <Badge key={keyword} frame="badge" tone="deep-gray">
              {keyword}
            </Badge>
          ))}
        </HStack>
      </Stack>
      <ChevronRight
        aria-hidden="true"
        className="text-icon-default size-020 shrink-0"
        strokeWidth={1.6}
      />
    </HStack>
  );
}
