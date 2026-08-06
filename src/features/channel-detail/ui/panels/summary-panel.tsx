'use client';

import type { JSX } from 'react';

import type {
  ChannelDetail,
  ChannelSummaryHighlight,
} from '@/features/channel-detail/model/channel-detail';
import { Badge } from '@/shared/ui/badge';
import { Box } from '@/shared/ui/layout/box';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

function RecommendReason({ highlight }: { highlight: ChannelSummaryHighlight }): JSX.Element {
  return (
    <Stack className="border-outline-low gap-004 px-020 py-014 w-full items-start rounded-[var(--radius-m)] border bg-transparent">
      <Text as="p" variant="subtitle-xs" className="text-text-low">
        추천 이유
      </Text>
      <Box as="p" className="typo-subtitle-md text-text-highest min-w-0">
        {highlight.segments.map((segment, index) => {
          if (segment.type === 'tag') {
            return (
              <Badge
                key={`${segment.value}-${index}`}
                frame="tag"
                tone="orange"
                className="mx-002 inline-flex align-middle"
              >
                {segment.value}
              </Badge>
            );
          }

          return <span key={`${segment.value}-${index}`}>{segment.value}</span>;
        })}
      </Box>
    </Stack>
  );
}

export type ChannelDetailSummaryPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailSummaryPanel({
  channel,
}: ChannelDetailSummaryPanelProps): JSX.Element {
  return (
    <Stack className="gap-020 w-full items-stretch">
      <Stack className="w-full items-start gap-0">
        {channel.summary.paragraphs.map((paragraph) => (
          <Text key={paragraph} as="p" variant="subtitle-xxs" className="text-text-medium">
            {paragraph}
          </Text>
        ))}
      </Stack>
      {channel.summary.highlights.map((highlight, index) => (
        <RecommendReason key={index} highlight={highlight} />
      ))}
    </Stack>
  );
}
