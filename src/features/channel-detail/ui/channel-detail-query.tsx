'use client';

import type { JSX } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { channelDetailQueryOptions } from '@/features/channel-detail/api/channel-detail-query';
import { ChannelDetailContent } from '@/features/channel-detail/ui/channel-detail-content';
import { ChannelDetailModalHeader } from '@/features/channel-detail/ui/channel-detail-modal-header';

export function ChannelDetailQuery({
  channelId,
  onboardingId,
}: {
  channelId: string;
  onboardingId?: string;
}): JSX.Element {
  const { data: channel } = useSuspenseQuery(channelDetailQueryOptions(channelId, onboardingId));

  return (
    <>
      <ChannelDetailModalHeader
        channel={{
          id: channel.id,
          name: channel.name,
          iconUrl: channel.iconUrl,
          description: channel.tagline,
        }}
      />
      <ChannelDetailContent channel={channel} />
    </>
  );
}
