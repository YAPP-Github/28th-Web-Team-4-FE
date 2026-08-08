'use client';

import type { JSX } from 'react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

export type ChannelDetailSummaryPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailSummaryPanel({
  channel,
}: ChannelDetailSummaryPanelProps): JSX.Element {
  if (channel.summary.paragraphs.length === 0) {
    return (
      <Text as="p" variant="body-xl" className="text-text-medium">
        등록된 핵심 요약이 없습니다.
      </Text>
    );
  }

  return (
    <Stack className="w-full items-start gap-0">
      {channel.summary.paragraphs.map((paragraph) => (
        <Text key={paragraph} as="p" variant="subtitle-xxs" className="text-text-medium">
          {paragraph}
        </Text>
      ))}
    </Stack>
  );
}
