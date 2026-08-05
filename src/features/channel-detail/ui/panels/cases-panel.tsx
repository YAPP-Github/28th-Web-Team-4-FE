'use client';

import type { JSX } from 'react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import { Stack } from '@/shared/ui/layout/stack';
import { Text } from '@/shared/ui/text';

export type ChannelDetailCasesPanelProps = {
  channel: ChannelDetail;
};

export function ChannelDetailCasesPanel({ channel }: ChannelDetailCasesPanelProps): JSX.Element {
  if (channel.similarCases.length === 0) {
    return (
      <Text as="p" variant="body-xl" className="text-text-medium">
        등록된 유사 사례가 없습니다.
      </Text>
    );
  }

  return (
    <Stack as="ul" className="w-full items-start gap-0">
      {channel.similarCases.map((item) => (
        <Text
          key={item}
          as="li"
          variant="subtitle-xxs"
          className="text-text-default list-inside list-disc"
        >
          {item}
        </Text>
      ))}
    </Stack>
  );
}
